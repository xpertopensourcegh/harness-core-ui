import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Container,
  FontVariation,
  Heading,
  FormInput,
  Layout,
  Text,
  Color,
  useToaster,
  SelectOption
} from '@wings-software/uicore'
import { useGetSloMetrics } from 'services/cv'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import SLOTargetChart from '@cv/pages/slos/components/SLOTargetChart/SLOTargetChart'
import { SLIMetricEnum, comparatorOptions, defaultOption } from '../SLI.constants'
import type { PickMetricProps } from '../SLI.types'
import { getEventTypeOptions, getSliMetricOptions, getSLOMetricOptions, getComparatorSuffixLabelId } from '../SLI.utils'
import css from '../SLI.module.scss'

const PickMetric: React.FC<PickMetricProps> = ({ formikProps }) => {
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { monitoredServiceRef, healthSourceRef, serviceLevelIndicators } = formikProps.values
  const { metric1, metric2 } = serviceLevelIndicators.spec.spec as any // Forced type should be removed after BE changes
  const isRatioBasedMetric = serviceLevelIndicators.spec.type === SLIMetricEnum.RATIO
  const comparator = serviceLevelIndicators.spec.comparator

  const {
    data: SLOMetricsData,
    loading: SLOMetricsLoading,
    error: SLOMetricsError,
    refetch: refetchSLOMetrics
  } = useGetSloMetrics({
    monitoredServiceIdentifier: monitoredServiceRef,
    healthSourceIdentifier: healthSourceRef,
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    },
    lazy: true
  })

  useEffect(() => {
    if (monitoredServiceRef && healthSourceRef) {
      refetchSLOMetrics()
    }
  }, [monitoredServiceRef, healthSourceRef, refetchSLOMetrics])

  useEffect(() => {
    if (SLOMetricsError) {
      showError(getErrorMessage(SLOMetricsError))
    }
  }, [SLOMetricsError, showError])

  const SLOMetricOptions = getSLOMetricOptions(SLOMetricsData?.resource)

  const activeGoodMetric: SelectOption = useMemo(
    () => SLOMetricOptions.find(metric => metric.value === metric1) ?? defaultOption,
    [SLOMetricOptions, metric1]
  )

  const activeValidMetric: SelectOption = useMemo(
    () => SLOMetricOptions.find(metric => metric.value === metric2) ?? defaultOption,
    [SLOMetricOptions, metric2]
  )

  return (
    <Container margin="xxlarge" width="80%">
      <Heading level={2} font={{ variation: FontVariation.FORM_TITLE }} margin={{ bottom: 'xsmall' }}>
        {getString('cv.slos.pickMetricsSLI')}
      </Heading>
      <Card className={css.card}>
        <FormInput.RadioGroup
          name="serviceLevelIndicators.spec.type"
          radioGroup={{ inline: true }}
          items={getSliMetricOptions(getString)}
        />
        <Layout.Horizontal spacing="xxlarge">
          <Container padding={{ right: 'xxlarge' }} border={{ right: true }}>
            {isRatioBasedMetric && (
              <Layout.Horizontal spacing="xlarge">
                <FormInput.Select
                  name="serviceLevelIndicators.spec.spec.eventType"
                  label={getString('cv.slos.slis.ratioMetricType.eventType')}
                  items={getEventTypeOptions()}
                  className={css.eventType}
                />
                <FormInput.Select
                  name="serviceLevelIndicators.spec.spec.metric1"
                  label={getString('cv.slos.slis.ratioMetricType.goodRequestsMetrics')}
                  placeholder={SLOMetricsLoading ? getString('loading') : undefined}
                  disabled={!healthSourceRef}
                  items={SLOMetricOptions}
                  className={css.metricSelect}
                  value={activeGoodMetric}
                  onChange={metric =>
                    formikProps.setFieldValue('serviceLevelIndicators.spec.spec.metric1', metric.value)
                  }
                />
              </Layout.Horizontal>
            )}
            <FormInput.Select
              name="serviceLevelIndicators.spec.spec.metric2"
              label={getString('cv.slos.slis.ratioMetricType.validRequestsMetrics')}
              placeholder={SLOMetricsLoading ? getString('loading') : undefined}
              disabled={!healthSourceRef}
              items={SLOMetricOptions}
              className={css.metricSelect}
              value={activeValidMetric}
              onChange={metric => formikProps.setFieldValue('serviceLevelIndicators.spec.spec.metric2', metric.value)}
            />
            <FormInput.Text
              name="serviceLevelIndicators.spec.objectiveValue"
              label={getString('cv.objectiveValue')}
              inputGroup={{
                type: 'number',
                min: 0,
                max: 100
              }}
              className={css.objectiveValue}
            />
            <Layout.Horizontal
              flex={{ justifyContent: 'flex-start', alignItems: 'baseline' }}
              spacing="small"
              width={320}
            >
              <Text font={{ variation: FontVariation.BODY }} color={Color.GREY_600}>
                {getString('cv.SLIValueIsGoodIf')}
              </Text>
              <FormInput.Select
                name="serviceLevelIndicators.spec.comparator"
                items={comparatorOptions}
                onChange={option => {
                  formikProps.setFieldValue('serviceLevelIndicators.spec.comparator', option.value)
                }}
                className={css.comparatorOptions}
              />
              <Text font={{ variation: FontVariation.BODY }} color={Color.GREY_600}>
                {getString(getComparatorSuffixLabelId(comparator))}
              </Text>
            </Layout.Horizontal>
          </Container>

          <Container
            height="inherit"
            width={isRatioBasedMetric ? 360 : 310}
            flex={{ justifyContent: 'center', alignItems: 'center' }}
            margin={{ left: 'xxlarge' }}
          >
            <SLOTargetChart
              topLabel={
                <Text font={{ variation: FontVariation.TINY_SEMI }} color={Color.GREY_500}>
                  {getString('cv.SLIRequestRatio')}
                </Text>
              }
              customChartOptions={{
                chart: {
                  width: isRatioBasedMetric ? 350 : 300,
                  height: isRatioBasedMetric ? 200 : 150
                }
              }}
            />
          </Container>
        </Layout.Horizontal>
      </Card>
    </Container>
  )
}

export default PickMetric
