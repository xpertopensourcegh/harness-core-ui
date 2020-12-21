import type { IconName } from '@wings-software/uikit'

export enum Strategy {
  Ignore = 'Ignore',
  Abort = 'Abort',
  StageRollback = 'StageRollback',
  StepGroupRollback = 'StepGroupRollback',
  Retry = 'Retry',
  ManualIntervention = 'ManualIntervention',
  EndExecution = 'EndExecution'
}

export interface StrategyConfig {
  onRetryFailure: Partial<Record<Strategy, Pick<StrategyConfig, 'onRetryFailure'>>> | null
  icon: IconName
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

export const strategyConfigMap: Record<Strategy, StrategyConfig> = {
  [Strategy.Ignore]: {
    onRetryFailure: null,
    icon: 'delete'
  },
  [Strategy.Abort]: {
    onRetryFailure: null,
    icon: 'ban-circle'
  },
  [Strategy.EndExecution]: {
    onRetryFailure: null,
    icon: 'step-forward'
  },
  [Strategy.StageRollback]: {
    onRetryFailure: null,
    icon: 'repeat'
  },
  [Strategy.StepGroupRollback]: {
    onRetryFailure: null,
    icon: 'repeat'
  },
  [Strategy.Retry]: {
    onRetryFailure: {
      [Strategy.ManualIntervention]: {
        onRetryFailure: {
          [Strategy.Ignore]: { onRetryFailure: null },
          [Strategy.StageRollback]: { onRetryFailure: null },
          [Strategy.StepGroupRollback]: { onRetryFailure: null },
          [Strategy.Abort]: { onRetryFailure: null }
        }
      },
      [Strategy.Ignore]: { onRetryFailure: null },
      [Strategy.StageRollback]: { onRetryFailure: null },
      [Strategy.StepGroupRollback]: { onRetryFailure: null },
      [Strategy.Abort]: { onRetryFailure: null }
    },
    icon: 'refresh'
  },
  [Strategy.ManualIntervention]: {
    onRetryFailure: {
      [Strategy.Retry]: {
        onRetryFailure: {
          [Strategy.ManualIntervention]: { onRetryFailure: null },
          [Strategy.Ignore]: { onRetryFailure: null },
          [Strategy.StageRollback]: { onRetryFailure: null },
          [Strategy.StepGroupRollback]: { onRetryFailure: null },
          [Strategy.EndExecution]: { onRetryFailure: null }
        }
      },
      [Strategy.Ignore]: { onRetryFailure: null },
      [Strategy.StageRollback]: { onRetryFailure: null },
      [Strategy.StepGroupRollback]: { onRetryFailure: null },
      [Strategy.Abort]: { onRetryFailure: null }
    },
    icon: 'hand-up'
  }
}
