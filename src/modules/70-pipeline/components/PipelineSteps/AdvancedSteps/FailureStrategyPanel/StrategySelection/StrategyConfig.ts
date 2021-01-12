export enum Strategy {
  Ignore = 'Ignore',
  Abort = 'Abort',
  StageRollback = 'StageRollback',
  StepGroupRollback = 'StepGroupRollback',
  Retry = 'Retry',
  ManualIntervention = 'ManualIntervention',
  MarkAsSuccess = 'MarkAsSuccess'
}

export enum ErrorType {
  All = 'All',
  AnyOther = 'AnyOther',
  Authentication = 'Authentication',
  Connectivity = 'Connectivity',
  Timeout = 'Timeout',
  Authorization = 'Authorization',
  Verification = 'Verification',
  DelegateProvisioning = 'DelegateProvisioning'
}

export const allowedStrategiesAsPerStep: Record<string, Strategy[]> = {
  default: [
    Strategy.ManualIntervention,
    Strategy.StageRollback,
    Strategy.StepGroupRollback,
    Strategy.Ignore,
    Strategy.Retry,
    Strategy.MarkAsSuccess
  ]
}
