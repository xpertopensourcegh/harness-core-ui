export enum Strategy {
  Abort = 'Abort',
  StageRollback = 'StageRollback',
  StepGroupRollback = 'StepGroupRollback',
  Retry = 'Retry',
  ManualIntervention = 'ManualIntervention',
  MarkAsSuccess = 'MarkAsSuccess'
}

export enum ErrorType {
  AnyOther = 'AnyOther',
  Authentication = 'Authentication',
  Connectivity = 'Connectivity',
  Timeout = 'Timeout',
  Authorization = 'Authorization',
  Verification = 'Verification',
  DelegateProvisioning = 'DelegateProvisioning'
}

export enum FailureStrategyPanelMode {
  STAGE = 'STAGE',
  STEP_GROUP = 'STEP_GROUP',
  STEP = 'STEP'
}

export const allowedStrategiesAsPerStep: Record<FailureStrategyPanelMode, Strategy[]> = {
  [FailureStrategyPanelMode.STEP]: [
    Strategy.ManualIntervention,
    Strategy.StageRollback,
    Strategy.Retry,
    Strategy.MarkAsSuccess
  ],
  [FailureStrategyPanelMode.STEP_GROUP]: [
    Strategy.ManualIntervention,
    Strategy.StageRollback,
    Strategy.StepGroupRollback,
    Strategy.Retry,
    Strategy.MarkAsSuccess
  ],
  [FailureStrategyPanelMode.STAGE]: [Strategy.StageRollback, Strategy.Retry, Strategy.MarkAsSuccess]
}
