import { FeatureFlagActivationStatus } from '@cf/utils/CFUtils'
import { PatchOperation, usePatchFeature } from 'services/cf'

export interface UseToggleFeatureFlagProps {
  accountIdentifier: string
  orgIdentifier: string
  environmentIdentifier: string
  projectIdentifier: string
  flagIdentifier: string
}

const makeInstruction = (isOn: boolean) => ({
  instructions: [
    {
      kind: 'setFeatureFlagState',
      parameters: {
        state: isOn ? FeatureFlagActivationStatus.ON : FeatureFlagActivationStatus.OFF
      }
    }
  ]
})

const ON_INSTRUCTION: PatchOperation = makeInstruction(true)
const OFF_INSTRUCTION: PatchOperation = makeInstruction(false)

export const useToggleFeatureFlag = ({
  accountIdentifier,
  orgIdentifier,
  environmentIdentifier,
  projectIdentifier,
  flagIdentifier
}: UseToggleFeatureFlagProps) => {
  const { mutate } = usePatchFeature({
    identifier: flagIdentifier,
    queryParams: {
      project: projectIdentifier,
      environment: environmentIdentifier,
      account: accountIdentifier,
      org: orgIdentifier
    }
  })

  return {
    on: () => mutate(ON_INSTRUCTION),
    off: () => mutate(OFF_INSTRUCTION)
  }
}
