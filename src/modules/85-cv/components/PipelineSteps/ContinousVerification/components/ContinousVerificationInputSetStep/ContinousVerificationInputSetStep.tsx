/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useMemo, useState } from 'react'
import { FormInput, FormikForm, Container, RUNTIME_INPUT_VALUE, useToaster } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'

import { parse } from 'yaml'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { InputSetPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import type { PipelineInfoConfig } from 'services/cd-ng'
import { useGetPipeline } from 'services/pipeline-ng'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { useGetAllMonitoredServicesWithTimeSeriesHealthSources } from 'services/cv'
import { getMonitoredServiceOptions } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.utils'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import type { spec } from '../../types'
import { checkIfRunTimeInput } from '../../utils'
import type { ContinousVerificationProps } from './types'
import {
  baseLineOptions,
  durationOptions,
  monitoredServiceRefPath,
  trafficSplitPercentageOptions,
  VerificationSensitivityOptions
} from '../../constants'
import RunTimeMonitoredService from './components/RunTimeMonitoredService/RunTimeMonitoredService'
import {
  getInfraAndServiceData,
  getInfraAndServiceFromStage
} from './components/ContinousVerificationInputSetStep.utils'

import { MONITORED_SERVICE_TYPE } from '../ContinousVerificationWidget/components/ContinousVerificationWidgetSections/components/SelectMonitoredServiceType/SelectMonitoredServiceType.constants'
import { getMultiTypeInputProps } from '../ContinousVerificationWidget/components/ContinousVerificationWidgetSections/components/VerificationJobFields/VerificationJobFields.utils'
import css from './ContinousVerificationInputSetStep.module.scss'

export function ContinousVerificationInputSetStep(
  props: ContinousVerificationProps & { formik?: any }
): React.ReactElement {
  const { template, path, initialValues, readonly, onUpdate, formik, allowableTypes } = props
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<
    PipelineType<InputSetPathProps> & { accountId: string }
  >()
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const { showError } = useToaster()
  const [pipeline, setPipeline] = useState<{ pipeline: PipelineInfoConfig } | undefined>()
  const prefix = isEmpty(path) ? '' : `${path}.`
  const { sensitivity, duration, baseline, trafficsplit, deploymentTag } = (template?.spec?.spec as spec) || {}
  const { monitoredService } = template?.spec || {}
  const { data: pipelineData, refetch: fetchPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      getTemplatesResolvedPipeline: template?.type === StepType.Verify
    },
    lazy: true
  })

  const queryParams = useMemo(() => {
    return {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  }, [accountId, orgIdentifier, projectIdentifier])

  const {
    data: monitoredServicesData,
    refetch: fecthMonitoredServices,
    loading: monitoredServicesLoading,
    error: monitoredServicesDataError
  } = useGetAllMonitoredServicesWithTimeSeriesHealthSources({
    queryParams,
    lazy: true
  })

  useEffect(() => {
    fetchPipeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pipelineData?.data?.resolvedTemplatesPipelineYaml) {
      setPipeline(parse(pipelineData?.data?.resolvedTemplatesPipelineYaml))
    } else if (pipelineData?.data?.yamlPipeline) {
      setPipeline(parse(pipelineData?.data?.yamlPipeline))
    }
  }, [pipelineData?.data?.yamlPipeline, pipelineData?.data?.resolvedTemplatesPipelineYaml])

  useEffect(() => {
    if (monitoredService?.spec?.monitoredServiceRef && monitoredService?.type === MONITORED_SERVICE_TYPE.CONFIGURED) {
      fecthMonitoredServices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoredService?.spec?.monitoredServiceRef, monitoredService?.type])

  useEffect(() => {
    const error = monitoredServicesDataError
    if (error) {
      showError(getErrorMessage(error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoredServicesDataError])

  const { serviceIdentifierFromStage, envIdentifierDataFromStage } = useMemo(() => {
    return getInfraAndServiceFromStage(pipeline)
  }, [pipeline])

  const { serviceIdentifier, envIdentifier } = useMemo(() => {
    const { serviceIdentifierData, envIdentifierData } = getInfraAndServiceData(pipeline, formik)
    return { serviceIdentifier: serviceIdentifierData, envIdentifier: envIdentifierData }
  }, [pipeline, formik])

  const monitoredServicesOptions = useMemo(
    () => getMonitoredServiceOptions(monitoredServicesData?.data),
    [monitoredServicesData]
  )

  const renderRunTimeMonitoredService = (): JSX.Element => {
    if (
      monitoredService?.type === MONITORED_SERVICE_TYPE.CONFIGURED &&
      checkIfRunTimeInput(monitoredService?.spec?.monitoredServiceRef)
    ) {
      return (
        <Container className={css.itemRuntimeSetting}>
          <FormInput.MultiTypeInput
            name={`${prefix}${monitoredServiceRefPath}`}
            label={'Monitored Service'}
            useValue
            placeholder={monitoredServicesLoading ? getString('loading') : 'Select Monitored Service'}
            selectItems={monitoredServicesOptions}
            multiTypeInputProps={getMultiTypeInputProps(expressions, allowableTypes)}
          />
        </Container>
      )
    } else if (
      serviceIdentifierFromStage === RUNTIME_INPUT_VALUE ||
      envIdentifierDataFromStage === RUNTIME_INPUT_VALUE
    ) {
      return (
        <RunTimeMonitoredService
          serviceIdentifier={serviceIdentifier}
          envIdentifier={envIdentifier}
          onUpdate={onUpdate}
          initialValues={initialValues}
          prefix={prefix}
        />
      )
    } else {
      return <></>
    }
  }

  return (
    <FormikForm>
      <Container className={css.container}>
        {renderRunTimeMonitoredService()}
        {checkIfRunTimeInput(sensitivity) && (
          <Container className={css.itemRuntimeSetting}>
            <FormInput.MultiTypeInput
              label={getString('sensitivity')}
              name={`${prefix}spec.spec.sensitivity`}
              selectItems={VerificationSensitivityOptions}
              useValue
              multiTypeInputProps={{
                expressions,
                allowableTypes
              }}
              disabled={readonly}
            />
          </Container>
        )}

        {checkIfRunTimeInput(duration) && (
          <Container className={css.itemRuntimeSetting}>
            <FormInput.MultiTypeInput
              label={getString('duration')}
              name={`${prefix}spec.spec.duration`}
              selectItems={durationOptions}
              useValue
              multiTypeInputProps={{
                expressions,
                allowableTypes
              }}
              disabled={readonly}
            />
          </Container>
        )}

        {checkIfRunTimeInput(baseline) && (
          <Container className={css.itemRuntimeSetting}>
            <FormInput.MultiTypeInput
              label={getString('connectors.cdng.baseline')}
              name={`${prefix}spec.spec.baseline`}
              selectItems={baseLineOptions}
              useValue
              multiTypeInputProps={{
                expressions,
                allowableTypes
              }}
              disabled={readonly}
            />
          </Container>
        )}

        {checkIfRunTimeInput(trafficsplit) && (
          <Container className={css.itemRuntimeSetting}>
            <FormInput.MultiTypeInput
              label={getString('connectors.cdng.trafficsplit')}
              name={`${prefix}spec.spec.trafficsplit`}
              selectItems={trafficSplitPercentageOptions}
              useValue
              multiTypeInputProps={{
                expressions,
                allowableTypes
              }}
              disabled={readonly}
            />
          </Container>
        )}

        {checkIfRunTimeInput(deploymentTag) && (
          <Container className={css.itemRuntimeSetting}>
            <FormInput.MultiTextInput
              label={getString('connectors.cdng.artifactTag')}
              name={`${prefix}spec.spec.deploymentTag`}
              multiTextInputProps={{
                expressions,
                allowableTypes
              }}
              disabled={readonly}
            />
          </Container>
        )}

        {checkIfRunTimeInput(template?.timeout) && (
          <Container className={css.itemRuntimeSetting}>
            <FormMultiTypeDurationField
              name={`${prefix}timeout`}
              label={getString('pipelineSteps.timeoutLabel')}
              disabled={readonly}
              multiTypeDurationProps={{
                expressions,
                enableConfigureOptions: false,
                allowableTypes
              }}
            />
          </Container>
        )}
      </Container>
    </FormikForm>
  )
}
