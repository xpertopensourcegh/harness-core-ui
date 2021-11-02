import { Container, FormInput } from '@wings-software/uicore'
import React, { useMemo } from 'react'
import { useStrings } from 'framework/strings'
import { getMetricTwoOptions } from '../RatioMetricType/RatioMetricType.utils'
import css from './ThresholdMetricType.module.scss'

export default function ThresholdMetricType(): JSX.Element {
  const { getString } = useStrings()
  const metricTwoOptions = useMemo(() => getMetricTwoOptions(), [])

  return (
    <Container>
      <FormInput.Select
        name="serviceLevelIndicators.spec.spec.metric2"
        label={getString('cv.slos.slis.ratioMetricType.validRequestsMetrics')}
        placeholder={getString('cv.slos.slis.ratioMetricType.selectMetric2')}
        items={metricTwoOptions}
        className={css.dropdown}
      />
    </Container>
  )
}
