import { Container, FormInput } from '@wings-software/uicore'
import React, { useMemo } from 'react'
import { useStrings } from 'framework/strings'
import { getEventTypeOptions, getMetricOneOptions, getMetricTwoOptions } from './RatioMetricType.utils'
import css from './RatioMetricType.module.scss'

export default function RatioMetricType(): JSX.Element {
  const { getString } = useStrings()
  const metricOneOptions = useMemo(() => getMetricOneOptions(), [])
  const metricTwoOptions = useMemo(() => getMetricTwoOptions(), [])
  const eventTypeOptions = useMemo(() => getEventTypeOptions(), [])

  return (
    <Container>
      <Container className={css.row}>
        <FormInput.Select
          name="serviceLevelIndicators.spec.spec.eventType"
          label={getString('cv.slos.slis.ratioMetricType.eventType')}
          placeholder={getString('cv.slos.slis.ratioMetricType.selectEventType')}
          items={eventTypeOptions}
          className={css.eventDropdown}
        />

        <FormInput.Select
          name="serviceLevelIndicators.spec.spec.metric1"
          label={getString('cv.slos.slis.ratioMetricType.goodRequestsMetrics')}
          placeholder={getString('cv.slos.slis.ratioMetricType.selectMetric1')}
          items={metricOneOptions}
          className={css.dropdown}
        />
      </Container>

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
