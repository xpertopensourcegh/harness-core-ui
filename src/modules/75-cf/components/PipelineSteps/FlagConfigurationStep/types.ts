import type { FormikState } from 'formik'
import type { StepElementConfig, StepSpecType } from 'services/cd-ng'

export interface FeatureFlagConfigurationSpec {
  feature: string
  environment: string
  instructions: Array<{
    identifier: string
    type: string // PatchInstruction
    spec: StepSpecType
  }>
}

export interface FlagConfigurationStepData extends StepElementConfig {
  spec: FeatureFlagConfigurationSpec
}

export enum CFPipelineInstructionType {
  SET_FEATURE_FLAG_STATE = 'SetFeatureFlagState',
  SET_DEFAULT_ON_VARIATION = 'SetOnVariation',
  SET_DEFAULT_OFF_VARIATION = 'SetOffVariation',
  ADD_RULE = 'AddRule',
  ADD_TARGETS_TO_VARIATION_TARGET_MAP = 'AddTargetsToVariationTargetMap',
  ADD_SEGMENT_TO_VARIATION_TARGET_MAP = 'AddSegmentToVariationTargetMap'
}

export interface FlagConfigurationStepFormData extends StepElementConfig {
  spec: {
    environment: string
    featureFlag: string
    state?: string // 'on' | 'off' | '<+input>'
    defaultRules?: {
      on: string
      off: string
    }
    percentageRollout?: {
      variation: Record<string, number | string>
      targetGroup: string
      bucketBy: string
    }
    serveVariationToIndividualTarget?: {
      include?: {
        variation: string
        targets: string[]
      }
    }
    serveVariationToTargetGroup?: {
      include?: {
        variation: string
        targetGroups: string[]
      }
    }
  }
}

export type FlagConfigurationStepFormDataValues = FormikState<FlagConfigurationStepFormData>['values']
