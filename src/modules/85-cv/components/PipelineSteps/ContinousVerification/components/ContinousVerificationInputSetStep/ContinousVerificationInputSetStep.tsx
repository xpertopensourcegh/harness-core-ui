import React, { useEffect, useMemo, useState } from 'react'
import { FormInput, FormikForm, SelectOption } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'

import { parse } from 'yaml'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { InputSetPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import type { NgPipeline } from 'services/cd-ng'
import { useGetPipeline } from 'services/pipeline-ng'
import type { spec } from '../../types'
import { checkIfRunTimeInput } from '../../utils'
import type { ContinousVerificationProps } from './types'
import {
  baseLineOptions,
  durationOptions,
  trafficSplitPercentageOptions,
  VerificationSensitivityOptions
} from '../../constants'
import RunTimeMonitoredService from './components/RunTimeMonitoredService/RunTimeMonitoredService'
import { getInfraAndServiceData } from './components/ContinousVerificationInputSetStep.utils'

export function ContinousVerificationInputSetStep(
  props: ContinousVerificationProps & { formik?: any }
): React.ReactElement {
  const { template, path, initialValues, readonly, onUpdate, formik } = props
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<
    PipelineType<InputSetPathProps> & { accountId: string }
  >()
  const { getString } = useStrings()
  const [pipeline, setPipeline] = useState<{ pipeline: NgPipeline } | undefined>()
  const prefix = isEmpty(path) ? '' : `${path}.`
  const { sensitivity, duration, baseline, trafficsplit, deploymentTag } = (template?.spec?.spec as spec) || {}
  const { data: pipelineData, refetch: fetchPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
    lazy: true
  })

  useEffect(() => {
    fetchPipeline()
  }, [fetchPipeline])

  useEffect(() => {
    if (pipelineData?.data?.yamlPipeline) {
      setPipeline(parse(pipelineData?.data?.yamlPipeline))
    }
  }, [pipelineData?.data?.yamlPipeline])

  const { serviceIdentifier, envIdentifier } = useMemo(() => {
    const { serviceIdentifierData, envIdentifierData } = getInfraAndServiceData(pipeline, formik)
    return { serviceIdentifier: serviceIdentifierData, envIdentifier: envIdentifierData }
  }, [pipeline, formik])

  return (
    <FormikForm>
      {checkIfRunTimeInput(template?.spec?.monitoredServiceRef) && (
        <RunTimeMonitoredService
          serviceIdentifier={serviceIdentifier}
          envIdentifier={envIdentifier}
          onUpdate={onUpdate}
          initialValues={initialValues}
          prefix={prefix}
        />
      )}

      {checkIfRunTimeInput(sensitivity) && (
        <FormInput.Select
          label={getString('sensitivity')}
          name={`${prefix}spec.spec.sensitivity`}
          items={VerificationSensitivityOptions}
          onChange={(option: SelectOption) => {
            const updatedSpecs = { spec: { ...initialValues.spec.spec, sensitivity: option.value.toString() } }
            onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, ...updatedSpecs } })
          }}
          disabled={readonly}
        />
      )}

      {checkIfRunTimeInput(duration) && (
        <FormInput.Select
          label={getString('duration')}
          name={`${prefix}spec.spec.duration`}
          items={durationOptions}
          onChange={(option: SelectOption) => {
            const updatedSpecs = { spec: { ...initialValues.spec.spec, duration: option.value.toString() } }
            onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, ...updatedSpecs } })
          }}
          disabled={readonly}
        />
      )}

      {checkIfRunTimeInput(baseline) && (
        <FormInput.Select
          label={getString('connectors.cdng.baseline')}
          name={`${prefix}spec.spec.baseline`}
          items={baseLineOptions}
          onChange={(option: SelectOption) => {
            const updatedSpecs = { spec: { ...initialValues.spec.spec, baseline: option.value.toString() } }
            onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, ...updatedSpecs } })
          }}
          disabled={readonly}
        />
      )}

      {checkIfRunTimeInput(trafficsplit) && (
        <FormInput.Select
          label={getString('connectors.cdng.trafficsplit')}
          name={`${prefix}spec.spec.trafficsplit`}
          items={trafficSplitPercentageOptions}
          onChange={(option: SelectOption) => {
            const updatedSpecs = { spec: { ...initialValues.spec.spec, trafficsplit: option.value.toString() } }
            onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, ...updatedSpecs } })
          }}
          disabled={readonly}
        />
      )}

      {checkIfRunTimeInput(deploymentTag) && (
        <FormInput.Text
          label={getString('connectors.cdng.deploymentTag')}
          name={`${prefix}spec.spec.deploymentTag`}
          disabled={readonly}
        />
      )}

      {checkIfRunTimeInput(template?.timeout) && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${prefix}timeout`}
          disabled={readonly}
        />
      )}
    </FormikForm>
  )
}
