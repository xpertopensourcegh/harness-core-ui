// Different interfaces for all the approval types
import type { MultiSelectOption } from '@wings-software/uicore'
import type { InputSetData, StepViewType } from '@pipeline/components/AbstractSteps/Step'
import type { StepElementConfig } from 'services/cd-ng'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'

export interface ApproverInputsSubmitCallInterface {
  name: string
  defaultValue?: string
}

export interface HarnessApprovalData extends StepElementConfig {
  // This later has to be replaced by the BE class
  spec: {
    approvalMessage: string
    includePipelineExecutionHistory: string | boolean
    approvers: {
      userGroups: string | string[] | MultiSelectOption[]
      users: string | string[] | MultiSelectOption[]
      minimumCount: string | number
      disallowPipelineExecutor: string | boolean
    }
    approverInputs: string | ApproverInputsSubmitCallInterface[]
  }
}

export interface HarnessApprovalDeploymentModeProps {
  stepViewType: StepViewType
  initialValues: HarnessApprovalData
  onUpdate?: (data: HarnessApprovalData) => void
  inputSetData?: InputSetData<HarnessApprovalData>
}

export interface HarnessApprovalStepModeProps {
  stepViewType?: StepViewType
  initialValues: HarnessApprovalData
  onUpdate?: (data: HarnessApprovalData) => void
}

export interface HarnessApprovalVariableListModeProps {
  variablesData: HarnessApprovalData
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
}

export interface APIStateInterface {
  options: MultiSelectOption[]
  error?: string
  apiStatus: string
}

export enum AsyncStatus {
  INIT = 'INIT',
  FETCHING = 'FETCHING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export enum EntityType {
  USER = 'USER',
  USERGROUP = 'USERGROUP'
}
