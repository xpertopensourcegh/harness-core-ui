import { Modes } from '../../common'

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

export const allowedStrategiesAsPerStep: Record<Modes, Strategy[]> = {
  [Modes.STEP]: [Strategy.ManualIntervention, Strategy.StageRollback, Strategy.Retry, Strategy.MarkAsSuccess],
  [Modes.STEP_GROUP]: [
    Strategy.ManualIntervention,
    Strategy.StageRollback,
    Strategy.StepGroupRollback,
    Strategy.Retry,
    Strategy.MarkAsSuccess
  ],
  [Modes.STAGE]: [Strategy.StageRollback, Strategy.Retry, Strategy.MarkAsSuccess]
}
