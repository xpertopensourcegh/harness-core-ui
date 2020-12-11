import React, { useEffect, useMemo, useState } from 'react'
import {
  Color,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Heading,
  Link,
  SelectOption,
  Text,
  Icon
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { debounce, noop } from 'lodash-es'
import MonacoEditor from 'react-monaco-editor'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Drawer, IOptionProps } from '@blueprintjs/core'
import {
  ServiceSelectOrCreate,
  generateOptions as generateServiceOptions
} from '@cv/components/ServiceSelectOrCreate/ServiceSelectOrCreate'
import {
  EnvironmentSelect,
  generateOptions
} from '@cv/pages/monitoring-source/app-dynamics/SelectApplications/EnvironmentSelect'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetEnvironmentListForProject, useGetServiceListForProject } from 'services/cd-ng'
import { MetricPackDTO, TimeSeriesSampleDTO, useGetMetricPacks, useGetStackdriverSampleData } from 'services/cv'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useStrings } from 'framework/exports'
import { PageError } from '@common/components/Page/PageError'
import { useToaster } from '@common/exports'
import { DashboardWidgetMetricNav } from './DashboardWidgetMetricNav/DashboardWidgetMetricNav'
import { chartsConfig } from './GCOWidgetChartConfig'
import css from './MapGCOMetricsToServices.module.scss'

interface MapGCOMetricsToServicesProps {
  data: any
  onNext: (data: any) => void
  onPrevious: () => void
}

interface MapMetricToServiceAndEnvironmentProps {
  metricName: string
}

interface QueryValidationProps {
  queryValue?: string
  onChange: (updatedQuery?: string) => void
  connectorIdentifier: string
}

export const FieldNames = {
  METRIC_TAGS: 'metricTags',
  METRIC_NAMES: 'metricNames',
  QUERY: 'query',
  SERVICE: 'serviceIdentifier',
  ENVIRONMENT: 'environmentIdentifier',
  RISK_CATEGORY: 'riskCategory',
  BASELINE_DEVIATION: 'baselineDeviation'
}

const DrawerOptions = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true
}

// const MockData = {
//   metaData: {},
//   resource: [
//     {
//       txnName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricValue: 7.050477594430973,
//       timestamp: 1607599980000
//     },
//     {
//       txnName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricValue: 12.149014549984008,
//       timestamp: 1607599920000
//     },
//     {
//       txnName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricName: 'kubernetes.io/container/cpu/core_usage_time',
//       metricValue: 12.151677124512961,
//       timestamp: 1607599860000
//     }
//   ]
// }

function getRiskCategoryOptions(metricPacks?: MetricPackDTO[]): IOptionProps[] {
  if (!metricPacks?.length) {
    return []
  }

  const riskCategoryOptions: IOptionProps[] = []
  for (const metricPack of metricPacks) {
    if (metricPack && metricPack.identifier) {
      riskCategoryOptions.push({ label: metricPack.identifier, value: metricPack.identifier })
    }
  }

  return riskCategoryOptions
}

function transformSampleDataIntoHighchartOptions(sampleData?: TimeSeriesSampleDTO[]): Highcharts.Options {
  if (!sampleData?.length) {
    return {}
  }

  const seriesData: Highcharts.SeriesLineOptions[] = [{ name: 'sampleData', data: [], type: 'line' }]
  for (const data of sampleData) {
    if (!data || !data.timestamp || !data.metricValue) continue
    seriesData?.[0]?.data?.push([data.timestamp, data.metricValue])
  }

  return chartsConfig(seriesData)
}

function ConfigureRiskProfile(): JSX.Element {
  const { getString } = useStrings()
  const { projectIdentifier, accountId } = useParams<AccountPathProps & ProjectPathProps>()
  const { data } = useGetMetricPacks({
    queryParams: { projectIdentifier, accountId, dataSourceType: 'APP_DYNAMICS' }
  })
  const [riskCategoryOptions, setRiskCategoryOptions] = useState<IOptionProps[]>([])

  useEffect(() => {
    setRiskCategoryOptions(getRiskCategoryOptions(data?.resource))
  }, [data])

  return (
    <Container className={css.configureRiskProfileContainer}>
      <Heading level={3} color={Color.BLACK} className={css.sectionHeading}>
        {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.configureRiskProfile')}
      </Heading>
      <FormInput.RadioGroup
        name={FieldNames.RISK_CATEGORY}
        items={riskCategoryOptions}
        className={css.inlineRadio}
        label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.riskCategoryLabel')}
      />
      <Container className={css.deviation}>
        <Text color={Color.BLACK} className={css.checkboxLabel}>
          {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.baselineDeviation')}
        </Text>
        <Container className={css.checkbox}>
          <FormInput.CheckBox
            name={FieldNames.BASELINE_DEVIATION}
            value="higher"
            label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.higherCounts')}
          />
          <FormInput.CheckBox
            name={FieldNames.BASELINE_DEVIATION}
            value="lower"
            label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.lowerCounts')}
          />
        </Container>
      </Container>
    </Container>
  )
}

function MapMetricToServiceAndEnvironment(props: MapMetricToServiceAndEnvironmentProps): JSX.Element {
  const { metricName } = props
  const { getString } = useStrings()
  const queryParams = useParams<ProjectPathProps & AccountPathProps>()
  const { showError } = useToaster()
  const { data: environments, error: envError } = useGetEnvironmentListForProject({ queryParams })
  const { data: services, error: serviceError } = useGetServiceListForProject({ queryParams })
  const [environmentOptions, setEnvironmentOptions] = useState<SelectOption[]>([
    { value: '', label: getString('loading') }
  ])
  const [serviceOptions, setServiceOptions] = useState<SelectOption[]>([{ value: '', label: getString('loading') }])

  useEffect(() => {
    if (envError?.message) {
      showError(envError.message, 5000)
    } else {
      setEnvironmentOptions(generateOptions(environments?.data?.content))
    }
  }, [environments, envError])

  useEffect(() => {
    if (serviceError?.message) {
      showError(serviceError.message, 5000)
    } else {
      setServiceOptions(generateServiceOptions(services?.data?.content))
    }
  }, [services, serviceError])

  return (
    <Container>
      <Heading level={3} color={Color.BLACK} className={css.sectionHeading}>
        {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.mapMetricToServiceAndEnvironment')}
      </Heading>
      <Container className={css.metricServiceEnvContainer}>
        <Text icon="service-stackdriver">{metricName}</Text>
        <Text color={Color.BLACK}>{`${getString('cv.admin.mapsTo')} ${getString('service').toLocaleLowerCase()}`}</Text>
        <FormInput.CustomRender
          name={FieldNames.SERVICE}
          render={formikProps => {
            return (
              <ServiceSelectOrCreate
                className={css.envService}
                options={serviceOptions}
                item={formikProps.values[FieldNames.SERVICE]}
                onNewCreated={newService => {
                  if (!newService || !newService.name || !newService.identifier) return
                  setServiceOptions([...serviceOptions, { value: newService.identifier, label: newService.name }])
                  formikProps.setFieldValue(FieldNames.SERVICE, {
                    value: newService.identifier,
                    label: newService.name
                  })
                }}
                onSelect={selectedOption => formikProps.setFieldValue(FieldNames.SERVICE, selectedOption)}
              />
            )
          }}
        />
        <Text color={Color.BLACK}>{`${getString('and').toLocaleLowerCase()} ${getString(
          'environment'
        ).toLocaleLowerCase()}`}</Text>
        <FormInput.CustomRender
          name={FieldNames.SERVICE}
          render={formikProps => {
            return (
              <EnvironmentSelect
                className={css.envService}
                options={environmentOptions}
                item={formikProps.values[FieldNames.ENVIRONMENT]}
                onSelect={selectedOption => formikProps.setFieldValue(FieldNames.ENVIRONMENT, selectedOption)}
                onNewCreated={newEnvironment => {
                  if (!newEnvironment || !newEnvironment.name || !newEnvironment.identifier) return
                  setEnvironmentOptions([
                    ...serviceOptions,
                    { value: newEnvironment.identifier, label: newEnvironment.name }
                  ])
                  formikProps.setFieldValue(FieldNames.ENVIRONMENT, {
                    value: newEnvironment.identifier,
                    label: newEnvironment.name
                  })
                }}
              />
            )
          }}
        />
      </Container>
    </Container>
  )
}

function QueryValidation(props: QueryValidationProps): JSX.Element {
  const { onChange, queryValue, connectorIdentifier } = props
  const { projectIdentifier, orgIdentifier, accountId } = useParams<AccountPathProps & ProjectPathProps>()
  const [isQueryExpanded, setIsQueryExpanded] = useState(false)
  const { getString } = useStrings()
  const { loading, error, mutate } = useGetStackdriverSampleData({
    queryParams: { orgIdentifier, projectIdentifier, accountId, connectorIdentifier }
  })
  const [sampleData, setSampleData] = useState<Highcharts.Options | undefined>()
  const debouncedGetSampleData = useMemo(
    () =>
      debounce(async () => {
        if (!queryValue) return noop
        const response = await mutate(JSON.parse(queryValue))
        setSampleData(transformSampleDataIntoHighchartOptions(response?.resource))
        // setSampleData(transformSampleDataIntoHighchartOptions(MockData?.resource))
      }, 1000),
    [queryValue]
  )
  useEffect(() => {
    debouncedGetSampleData()
  }, [debouncedGetSampleData])
  return (
    <Container className={css.validationContainer}>
      <FormInput.TextArea
        name={FieldNames.QUERY}
        className={css.query}
        label={
          <Container flex>
            <Text>{getString('cv.monitoringSources.gco.mapMetricsToServicesPage.operationsQueryLabel')}</Text>
            <Link withoutHref onClick={() => setIsQueryExpanded(true)}>
              {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.viewQuery')}
            </Link>
          </Container>
        }
      />
      {loading && <Icon name="steps-spinner" size={32} color={Color.GREY_600} className={css.sampleDataSpinner} />}
      {error?.message && (
        <Container className={css.chartContainer}>
          <PageError
            message={error.message}
            onClick={async () => {
              if (!queryValue?.length) return
              const response = await mutate(JSON.parse(queryValue))
              setSampleData(transformSampleDataIntoHighchartOptions(response?.resource))
            }}
          />
        </Container>
      )}
      {sampleData && (
        <Container className={css.chartContainer}>
          <HighchartsReact highcharts={Highcharts} options={sampleData} />
        </Container>
      )}
      {isQueryExpanded && (
        <Drawer {...DrawerOptions} onClose={() => setIsQueryExpanded(false)}>
          <MonacoEditor
            language="json"
            value={queryValue}
            onChange={debounce(onChange, 200)}
            options={
              {
                readOnly: false,
                wordBasedSuggestions: false,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 13
              } as any
            }
          />
        </Drawer>
      )}
    </Container>
  )
}

export function MapGCOMetricsToServices(props: MapGCOMetricsToServicesProps): JSX.Element {
  const { data, onPrevious, onNext } = props
  const { getString } = useStrings()
  return (
    <Container className={css.main}>
      <DashboardWidgetMetricNav className={css.leftNav} />
      <Container className={css.setupContainer}>
        <Heading level={3} color={Color.BLACK} className={css.sectionHeading}>
          {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.querySpecifications')}
        </Heading>
        <Formik enableReinitialize={true} initialValues={{ [FieldNames.QUERY]: '' }} onSubmit={onNext}>
          {formikProps => (
            <FormikForm>
              <Container className={css.nameAndMetricTagContainer}>
                <FormInput.KVTagInput
                  label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.metricTagsLabel')}
                  name={FieldNames.METRIC_TAGS}
                />
                <FormInput.Text
                  label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.metricNameLabel')}
                  name={FieldNames.METRIC_NAMES}
                />
              </Container>
              <QueryValidation
                onChange={updatedQuery => formikProps.setFieldValue(FieldNames.QUERY, updatedQuery)}
                queryValue={formikProps.values[FieldNames.QUERY] as string}
                connectorIdentifier={data.connectorRef.value}
              />
              <MapMetricToServiceAndEnvironment metricName={''} />
              <ConfigureRiskProfile />
              <SubmitAndPreviousButtons onPreviousClick={onPrevious} />
            </FormikForm>
          )}
        </Formik>
      </Container>
    </Container>
  )
}
