import React from 'react'
import { Card, Container, FontVariation, Heading, FormInput, Layout, Text, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import SLOTargetChart from '@cv/pages/slos/components/SLOTargetChart/SLOTargetChart'
import { SLIMetricEnum, comparatorOptions } from '../SLI.constants'
import type { PickMetricProps } from '../SLI.types'
import {
  getEventTypeOptions,
  getSliMetricOptions,
  getGoodRequestMetricOptions,
  getValidRequestMetricOptions,
  getComparatorSuffixLabelId
} from '../SLI.utils'
import css from '../SLI.module.scss'

const PickMetric: React.FC<PickMetricProps> = ({ formikProps }) => {
  const { getString } = useStrings()
  const isRatioBasedMetric = formikProps.values.serviceLevelIndicators.spec.type === SLIMetricEnum.RATIO
  const comparator = formikProps.values.serviceLevelIndicators.spec.comparator

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
                  items={getGoodRequestMetricOptions()}
                  className={css.metricSelect}
                />
              </Layout.Horizontal>
            )}
            <FormInput.Select
              name="serviceLevelIndicators.spec.spec.metric2"
              label={getString('cv.slos.slis.ratioMetricType.validRequestsMetrics')}
              items={getValidRequestMetricOptions()}
              className={css.metricSelect}
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
            <Layout.Horizontal flex={{ justifyContent: 'flex-start' }} spacing="small" width={320}>
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
