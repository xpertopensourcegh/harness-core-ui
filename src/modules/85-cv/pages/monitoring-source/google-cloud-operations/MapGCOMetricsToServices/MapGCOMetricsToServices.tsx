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
import { NoDataCard } from '@common/components/Page/NoDataCard'
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
  METRIC_NAME: 'metricName',
  QUERY: 'query',
  SERVICE: 'serviceIdentifier',
  ENVIRONMENT: 'environmentIdentifier',
  RISK_CATEGORY: 'riskCategory',
  HIGHER_BASELINE_DEVIATION: 'higherBaselineDeviation',
  LOWER_BASELINE_DEVIATION: 'lowerBaselineDeviation'
}

const OVERALL = 'overall'

const DrawerOptions = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true
}

function validate(
  values: any,
  selectedMetrics: Map<string, any>,
  validationString: string
): { [key: string]: string } | undefined {
  const errors = { [OVERALL]: '' }
  const totalFields = Object.keys(FieldNames).length - 1
  let metricWithValues = false
  for (const entry of selectedMetrics) {
    const [, metricInfo] = entry
    metricWithValues = Object.values(metricInfo).filter(val => val ?? false).length >= totalFields
    if (metricWithValues) {
      break
    }
  }

  if (metricWithValues || Object.values(values).filter(val => val ?? false).length >= totalFields) {
    return
  }

  errors[OVERALL] = validationString
  return errors
}

function buildMetricInfoObject({
  metricName,
  query,
  metricTag
}: {
  metricName: string
  query: string
  metricTag: string
}) {
  return {
    [FieldNames.METRIC_NAME]: metricName,
    [FieldNames.METRIC_TAGS]: { [metricTag]: '' },
    [FieldNames.QUERY]: query ? formatJSON(query) : undefined
  }
}

function formatJSON(val = '{}'): string {
  const res = JSON.parse(val)
  return JSON.stringify(res, null, 2)
}

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
            name={FieldNames.HIGHER_BASELINE_DEVIATION}
            value="higher"
            label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.higherCounts')}
          />
          <FormInput.CheckBox
            name={FieldNames.LOWER_BASELINE_DEVIATION}
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
        <Container flex>
          <Icon name="service-stackdriver" className={css.logo} />
          <Text className={css.typedMetricName} width={200} lineClamp={1}>
            {metricName}
          </Text>
        </Container>
        <Text color={Color.BLACK}>{`${getString('cv.admin.mapsTo')} ${getString('service').toLocaleLowerCase()}`}</Text>
        <FormInput.CustomRender
          name={FieldNames.SERVICE}
          render={formikProps => {
            return (
              <ServiceSelectOrCreate
                className={css.envService}
                options={serviceOptions}
                key={`${formikProps.values[FieldNames.SERVICE]}-${serviceOptions.length}`}
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
          name={FieldNames.ENVIRONMENT}
          render={formikProps => {
            return (
              <EnvironmentSelect
                className={css.envService}
                options={environmentOptions}
                key={`${formikProps.values[FieldNames.ENVIRONMENT]}-${environmentOptions.length}`}
                item={formikProps.values[FieldNames.ENVIRONMENT]}
                onSelect={selectedOption => formikProps.setFieldValue(FieldNames.ENVIRONMENT, selectedOption)}
                onNewCreated={newEnvironment => {
                  if (!newEnvironment || !newEnvironment.name || !newEnvironment.identifier) return
                  setEnvironmentOptions([
                    ...environmentOptions,
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
  const { loading, error, mutate, cancel } = useGetStackdriverSampleData({
    queryParams: { orgIdentifier, projectIdentifier, accountId, connectorIdentifier }
  })
  const [sampleData, setSampleData] = useState<Highcharts.Options | undefined>()
  const debouncedGetSampleData = useMemo(() => {
    cancel()
    return debounce(async () => {
      if (!queryValue) return noop
      try {
        const response = await mutate(JSON.parse(queryValue))
        setSampleData(transformSampleDataIntoHighchartOptions(response?.resource))
      } catch (e) {
        setSampleData({})
      }
    }, 1000)
  }, [queryValue])

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
      {!queryValue?.length && (
        <Container className={css.chartContainer}>
          <NoDataCard
            icon="main-notes"
            message={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.enterQueryForValidation')}
          />
        </Container>
      )}
      {!loading && !error?.message && sampleData && (
        <Container className={css.chartContainer}>
          <HighchartsReact highcharts={Highcharts} options={sampleData} />
        </Container>
      )}
      {isQueryExpanded && (
        <Drawer {...DrawerOptions} onClose={() => setIsQueryExpanded(false)}>
          <MonacoEditor
            language="javascript"
            value={formatJSON(queryValue)}
            onChange={debounce(onChange, 200)}
            options={
              {
                readOnly: false,
                wordBasedSuggestions: false,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 13,
                formatOnPaste: true,
                formatOnType: true
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
  const [updatedData, setUpdatedData] = useState<Map<string, any>>(data.selectedMetrics || new Map<string, any>())
  const [selectedMetric, setSelectedMetric] = useState<string>()
  return (
    <Container className={css.main}>
      <Formik
        enableReinitialize={true}
        initialValues={updatedData.get(selectedMetric || '') || {}}
        onSubmit={onNext}
        validateOnChange={false}
        validateOnBlur={false}
        validate={values =>
          validate(
            values,
            updatedData,
            getString('cv.monitoringSources.gco.mapMetricsToServicesPage.mainSetupValidation')
          )
        }
      >
        {formikProps => (
          <Container className={css.form}>
            <DashboardWidgetMetricNav
              className={css.leftNav}
              connectorIdentifier={data.connectorRef.value}
              gcoDashboards={data.selectedDashboards}
              showSpinnerOnLoad={!selectedMetric}
              onSelectMetric={(metricName, query, widget) => {
                let metricInfo = updatedData.get(metricName)
                if (!metricInfo) {
                  metricInfo = buildMetricInfoObject({ metricName, query, metricTag: widget })
                } else {
                  metricInfo[FieldNames.QUERY] = formatJSON(query)
                }
                updatedData.set(metricName, metricInfo)
                updatedData.set(selectedMetric as string, { ...formikProps.values })
                setUpdatedData(new Map(updatedData))
                setSelectedMetric(metricName)
              }}
            />
            <FormikForm className={css.setupContainer}>
              <Heading level={3} color={Color.BLACK} className={css.sectionHeading}>
                {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.querySpecifications')}
              </Heading>
              <Container className={css.nameAndMetricTagContainer}>
                <FormInput.KVTagInput
                  label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.metricTagsLabel')}
                  name={FieldNames.METRIC_TAGS}
                />
                <FormInput.Text
                  label={getString('cv.monitoringSources.gco.mapMetricsToServicesPage.metricNameLabel')}
                  name={FieldNames.METRIC_NAME}
                />
              </Container>
              <QueryValidation
                onChange={updatedQuery => formikProps.setFieldValue(FieldNames.QUERY, updatedQuery)}
                queryValue={formikProps.values[FieldNames.QUERY] as string}
                connectorIdentifier={data.connectorRef.value}
              />
              <MapMetricToServiceAndEnvironment metricName={formikProps.values[FieldNames.METRIC_NAME]} />
              <ConfigureRiskProfile />
              <FormInput.Text name={OVERALL} className={css.hiddenField} />
              <SubmitAndPreviousButtons onPreviousClick={onPrevious} />
            </FormikForm>
          </Container>
        )}
      </Formik>
    </Container>
  )
}
