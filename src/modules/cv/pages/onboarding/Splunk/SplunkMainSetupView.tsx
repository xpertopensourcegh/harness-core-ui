import React, { useState, useEffect } from 'react'
import { FieldArray, FormikProps, Formik } from 'formik'
import {
  FormikForm,
  FormInput,
  Icon,
  StackTraceList,
  CollapseList,
  Container,
  SelectOption,
  Text,
  Color,
  useModalHook,
  IconName,
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
import { SplunkDSConfig, createDefaultSplunkDSConfig } from './SplunkMainSetupViewUtils'
import { transformQueriesFromSplunk, SplunkColumnChartOptions, transformToSaveConfig } from './SplunkMainSetupViewUtils'
import i18n from './SplunkMainSetupView.i18n'
import { PageData, SaveConfigToIndexedDB } from '../SaveConfigToIndexedDB/SaveConfigToIndexedDB'
import css from './SplunkMainSetupView.module.scss'

const XHR_VALIDATION_GROUP = 'XHR_VALIDATION_GROUP'
const XHR_SAVED_SEARCH_GROUP = 'XHR_SAVED_SEARCH_GROUP'

const EventTypesOptions = Object.values(i18n.splunkEntityTypeOptions).map(val => ({ label: val, value: val }))

interface SplunkOnBoardingProps {
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  configs: SplunkDSConfig[]
  locationContext: PageData
  indexedDB?: IDBPDatabase
}

interface SplunkOnBoardingProps {
  serviceOptions: SelectOption[]
  envOptions: SelectOption[]
  configs: SplunkDSConfig[]
  locationContext: PageData
  indexedDB?: IDBPDatabase
}

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
  pageData: PageData
  orgId: string
  projectId: string
  dbInstance?: IDBPDatabase
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
  orgId: string,
  projectId: string,
  updateState: (result: ValidationDetails) => void
): Promise<void> {
  xhr.abort(XHR_VALIDATION_GROUP)
  updateState({ loading: true })

  const { response, status, error } = await CVNextGenCVConfigService.validateSplunkConfig({
    accountId,
    dataSourceId,
    query,
    guid,
    orgId,
    projectId,
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
  orgId: string,
  projectId: string,
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
    orgId,
    projectId,
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

  if (!noData && !error) return <Container />
  return (
    <Container className={css.noDataErrorContainer}>
      <NoDataCard
        icon={noData?.icon || 'error'}
        message={noData?.message || error || ''}
        buttonText={i18n.thirdPartyCallLogText}
        onClick={openModal}
      />
      <Link
        target="_blank"
        href={`https://splunk.dev.harness.io/en-GB/app/search/search?q=search%20${query}%20%7C%20timechart%20count%20span%3D7h%20%7C%20table%20_time%2C%20count&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-7d%40h&latest=now&display.general.type=visualizations&sid=1592475949.17188&display.page.search.tab=visualizations`}
        className={css.viewInSplunkLink}
      >
        {i18n.viewInSplunkLinkText}
      </Link>
    </Container>
  )
}

function ValidationResult(props: SplunkSampleLogProps): JSX.Element {
  const { validationResult, query, thirdPartyGUID } = props
  const { loading, error, chartOptions, sampleLogs, ttlLogMessages, timeRange } = validationResult
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
      <Container flex className={css.logsHeadingContainer}>
        {ttlLogMessages && (
          <Text className={css.ttlLogs}>Viewing {`${sampleLogs?.length || 0} / ${ttlLogMessages}`} logs</Text>
        )}
        <Text className={css.logsFromPast}>{`Logs from the past ${
          new Date().getDate() - new Date(new Date().getTime() - (timeRange || 0)).getDate()
        } days`}</Text>
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
    loading: Boolean(dsConfig.query?.length)
  })
  const [thirdPartyGUID, setThirdPartyGUID] = useState<string | undefined>()
  const [renderSplunkFields, setRenderSplunkFields] = useState<boolean>(Boolean(dsConfig.query))
  const { params } = routeParams()
  const areFirstThreeFilledOut = dsConfig.envIdentifier && dsConfig.serviceIdentifier && dsConfig.queryName

  useEffect(() => {
    if (dsConfig.query) {
      debouncedValidateConfig.cancel()
      const guid = `${Utils.randomId()}-${dataSourceId}-${new Date().getTime().toString()}`
      setThirdPartyGUID(guid)
      debouncedValidateConfig(
        params.accountId,
        dataSourceId,
        dsConfig.query,
        guid,
        params.orgId as string,
        params.projectIdentifier as string,
        setValidationResult
      )
    }
    return () => xhr.abort(XHR_VALIDATION_GROUP)
  }, [dsConfig.query, dataSourceId, params.accountId, params.orgId, params.projectId])

  useEffect(() => {
    if (!renderSplunkFields && dsConfig.envIdentifier && dsConfig.serviceIdentifier) {
      setRenderSplunkFields(true)
    }
  }, [renderSplunkFields, dsConfig.envIdentifier, dsConfig.serviceIdentifier])

  return (
    <Container className={css.onBoardingSection}>
      <Container className={css.leftSection}>
        <FormInput.Text name={`dsConfigs[${index}].queryName`} label={i18n.fieldLabels.queryName} />
        <FormInput.SelectWithSubview
          name={`dsConfigs[${index}].envIdentifier`}
          label={i18n.fieldLabels.environment}
          changeViewButtonLabel={i18n.subviewCreationText.environment}
          items={envOptions}
          subview={<CreateNewEntitySubform entityType="environment" />}
          onChange={item => {
            formikProps.setFieldValue(`dsConfigs[${index}].envIdentifier`, item.value)
            formikProps.setFieldTouched(`dsConfigs[${index}].envIdentifier`, true)
          }}
        />
        <FormInput.SelectWithSubview
          name={`dsConfigs[${index}].serviceIdentifier`}
          label={i18n.fieldLabels.service}
          changeViewButtonLabel={i18n.subviewCreationText.service}
          items={serviceOptions}
          subview={<CreateNewEntitySubform entityType="service" />}
          onChange={item => {
            formikProps.setFieldValue(`dsConfigs[${index}].serviceIdentifier`, item.value)
            formikProps.setFieldTouched(`dsConfigs[${index}].serviceIdentifier`, true)
          }}
        />
        <FormInput.TextArea
          key={dsConfig.id}
          disabled={!areFirstThreeFilledOut}
          name={`dsConfigs[${index}].query`}
          placeholder={i18n.placeholders.query}
          label={i18n.fieldLabels.query}
          onChange={() => {
            if (dsConfig.serviceInstanceIdentifier) {
              formikProps.setFieldValue(`dsConfigs[${index}].serviceInstanceIdentifier`, '')
            }
          }}
        />
        <FormInput.Select
          name={`dsConfigs[${index}].eventType`}
          label={i18n.fieldLabels.eventType}
          items={EventTypesOptions}
          disabled={!areFirstThreeFilledOut}
        />
        <JsonSelectorFormInput
          name={`dsConfigs[${index}].serviceInstanceIdentifier`}
          label={i18n.fieldLabels.serviceInstanceFieldName}
          disabled={!areFirstThreeFilledOut}
          placeholder={
            !dsConfig.query?.length
              ? i18n.placeholders.serviceInstanceFieldName.noData
              : i18n.placeholders.serviceInstanceFieldName.default
          }
          json={validationResult.serviceInstanceJSON}
          loading={validationResult.loading}
        />
      </Container>
      <Container className={css.rightSection}>
        <Text margin={{ bottom: 'small' }} style={{ lineHeight: '0 !important', fontSize: '13px' }} color={Color.BLACK}>
          {i18n.validationResultTitle}
        </Text>
        <ValidationResult validationResult={validationResult} query={dsConfig.query} thirdPartyGUID={thirdPartyGUID} />
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
  const { dsConfigs, serviceOptions, envOptions, splunkQueryOptions, pageData, orgId, dbInstance, projectId } = props
  const productName = pageData?.products?.[0]
  const {
    params: { accountId }
  } = routeParams()
  const dataSourceId = pageData.dataSourceId
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
                  <>
                    <SplunkPageHeading
                      onAddQuery={(queryName?: string, query?: string) =>
                        arrayHelpers.unshift(
                          createDefaultSplunkDSConfig(accountId, dataSourceId, productName, projectId, queryName, query)
                        )
                      }
                      splunkSavedSearches={splunkQueryOptions}
                    />
                    <SaveConfigToIndexedDB
                      pageData={pageData}
                      dbInstance={dbInstance}
                      configs={formikProps.values?.dsConfigs}
                    />
                    <CollapseList defaultOpenIndex={0}>
                      {formikProps.values?.dsConfigs?.map((dsConfig: SplunkDSConfig, index: number) => {
                        return (
                          <DataSourceConfigPanel
                            key={dsConfig?.id}
                            entityName={dsConfig?.queryName || ''}
                            index={index}
                            orgId={orgId}
                            validateConfig={validate}
                            transformToSavePayload={transformToSaveConfig}
                            onRemove={() => arrayHelpers.remove(index)}
                            touched={formikProps.touched}
                            values={formikProps.values}
                            setFieldError={formikProps.setFieldError}
                            setFieldTouched={formikProps.setFieldTouched}
                          >
                            <SplunkConfig
                              dsConfig={dsConfig || {}}
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
                  </>
                )
              }}
            />
            {/* <Container className={css.actionButtons}>
              <Button large intent="primary" text={i18n.nextButton} width={100} type="button" />
            </Container> */}
          </FormikForm>
        )
      }}
    </Formik>
  )
}

export default function SplunkOnboarding(props: SplunkOnBoardingProps): JSX.Element {
  const { configs, serviceOptions, locationContext, indexedDB, envOptions } = props
  const [splunkQueryOptions, setSplunkQueryOptions] = useState<SelectOption[]>([{ label: i18n.loadingText, value: '' }])
  const {
    params: { accountId, projectIdentifier: routeProjectId, orgId: routeOrgId }
  } = routeParams()
  const toaster = useToaster()
  const projectId = routeProjectId as string
  const orgId = routeOrgId as string

  useEffect(() => {
    loadSplunkSavedSearches(accountId, locationContext?.dataSourceId, orgId, projectId, indexedDB).then(result => {
      const { error, status, savedSearches } = result
      if (status === xhr.ABORTED) {
        return
      } else if (error) {
        toaster.showError(error)
      } else {
        setSplunkQueryOptions(savedSearches ?? [])
      }
    })
  }, [accountId, locationContext?.dataSourceId, indexedDB, projectId, orgId])

  return (
    <Container className={css.main}>
      <SplunkDataSourceForm
        serviceOptions={serviceOptions}
        envOptions={envOptions}
        dsConfigs={configs}
        pageData={locationContext}
        orgId={orgId}
        projectId={projectId}
        splunkQueryOptions={splunkQueryOptions}
        dbInstance={indexedDB}
      />
    </Container>
  )
}
