import React, { FunctionComponent, useState, useEffect } from 'react'
import { FieldArray, FormikProps, Formik } from 'formik'
import {
  Button,
  FormikForm,
  FormInput,
  Icon,
  StackTraceList,
  GraphError,
  CollapseList,
  Container,
  SelectOption,
  Text,
  Color,
  useModalHook,
  IconName,
  SelectWithSubview,
  Utils,
  SelectProps,
  Select,
  Link
} from '@wings-software/uikit'
import { debounce } from 'lodash-es'
import Highcharts, { XrangePointOptionsObject } from 'highcharts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import xhr from '@wings-software/xhr-async'
import cx from 'classnames'
import type { DSConfig } from '@wings-software/swagger-ts/definitions'
import type { IDBPDatabase } from 'idb'
import { ThirdPartyCallLogModal } from 'modules/cv/components/ThirdPartyCallLogs/ThirdPartyCallLogs'
import JsonSelectorFormInput from 'modules/cv/components/JsonSelector/JsonSelectorFormInput'
import DataSourceConfigPanel from 'modules/cv/components/DataSourceConfigPanel/DataSourceConfigPanel'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import { routeParams } from 'framework/exports'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import { CVObjectStoreNames } from 'modules/cv/hooks/IndexedDBHook/IndexedDBHook'
import { useToaster } from 'modules/common/exports'
import CreateNewEntitySubform from '../CreateNewEntitySubform/CreateNewEntitySubform'
import { SplunkDSConfig, createDefaultSplunkDSConfig } from './SplunkOnboardingUtils'
import { transformQueriesFromSplunk, SplunkColumnChartOptions, transformToSaveConfig } from './SplunkOnboardingUtils'
import i18n from './SplunkOnboarding.i18n'
import css from './SplunkOnboarding.module.scss'

const XHR_VALIDATION_GROUP = 'XHR_VALIDATION_GROUP'
const XHR_SAVED_SEARCH_GROUP = 'XHR_SAVED_SEARCH_GROUP'

const eventTypesOptions = [
  { label: 'Quality', value: 'Quality' },
  { label: 'Error', value: 'Error' },
  { label: 'Performance', value: 'Performance' }
]

interface SplunkConfigProps {
  index: number
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  dsConfig: SplunkDSConfig
  dataSourceId: string
  formikProps: FormikProps<{ dsConfigs: SplunkDSConfig[] }>
}

interface SplunkDataSourceFormProps {
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  splunkQueryOptions: SelectOption[]
  dsConfigs: SplunkDSConfig[]
  dataSourceId: string
  accountId: string
  productName: string
}

interface SplunkSampleLogProps {
  validationResult: ValidationDetails
  query?: string
  thirdPartyGUID?: string
}

interface ValidationErrorOrNoDataProps {
  error?: string
  noData?: {
    icon: IconName
    message: string
  }
  thirdPartyGUID?: string
  query?: string
}

interface SplunkPageHeadingProps {
  onAddQuery: (queryName?: string, splunkQuery?: string) => void
  splunkSavedSearches?: SelectOption[]
}

type ValidationDetails = {
  error?: string
  chartOptions?: Highcharts.Options
  loading: boolean
  ttlLogMessages?: number
  timeRange?: number
  sampleLogs?: { timestamp?: string; stackTrace?: string }[]
  serviceInstanceJSON?: object
}

async function validateConfig(
  accountId: string,
  dataSourceId: string,
  query: string,
  guid: string,
  updateState: (result: ValidationDetails) => void
): Promise<void> {
  xhr.abort(XHR_VALIDATION_GROUP)
  updateState({ loading: true })

  const { response, status, error } = await CVNextGenCVConfigService.validateSplunkConfig({
    accountId,
    dataSourceId,
    query,
    guid,
    xhrGroup: XHR_VALIDATION_GROUP
  })

  if (status === xhr.ABORTED) {
    return
  } else if (response?.resource) {
    SplunkColumnChartOptions.series = response.resource.histogram?.bars
      ? [
          {
            type: 'column',
            data: (response.resource.histogram.bars.map((bar: any) => [bar.timestamp, bar.count]) ||
              []) as XrangePointOptionsObject[]
          }
        ]
      : []
    updateState({
      loading: false,
      error: response.resource.errorMessage,
      ttlLogMessages: response.resource.histogram?.count,
      timeRange: response.resource.queryDurationMillis,
      sampleLogs:
        response.resource.samples?.rawSampleLogs?.map((sample: any) => ({
          timestamp: sample?.timestamp ? new Date(sample?.timestamp).toLocaleString() : '',
          stackTrace: sample?.raw
        })) || [],
      serviceInstanceJSON: response.resource?.samples?.sample || {},
      chartOptions: SplunkColumnChartOptions
    })
  } else if (error) {
    updateState({ loading: false, error: error.message })
  }
}

async function loadSplunkSavedSearches(
  accountId: string,
  dataSourceId: string,
  dbInstance?: IDBPDatabase
): Promise<{ savedSearches?: SelectOption[]; error?: string; status?: number }> {
  const splunkSavedSearches: { entityOptions: SelectOption[] } = await dbInstance?.get(
    CVObjectStoreNames.LIST_ENTITIES,
    dataSourceId
  )
  if (splunkSavedSearches?.entityOptions?.length) {
    return { savedSearches: splunkSavedSearches.entityOptions }
  }

  xhr.abort(XHR_SAVED_SEARCH_GROUP)
  const { status, error, response } = await CVNextGenCVConfigService.fetchQueriesFromSplunk({
    accountId,
    xhrGroup: XHR_SAVED_SEARCH_GROUP,
    dataSourceId,
    requestGUID: `${Utils.randomId()}-${dataSourceId}`
  })

  return {
    status,
    error,
    savedSearches: response?.resource?.length ? transformQueriesFromSplunk(response.resource) : []
  }
}

const debouncedValidateConfig = debounce(validateConfig, 1000)

function validate(values: DSConfig): { [fieldName: string]: string } | {} {
  const splunkConfig = values as SplunkDSConfig
  const errors: {
    envIdentifier?: string
    eventType?: string
    query?: string
    queryString?: string
    serviceIdentifier?: string
    serviceInstanceIdentifier?: string
    isValid?: string
    queryName?: string
  } = {}
  if (!splunkConfig.envIdentifier) {
    errors.envIdentifier = i18n.fieldValidations.envIdentifier
  }
  if (!splunkConfig.eventType) {
    errors.eventType = i18n.fieldValidations.eventType
  }
  if (!splunkConfig.query) {
    errors.query = i18n.fieldValidations.query
  }

  if (!splunkConfig.queryName) {
    errors.queryName = i18n.fieldValidations.queryName
  }

  if (!splunkConfig.serviceIdentifier) {
    errors.serviceIdentifier = i18n.fieldValidations.serviceIdentifier
  }

  if (!splunkConfig.serviceInstanceIdentifier) {
    errors.serviceInstanceIdentifier = i18n.fieldValidations.serviceInstanceFieldName
  }

  if (!splunkConfig.isValid) {
    errors.isValid = i18n.fieldValidations.isValidConfig
  }

  return errors
}

function validateSplunkConfigs(splunkConfigs: {
  dsConfigs: SplunkDSConfig[]
}): { dsConfigs: [{ [fieldName: string]: string }] | {} } {
  return { dsConfigs: splunkConfigs.dsConfigs?.map(config => validate(config)) || [] }
}

function ValidationErrorOrNoData(props: ValidationErrorOrNoDataProps): JSX.Element {
  const { error, noData, query, thirdPartyGUID } = props
  const [openModal, hideModal] = useModalHook(
    () => <ThirdPartyCallLogModal guid={thirdPartyGUID || ''} onHide={hideModal} verificationType="Splunk" />,
    [thirdPartyGUID]
  )
  if (error) {
    return (
      <Container>
        <GraphError
          linkText="View in Splunk"
          height="25"
          width="25"
          link={`https://splunk.dev.harness.io/en-GB/app/search/search?q=search%20${query}%20%7C%20timechart%20count%20span%3D7h%20%7C%20table%20_time%2C%20count&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-7d%40h&latest=now&display.general.type=visualizations&sid=1592475949.17188&display.page.search.tab=visualizations`}
          secondLinkText="View call logs"
          onSecondLinkClick={openModal}
        />
      </Container>
    )
  } else if (noData) {
    return (
      <Container height={215}>
        <NoDataCard
          icon={noData.icon}
          message={noData.message}
          buttonText={i18n.thirdPartyCallLogText}
          onClick={openModal}
        />
      </Container>
    )
  }

  return <Container />
}

function ValidationResult(props: SplunkSampleLogProps): JSX.Element {
  const { validationResult, query, thirdPartyGUID } = props
  const { loading, error, chartOptions, sampleLogs } = validationResult
  const chartSeries: Highcharts.SeriesColumnOptions[] = (chartOptions?.series as Highcharts.SeriesColumnOptions[]) || []
  const noChartData = !error && !loading && !chartSeries[0]?.data?.length

  if (!query?.length) {
    return <Container />
  } else if (loading) {
    return (
      <Container className={css.validationContainer}>
        <Icon name="steps-spinner" size={25} color={Color.GREY_600} className={css.loadingValidation} />
      </Container>
    )
  } else if (error) {
    return <ValidationErrorOrNoData error={error} query={query} thirdPartyGUID={thirdPartyGUID} />
  } else if (!sampleLogs?.length) {
    return (
      <ValidationErrorOrNoData
        noData={{ icon: 'main-warning', message: i18n.errorMessages.noSampleLogs }}
        query={query}
        thirdPartyGUID={thirdPartyGUID}
      />
    )
  }

  return (
    <>
      <Container className={css.validationContainer}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Container>
      <StackTraceList
        stackTraceList={sampleLogs}
        className={cx(css.sampleLogs, noChartData ? css.smallerHeight : undefined)}
        stackTracePanelClassName={css.sampleLog}
      />
    </>
  )
}

function SplunkConfig(props: SplunkConfigProps): JSX.Element {
  const { index, serviceOptions, dsConfig, dataSourceId, envOptions, formikProps } = props
  const [validationResult, setValidationResult] = useState<ValidationDetails>({
    loading: Boolean(dsConfig?.query?.length)
  })
  const [thirdPartyGUID, setThirdPartyGUID] = useState<string | undefined>()
  const { params } = routeParams()

  useEffect(() => {
    if (dsConfig?.query) {
      debouncedValidateConfig.cancel()
      const guid = `${Utils.randomId()}-${dataSourceId}-${new Date().getTime().toString()}`
      setThirdPartyGUID(guid)
      debouncedValidateConfig(params.accountId, dataSourceId, dsConfig.query, guid, setValidationResult)
    }
  }, [dsConfig?.query, dataSourceId, params.accountId])

  return (
    <Container className={css.onBoardingSection}>
      <Container className={css.leftSection}>
        <FormInput.Text name={`dsConfigs[${index}].queryName`} label={i18n.fieldLabels.queryName} />
        <FormInput.TextArea
          key={dsConfig?.id}
          name={`dsConfigs[${index}].query`}
          placeholder={i18n.placeholders.query}
          label={i18n.fieldLabels.query}
          onChange={() => {
            if (dsConfig?.serviceInstanceIdentifier) {
              formikProps.setFieldValue(`dsConfigs[${index}].serviceInstanceIdentifier`, '')
            }
          }}
        />
        <FormInput.Select
          name={`dsConfigs[${index}].eventType`}
          label={i18n.fieldLabels.eventType}
          items={eventTypesOptions}
        />
        <JsonSelectorFormInput
          name={`dsConfigs[${index}].serviceInstanceIdentifier`}
          label={i18n.fieldLabels.serviceInstanceFieldName}
          placeholder={
            !dsConfig?.query?.length
              ? i18n.placeholders.serviceInstanceFieldName.noData
              : i18n.placeholders.serviceInstanceFieldName.default
          }
          json={validationResult.serviceInstanceJSON}
          loading={validationResult.loading}
        />
        <FormInput.CustomRender
          name={`dsConfigs[${index}].serviceIdentifier`}
          key={serviceOptions[0]?.value as string}
          label={i18n.fieldLabels.service}
          render={() => (
            <SelectWithSubview
              changeViewButtonLabel={i18n.createNew}
              items={serviceOptions}
              subview={<CreateNewEntitySubform entityType="service" />}
            />
          )}
        />
        <FormInput.CustomRender
          name={`dsConfigs[${index}].envIdentifier`}
          key={envOptions[0]?.value as string}
          label={i18n.fieldLabels.environment}
          render={() => (
            <SelectWithSubview
              changeViewButtonLabel={i18n.createNew}
              items={envOptions}
              subview={<CreateNewEntitySubform entityType="environment" />}
            />
          )}
        />
      </Container>
      <Container className={css.rightSection}>
        <Text margin={{ bottom: 'small' }} color={Color.BLACK}>
          {i18n.validationResultTitle}
        </Text>
        <ValidationResult validationResult={validationResult} query={dsConfig?.query} thirdPartyGUID={thirdPartyGUID} />
      </Container>
    </Container>
  )
}

function SplunkPageHeading(props: SplunkPageHeadingProps): JSX.Element {
  const { onAddQuery, splunkSavedSearches = [] } = props
  return (
    <Container flex margin={{ bottom: 'medium' }}>
      <OnBoardingConfigSetupHeader
        iconProps={{
          name: 'service-splunk-with-name'
        }}
        iconClassName={css.splunkIcon}
        pageHeading={i18n.pageHeading}
      />
      <Container className={css.addQueryContainer}>
        <Link minimal withoutHref onClick={() => onAddQuery()} className={css.manuallyAdd}>
          {i18n.manuallyInputQueryButtonText}
        </Link>
        <Select
          className={css.selectQuery}
          size={'small' as SelectProps['size']}
          items={splunkSavedSearches}
          inputProps={{
            placeholder: i18n.addSavedSearchPlaceholder
          }}
          onChange={(item: SelectOption) => onAddQuery(item.label, item.value as string)}
          key={splunkSavedSearches?.[0]?.label}
        />
      </Container>
    </Container>
  )
}

function SplunkDataSourceForm(props: SplunkDataSourceFormProps): JSX.Element {
  const { dsConfigs, serviceOptions, envOptions, splunkQueryOptions, dataSourceId, accountId, productName } = props
  return (
    <Formik
      validate={validateSplunkConfigs}
      initialValues={{ dsConfigs }}
      onSubmit={() => undefined}
      enableReinitialize={true}
      validateOnBlur={true}
    >
      {(formikProps: FormikProps<{ dsConfigs: SplunkDSConfig[] }>) => {
        return (
          <FormikForm>
            <FieldArray
              name="dsConfigs"
              render={arrayHelpers => {
                return (
                  <Container>
                    <SplunkPageHeading
                      onAddQuery={(queryName?: string, query?: string) =>
                        arrayHelpers.unshift(
                          createDefaultSplunkDSConfig(accountId, dataSourceId, productName, queryName, query)
                        )
                      }
                      splunkSavedSearches={splunkQueryOptions}
                    />
                    <CollapseList defaultOpenIndex={0}>
                      {formikProps.values?.dsConfigs?.map((dsConfig: SplunkDSConfig, index: number) => {
                        return (
                          <DataSourceConfigPanel
                            key={dsConfig?.id}
                            entityName={dsConfig?.queryName || ''}
                            index={index}
                            validateConfig={validate}
                            transformToSavePayload={transformToSaveConfig}
                            onRemove={() => arrayHelpers.remove(index)}
                            touched={formikProps.touched}
                            values={formikProps.values}
                            setFieldError={formikProps.setFieldError}
                            setFieldTouched={formikProps.setFieldTouched}
                          >
                            <SplunkConfig
                              dsConfig={dsConfig}
                              index={index}
                              formikProps={formikProps}
                              dataSourceId={dataSourceId}
                              serviceOptions={serviceOptions}
                              envOptions={envOptions}
                            />
                          </DataSourceConfigPanel>
                        )
                      })}
                    </CollapseList>
                  </Container>
                )
              }}
            />
            <Container className={css.actionButtons}>
              <Button large intent="primary" text={i18n.nextButton} width={120} type="button" />
            </Container>
          </FormikForm>
        )
      }}
    </Formik>
  )
}

const SplunkOnboarding: FunctionComponent<any> = props => {
  const { configs, serviceOptions, locationContext, indexedDB, envOptions } = props
  const [splunkQueryOptions, setSplunkQueryOptions] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])
  const {
    params: { accountId }
  } = routeParams()
  const toaster = useToaster()

  useEffect(() => {
    loadSplunkSavedSearches(accountId, locationContext?.dataSourceId, indexedDB).then(result => {
      const { error, status, savedSearches } = result
      if (status === xhr.ABORTED) {
        return
      } else if (error) {
        toaster.showError(error)
      } else {
        setSplunkQueryOptions(savedSearches ?? [])
      }
    })
  }, [accountId, locationContext?.dataSourceId, indexedDB])

  return (
    <Container className={css.main}>
      <SplunkDataSourceForm
        serviceOptions={serviceOptions}
        envOptions={envOptions}
        dsConfigs={configs}
        accountId={accountId}
        productName={locationContext.products?.[0]}
        dataSourceId={locationContext?.dataSourceId}
        splunkQueryOptions={splunkQueryOptions}
      />
    </Container>
  )
}

export default SplunkOnboarding
