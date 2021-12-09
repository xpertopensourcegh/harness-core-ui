import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Heading, FontVariation, Card, Color, FormInput, Text, useToaster, SelectOption } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { useGetAllMonitoredServicesWithTimeSeriesHealthSources } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { defaultOption, getSLITypeOptions } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.constants'
import { SLOPanelProps, SLOFormFields } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.types'
import {
  getMonitoredServiceOptions,
  getHealthSourceOptions
} from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.utils'
import PickMetric from './views/PickMetric'
import css from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.module.scss'

const SLI: React.FC<SLOPanelProps> = ({ formikProps, children }) => {
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { values } = formikProps

  const {
    data: monitoredServicesData,
    loading: monitoredServicesLoading,
    error: monitoredServicesDataError
  } = useGetAllMonitoredServicesWithTimeSeriesHealthSources({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  useEffect(() => {
    if (monitoredServicesDataError) {
      showError(getErrorMessage(monitoredServicesDataError))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoredServicesDataError])

  const monitoredServicesOptions = useMemo(
    () => getMonitoredServiceOptions(monitoredServicesData?.data),
    [monitoredServicesData]
  )

  const healthSourcesOptions = useMemo(
    () => getHealthSourceOptions(monitoredServicesData?.data, values?.monitoredServiceRef),
    [values?.monitoredServiceRef, monitoredServicesData]
  )

  const activeHealthSource: SelectOption = useMemo(
    () => healthSourcesOptions.find(healthSource => healthSource.value === values.healthSourceRef) ?? defaultOption,
    [healthSourcesOptions, values.healthSourceRef]
  )

  return (
    <>
      <Heading level={2} font={{ variation: FontVariation.FORM_TITLE }} margin={{ bottom: 'xsmall' }}>
        {getString('connectors.cdng.monitoredService.label')}
      </Heading>
      <Card className={css.cardSli}>
        <FormInput.Select
          name={SLOFormFields.MONITORED_SERVICE_REF}
          label={getString('cv.slos.selectMonitoredServiceForSlo')}
          placeholder={monitoredServicesLoading ? getString('loading') : getString('cv.slos.selectMonitoredService')}
          items={monitoredServicesOptions}
          className={css.selectPrimary}
          onChange={() => {
            formikProps.setFieldValue(SLOFormFields.HEALTH_SOURCE_REF, undefined)
            formikProps.setFieldValue(SLOFormFields.VALID_REQUEST_METRIC, undefined)
            formikProps.setFieldValue(SLOFormFields.GOOD_REQUEST_METRIC, undefined)
          }}
        />
      </Card>

      <Heading level={2} font={{ variation: FontVariation.FORM_TITLE }} margin={{ top: 'xxlarge', bottom: 'xsmall' }}>
        {getString('cv.slos.healthSourceForSLI')}
      </Heading>
      <Card className={css.cardSli}>
        <FormInput.Select
          name={SLOFormFields.HEALTH_SOURCE_REF}
          placeholder={monitoredServicesLoading ? getString('loading') : getString('cv.slos.selectHealthsource')}
          items={healthSourcesOptions}
          className={css.selectPrimary}
          disabled={!values.monitoredServiceRef}
          value={activeHealthSource}
          onChange={healthSource => {
            formikProps.setFieldValue(SLOFormFields.HEALTH_SOURCE_REF, healthSource.value)
            formikProps.setFieldValue(SLOFormFields.VALID_REQUEST_METRIC, undefined)
            formikProps.setFieldValue(SLOFormFields.GOOD_REQUEST_METRIC, undefined)
          }}
        />
      </Card>

      <Heading level={2} font={{ variation: FontVariation.FORM_TITLE }} margin={{ top: 'xxlarge', bottom: 'xsmall' }}>
        {getString('cv.slos.sliType')}
      </Heading>
      <Card className={css.cardSli}>
        <FormInput.RadioGroup
          name={SLOFormFields.SLI_TYPE}
          radioGroup={{ inline: true }}
          items={getSLITypeOptions(getString)}
        />
        <Text font={{ variation: FontVariation.BODY }} color={Color.GREY_600}>
          {getString('cv.slos.latencySLI')}
        </Text>
      </Card>

      <PickMetric formikProps={formikProps} />

      {children}
    </>
  )
}

export default SLI
