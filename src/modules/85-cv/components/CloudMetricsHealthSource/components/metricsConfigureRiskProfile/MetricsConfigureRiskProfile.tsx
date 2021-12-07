import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import type { IOptionProps } from '@blueprintjs/core'
import { Color, Container, FormInput, Heading, Text } from '@wings-software/uicore'
import type { DatasourceTypeEnum } from '@cv/pages/monitored-service/components/ServiceHealth/components/MetricsAndLogs/MetricsAndLogs.types'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetMetricPacks } from 'services/cv'
import { getRiskCategoryOptions } from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.utils'
import { FieldNames } from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.constants'
import css from '@cv/components/CloudMetricsHealthSource/components/metricsConfigureRiskProfile/MetricsConfigureRiskProfile.module.scss'

export interface MetricsConfigureRiskProfileProps {
  dataSourceType: DatasourceTypeEnum
}

export default function MetricsConfigureRiskProfile(props: MetricsConfigureRiskProfileProps): JSX.Element {
  const { dataSourceType } = props
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { data } = useGetMetricPacks({
    queryParams: { projectIdentifier, orgIdentifier, accountId, dataSourceType: dataSourceType }
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
        label={getString('cv.monitoringSources.riskCategoryLabel')}
      />
      <Container className={css.deviation}>
        <Text color={Color.BLACK} className={css.checkboxLabel}>
          {getString('cv.monitoringSources.baselineDeviation')}
        </Text>
        <Container className={css.checkbox}>
          <FormInput.CheckBox
            name={FieldNames.HIGHER_BASELINE_DEVIATION}
            value="higher"
            label={getString('cv.monitoringSources.higherCounts')}
          />
          <FormInput.CheckBox
            name={FieldNames.LOWER_BASELINE_DEVIATION}
            value="lower"
            label={getString('cv.monitoringSources.lowerCounts')}
          />
        </Container>
      </Container>
    </Container>
  )
}
