import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  FormInput,
  getMultiTypeFromValue,
  MultiTypeInputType,
  PageError,
  SelectOption
} from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { useGetAllFeatures } from 'services/cf'
import type { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { CF_DEFAULT_PAGE_SIZE, getErrorMessage } from '@cf/utils/CFUtils'
import type { FlagConfigurationStepData, FlagConfigurationStepFormData } from './types'

export interface FlagConfigurationInputSetStepProps {
  environment: FlagConfigurationStepFormData['spec']['environment']
  initialValues: FlagConfigurationStepFormData
  onUpdate?: (data: FlagConfigurationStepFormData) => void
  stepViewType?: StepViewType
  readonly?: boolean
  template?: FlagConfigurationStepData
  path: string
}

function FlagConfigurationInputSetStep({
  environment,
  template,
  path,
  readonly
}: FlagConfigurationInputSetStepProps): React.ReactElement {
  const { getString } = useStrings()

  const { accountId, orgIdentifier, projectIdentifier } = useParams<Record<string, string>>()
  const queryParams = useMemo(
    () => ({
      account: accountId,
      accountIdentifier: accountId,
      org: orgIdentifier,
      project: projectIdentifier,
      environment,
      pageSize: CF_DEFAULT_PAGE_SIZE
    }),
    [accountId, orgIdentifier, projectIdentifier, environment]
  )

  const {
    data: featuresData,
    error: errorFeatures,
    refetch: refetchFeatures
  } = useGetAllFeatures({ queryParams, debounce: 200 })

  const flagItems = useMemo<SelectOption[]>(
    () => featuresData?.features?.map(({ identifier: value, name: label }) => ({ value, label })) || [],
    [featuresData?.features]
  )

  if (errorFeatures) {
    return (
      <Container padding={{ top: 'huge' }}>
        <PageError message={getErrorMessage(errorFeatures)} width={450} onClick={() => refetchFeatures()} />
      </Container>
    )
  }

  return (
    <>
      {getMultiTypeFromValue(template?.spec?.feature) === MultiTypeInputType.RUNTIME && (
        <FormInput.Select
          label={getString('cf.pipeline.flagConfiguration.selectFlag')}
          name={`${path}.spec.feature`}
          items={flagItems}
          disabled={readonly}
          onQueryChange={name => refetchFeatures({ queryParams: { ...queryParams, name } })}
        />
      )}
    </>
  )
}

export default FlagConfigurationInputSetStep
