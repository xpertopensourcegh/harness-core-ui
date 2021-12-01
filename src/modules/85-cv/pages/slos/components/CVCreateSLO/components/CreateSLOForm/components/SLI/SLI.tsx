import React, { useEffect, useMemo } from 'react'
import { Color, FormInput, Text, useToaster } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'

import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import { useGetAllMonitoredServicesWithTimeSeriesHealthSources } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import type { SLIProps } from './SLI.types'
import PickMetric from './views/PickMetric'
import { getHealthSourcesOptions, getMonitoredServicesOptions, getSliTypeOptions } from './SLI.utils'
import css from './SLI.module.scss'

export default function SLI(props: SLIProps): JSX.Element {
  const { formikProps, children } = props
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps & { identifier: string }>()
  const { values } = formikProps

  const {
    data: monitoredServicesData,
    loading: monitoredServicesLoading,
    error: monitoredServicesDataError
  } = useGetAllMonitoredServicesWithTimeSeriesHealthSources({
    queryParams: {
      orgIdentifier,
      projectIdentifier,
      accountId
    }
  })

  useEffect(() => {
    if (monitoredServicesDataError) {
      showError(getErrorMessage(monitoredServicesDataError))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoredServicesDataError])

  const monitoredServicesOptions = useMemo(
    () => getMonitoredServicesOptions(monitoredServicesData),
    [monitoredServicesData]
  )

  const healthSourcesOptions = useMemo(
    () => getHealthSourcesOptions(monitoredServicesData, values?.monitoredServiceRef),
    [values?.monitoredServiceRef, monitoredServicesData]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sliTypeOptions = useMemo(() => getSliTypeOptions(getString), [])

  return (
    <>
      <Text color={Color.BLACK} className={css.label}>
        {getString('connectors.cdng.monitoredService.label')}
      </Text>
      <CardWithOuterTitle className={css.sliElement}>
        <FormInput.Select
          name="monitoredServiceRef"
          label={<Text font={{ size: 'small' }}>{getString('cv.slos.selectMonitoredServiceForSlo')}</Text>}
          placeholder={monitoredServicesLoading ? getString('loading') : getString('cv.slos.selectMonitoredService')}
          items={monitoredServicesOptions}
          className={css.dropdown}
        />
      </CardWithOuterTitle>
      <Text color={Color.BLACK} className={css.label}>
        {getString('cv.slos.healthSourceForSLI')}
      </Text>
      <CardWithOuterTitle className={css.sliElement}>
        <FormInput.Select
          name="healthSourceRef"
          placeholder={monitoredServicesLoading ? getString('loading') : getString('cv.slos.selectHealthsource')}
          items={healthSourcesOptions}
          className={css.dropdown}
        />
      </CardWithOuterTitle>
      <Text color={Color.BLACK} className={css.label}>
        {getString('cv.slos.sliType')}
      </Text>
      <CardWithOuterTitle className={css.sliElement}>
        <FormInput.RadioGroup name="serviceLevelIndicators.type" radioGroup={{ inline: true }} items={sliTypeOptions} />
        <Text font={{ size: 'small' }}>{getString('cv.slos.latencySLI')}</Text>
      </CardWithOuterTitle>

      <PickMetric formikProps={formikProps} />

      {children}
    </>
  )
}
