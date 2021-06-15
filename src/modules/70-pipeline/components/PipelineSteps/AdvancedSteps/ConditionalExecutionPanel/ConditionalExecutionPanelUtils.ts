export enum PipelineOrStageStatus {
  SUCCESS = 'Success',
  ALL = 'All',
  FAILURE = 'Failure'
}

export interface ConditionalExecutionConfig {
  status: PipelineOrStageStatus
  condition: string
}

export interface ConditionalExecutionOption extends ConditionalExecutionConfig {
  enableJEXL: boolean
}

export const ModeEntityNameMap = {
  STAGE: 'stage',
  STEP_GROUP: 'step group',
  STEP: 'step'
}

export const ParentModeEntityNameMap = {
  STAGE: 'pipeline',
  STEP_GROUP: 'stage',
  STEP: 'stage'
}

export const statusToStatusMapping: any = {
  OnPipelineSuccess: PipelineOrStageStatus.SUCCESS,
  OnStageSuccess: PipelineOrStageStatus.SUCCESS,
  OnPipelineFailure: PipelineOrStageStatus.FAILURE,
  OnStageFailure: PipelineOrStageStatus.FAILURE,
  Always: PipelineOrStageStatus.ALL
}
