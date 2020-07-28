import React, { FunctionComponent, useState, useEffect, useCallback } from 'react'
import css from './SplunkOnboarding.module.scss'
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
  ListPanelInterface,
  Text,
  Color,
  Select,
  useModalHook,
  IconName
} from '@wings-software/uikit'
import { debounce } from 'lodash-es'
import Highcharts, { XrangePointOptionsObject } from 'highcharts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import xhr from '@wings-software/xhr-async'
import { ThirdPartyCallLogModal } from 'modules/cv/components/ThirdPartyCallLogs/ThirdPartyCallLogs'
import JsonSelectorFormInput from 'modules/cv/components/JsonSelector/JsonSelectorFormInput'
import cloneDeep from 'lodash/cloneDeep'
import DataSourceConfigPanel from 'modules/cv/components/DataSourceConfigPanel/DataSourceConfigPanel'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import type { SplunkDSConfig } from './SplunkOnboardingUtils'
import { splunkInitialQuery, transformQueriesFromSplunk, SplunkColumnChartOptions } from './SplunkOnboardingUtils'
import { routeParams } from 'framework/exports'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import { Classes } from '@blueprintjs/core'
import cx from 'classnames'
import i18n from './SplunkOnboarding.i18n'

const initialValues = cloneDeep(splunkInitialQuery)
const XHR_GRAPH_DETAILS_GROUP = 'XHR_GRAPH_DETAILS_GROUP'
const XHR_STACK_TRACE_GROUP = 'XHR_STACK_TRACE_GROUP'
const XHR_SAVED_SEARCH_GROUP = 'XHR_SAVED_SEARCH_GROUP'

const eventTypesOptions = [
  { label: 'Quality', value: 'Quality' },
  { label: 'Error', value: 'Error' },
  { label: 'Performance', value: 'Performance' }
]

interface SplunkConfigProps {
  index: number
  serviceOptions: SelectOption[]
  dsConfig: SplunkDSConfig
  dataSourceId: string
  formikProps: FormikProps<{ dsConfigs: SplunkDSConfig[] }>
}

interface SplunkDataSourceFormProps {
  serviceOptions: SelectOption[]
  splunkQueryOptions: SelectOption[]
  dsConfigs: SplunkDSConfig[]
  dataSourceId: string
}

interface SplunkQueryNameDropDownProps {
  selectedQueryName?: string
  onChange: (updatedQuery: SelectOption) => void
  splunkQueryOptions: SelectOption[]
}

interface SplunkSampleLogProps {
  loading: boolean
  sampleLogs?: string[]
  error?: string
  query?: string
  graphDetails?: GraphDetails
}

interface ValidationErrorOrNoDataProps {
  error?: string
  noData?: {
    icon: IconName
    message: string
  }
  query?: string
}

type GraphDetails = { error?: string; chartOptions?: Highcharts.Options; loading: boolean }
type StackTraceDetials = { sampleLogs?: string[]; serviceInstanceJSON?: object; loading: boolean; error?: string }
interface SplunkColumnChartProps {
  error?: string
  chartOptions?: Highcharts.Options
  loading: boolean
  query?: string
}

async function fetchGraphDetails(
  accountId: string,
  dataSourceId: string,
  query: string,
  updateState: (g: GraphDetails) => void
): Promise<void> {
  xhr.abort(XHR_GRAPH_DETAILS_GROUP)
  updateState({ loading: true, chartOptions: undefined })

  const { response, status, error } = await CVNextGenCVConfigService.fetchSplunkSampleGraph({
    accountId,
    dataSourceId,
    query,
    xhrGroup: XHR_GRAPH_DETAILS_GROUP
  })
  if (status === xhr.ABORTED) {
    return
  } else if (response?.resource) {
    SplunkColumnChartOptions.series = [
      {
        type: 'column',
        data: (response.resource.bars?.map(bar => [bar.timestamp, bar.count]) || []) as XrangePointOptionsObject[]
      }
    ]
    updateState({
      loading: false,
      chartOptions: SplunkColumnChartOptions
    })
  } else if (error) {
    SplunkColumnChartOptions.series = []
    updateState({ loading: false, chartOptions: SplunkColumnChartOptions, error: error.message })
  }
}

async function fetchStackTrace(
  accountId: string,
  dataSourceId: string,
  query: string,
  updateState: (st: StackTraceDetials) => void
): Promise<void> {
  xhr.abort(XHR_STACK_TRACE_GROUP)
  updateState({ loading: true })

  const { response, status, error } = await CVNextGenCVConfigService.fetchSplunkSampleLogs({
    accountId,
    dataSourceId,
    query,
    xhrGroup: XHR_STACK_TRACE_GROUP
  })
  if (status === xhr.ABORTED) {
    return
  } else if (response?.resource) {
    updateState({
      loading: false,
      sampleLogs: response.resource.rawSampleLogs || [],
      serviceInstanceJSON: response.resource.sample || {}
    })
  } else if (error) {
    updateState({ loading: false, error: error.message })
  }
}

const debouncedGraphDetails = debounce(fetchGraphDetails, 1000)
const debouncedStackTraceDetails = debounce(fetchStackTrace, 1000)

function addQuery(formik: FormikProps<{ dsConfigs: SplunkDSConfig[] }>): void {
  formik.setFieldValue('dsConfigs', [{ ...cloneDeep(initialValues) }, ...formik.values.dsConfigs])
}

function validate(values: SplunkDSConfig): { [fieldName: string]: string } | {} {
  const errors: {
    envIdentifier?: string
    eventType?: string
    query?: string
    queryString?: string
    serviceIdentifier?: string
    serviceInstanceIdentifier?: string
  } = {}
  if (!values.envIdentifier) {
    errors.envIdentifier = i18n.fieldValidations.envIdentifier
  }
  if (!values.eventType) {
    errors.eventType = i18n.fieldValidations.eventType
  }
  if (!values.query) {
    errors.query = i18n.fieldValidations.query
  }

  if (!values.serviceIdentifier) {
    errors.serviceIdentifier = i18n.fieldValidations.serviceIdentifier
  }

  if (!values.serviceInstanceIdentifier) {
    errors.serviceInstanceIdentifier = i18n.fieldValidations.serviceInstanceFieldName
  }

  return errors
}

function validateSplunkConfigs(splunkConfigs: {
  dsConfigs: SplunkDSConfig[]
}): { dsConfigs: [{ [fieldName: string]: string }] | {} } {
  return { dsConfigs: splunkConfigs.dsConfigs?.map(config => validate(config)) || [] }
}

function SplunkQueryNameDropDown(props: SplunkQueryNameDropDownProps): JSX.Element {
  const { splunkQueryOptions, onChange, selectedQueryName } = props
  const [isEditMode, setEditMode] = useState(false)
  const [selectedSplunkQueryName, setSplunkQueryName] = useState(selectedQueryName)
  const debouncedFunction = debounce(() => setEditMode(false), 1500)
  const onQuerySelectCallback = useCallback(
    (selectedQuery: SelectOption) => {
      debouncedFunction.cancel()
      debouncedFunction()
      onChange(selectedQuery)
      setSplunkQueryName(selectedQuery?.label)
    },
    [onChange, debouncedFunction]
  )

  if (!isEditMode) {
    return (
      <Container className={css.selectQueryNameContainer} onClick={e => e.stopPropagation()}>
        <Text lineClamp={1} color={Color.BLUE_800} margin={{ right: 'small' }}>
          {selectedSplunkQueryName}
        </Text>
        <Icon name="main-edit" size={12} onClick={() => setEditMode(true)} className={css.editIcon} />
      </Container>
    )
  }
  return (
    <Container onClick={e => e.stopPropagation()}>
      <Select items={splunkQueryOptions} className={css.queryDropDown} onChange={onQuerySelectCallback} />
    </Container>
  )
}

function ValidationErrorOrNoData(props: ValidationErrorOrNoDataProps): JSX.Element {
  const { error, noData, query } = props
  const [openModal, hideModal] = useModalHook(() => <ThirdPartyCallLogModal guid={'1'} onHide={hideModal} />)
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

function SplunkColumnChart(props: SplunkColumnChartProps): JSX.Element {
  const { loading, error, chartOptions, query } = props
  const chartSeries: Highcharts.SeriesColumnOptions[] = (chartOptions?.series as Highcharts.SeriesColumnOptions[]) || []
  if (loading) {
    return (
      <Container className={css.graphContainer}>
        <Icon name="steps-spinner" size={25} color={Color.GREY_600} className={css.loadingGraph} />
      </Container>
    )
  } else if (error?.length) {
    return <ValidationErrorOrNoData error={error} query={query} />
  } else if (!chartSeries[0]?.data?.length) {
    return (
      <ValidationErrorOrNoData
        noData={{ icon: 'vertical-bar-chart-desc', message: i18n.errorMessages.noQueryData }}
        query={query}
      />
    )
  }
  return (
    <Container className={css.graphContainer}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Container>
  )
}

function SplunkSampleLogs(props: SplunkSampleLogProps): JSX.Element {
  const { loading, sampleLogs, error, graphDetails, query } = props
  const chartSeries: Highcharts.SeriesColumnOptions[] =
    (graphDetails?.chartOptions?.series as Highcharts.SeriesColumnOptions[]) || []
  const noChartData = !graphDetails?.error && !graphDetails?.loading && !chartSeries[0]?.data?.length

  if (loading) {
    return (
      <Container height={355}>
        {[1, 2, 3].map(val => (
          <Container key={val} height={105} className={Classes.SKELETON} margin={{ bottom: 'small' }} />
        ))}
      </Container>
    )
  } else if (error) {
    return <ValidationErrorOrNoData error={error} query={query} />
  } else if (!sampleLogs?.length) {
    return <ValidationErrorOrNoData noData={{ icon: 'list', message: i18n.errorMessages.noSampleLogs }} query={query} />
  }

  return (
    <StackTraceList
      stackTraceList={sampleLogs}
      className={cx(css.sampleLogs, noChartData ? css.smallerHeight : undefined)}
      stackTracePanelClassName={css.sampleLog}
    />
  )
}

function SplunkConfig(props: SplunkConfigProps): JSX.Element {
  const { index, serviceOptions, dsConfig, dataSourceId, formikProps } = props
  const [stackTraceContent, setStackTraceContent] = useState<StackTraceDetials>({ loading: false })
  const [graphDetails, setGraphDetails] = useState<GraphDetails>({ loading: false })
  const { params } = routeParams()

  useEffect(() => {
    if (dsConfig?.query) {
      debouncedGraphDetails.cancel()
      debouncedStackTraceDetails.cancel()
      debouncedGraphDetails(params.accountId, dataSourceId, dsConfig.query, setGraphDetails)
      debouncedStackTraceDetails(params.accountId, dataSourceId, dsConfig.query, setStackTraceContent)
    }
  }, [dsConfig?.query, dataSourceId, params.accountId])

  return (
    <Container className={css.onBoardingSection}>
      <Container className={css.leftSection}>
        <FormInput.Text
          name={`dsConfigs[${index}].identifier`}
          label={i18n.fieldLabels.queryName}
          placeholder={i18n.placeholders.queryName}
        />
        <FormInput.TextArea
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
          json={stackTraceContent.serviceInstanceJSON}
          loading={stackTraceContent.loading}
        />
        <FormInput.Select
          name={`dsConfigs[${index}].serviceIdentifier`}
          key={serviceOptions[0]?.value as string}
          label={i18n.fieldLabels.service}
          items={serviceOptions}
          placeholder={i18n.placeholders.serviceIdentifier}
        />
        <FormInput.Select
          name={`dsConfigs[${index}].envIdentifier`}
          placeholder={i18n.placeholders.environment}
          label={i18n.fieldLabels.environment}
          items={[
            { label: 'Production', value: 'production' },
            { label: 'Non-Production', value: 'nonProduction' }
          ]}
        />
      </Container>
      <Container className={css.rightSection}>
        <Text margin={{ bottom: 'small' }} color={Color.BLACK}>
          {i18n.validationResultTitle}
        </Text>
        <SplunkColumnChart {...graphDetails} query={dsConfig?.query} />
        <SplunkSampleLogs
          error={stackTraceContent?.error}
          loading={stackTraceContent?.loading}
          sampleLogs={stackTraceContent?.sampleLogs}
          graphDetails={graphDetails}
          query={dsConfig?.query}
        />
      </Container>
    </Container>
  )
}

function SplunkDataSourceForm(props: SplunkDataSourceFormProps): JSX.Element {
  const { dsConfigs, serviceOptions, splunkQueryOptions, dataSourceId } = props
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
                    <Container flex margin={{ bottom: 'medium' }}>
                      <OnBoardingConfigSetupHeader
                        iconProps={{
                          name: 'service-splunk-with-name'
                        }}
                        iconClassName={css.splunkIcon}
                        pageHeading={i18n.pageHeading}
                      />
                      <Button
                        className={css.queryBtn}
                        intent="primary"
                        minimal
                        icon="plus"
                        iconProps={{
                          size: 12
                        }}
                        text={i18n.addQueryButtonLabels.splunkQuery}
                        onClick={() => addQuery(formikProps)}
                        disabled={!formikProps.isValid}
                      />
                    </Container>
                    <CollapseList defaultOpenIndex={0}>
                      {
                        formikProps.values?.dsConfigs?.map((dsConfig: SplunkDSConfig, index: number) => {
                          return (
                            <DataSourceConfigPanel
                              key={index}
                              entityName={
                                <SplunkQueryNameDropDown
                                  splunkQueryOptions={splunkQueryOptions}
                                  onChange={updatedQueryName => {
                                    formikProps.setFieldValue(`dsConfigs[${index}].identifier`, updatedQueryName?.label)
                                    formikProps.setFieldValue(`dsConfigs[${index}].query`, updatedQueryName?.value)
                                    formikProps.setFieldValue(`dsConfigs[${index}].serviceInstanceIdentifier`, '')
                                  }}
                                  selectedQueryName={dsConfig?.identifier}
                                />
                              }
                              index={index}
                              validateConfig={validate}
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
                              />
                            </DataSourceConfigPanel>
                          )
                        }) as ListPanelInterface[]
                      }
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
  const { configs, serviceOptions, locationContext } = props
  const [splunkQueryOptions, setSplunkQueryOptions] = useState<SelectOption[]>([{ label: 'Loading...', value: '' }])
  const {
    params: { accountId }
  } = routeParams()

  useEffect(() => {
    CVNextGenCVConfigService.fetchQueriesFromSplunk({
      accountId,
      xhrGroup: XHR_SAVED_SEARCH_GROUP,
      dataSourceId: locationContext?.dataSourceId,
      requestGUID: new Date().getTime().toString()
    }).then(({ response, status }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (response?.resource?.length) {
        setSplunkQueryOptions(transformQueriesFromSplunk(response.resource))
      } else {
        setSplunkQueryOptions([])
      }
    })
  }, [accountId, locationContext?.dataSourceId])

  return (
    <Container className={css.main}>
      <SplunkDataSourceForm
        serviceOptions={serviceOptions}
        dsConfigs={configs}
        dataSourceId={locationContext?.dataSourceId}
        splunkQueryOptions={splunkQueryOptions}
      />
    </Container>
  )
}

export default SplunkOnboarding
