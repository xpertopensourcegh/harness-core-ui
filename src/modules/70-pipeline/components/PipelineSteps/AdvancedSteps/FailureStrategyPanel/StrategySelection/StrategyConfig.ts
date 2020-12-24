export enum Strategy {
  Ignore = 'Ignore',
  Abort = 'Abort',
  StageRollback = 'StageRollback',
  StepGroupRollback = 'StepGroupRollback',
  Retry = 'Retry',
  ManualIntervention = 'ManualIntervention',
  EndExecution = 'EndExecution'
}

export const allowedStrategiesAsPerStep: Record<string, Strategy[]> = {
  default: [
    Strategy.ManualIntervention,
    Strategy.StageRollback,
    Strategy.StepGroupRollback,
    Strategy.Ignore,
    Strategy.Retry,
    Strategy.EndExecution
  ]
}
