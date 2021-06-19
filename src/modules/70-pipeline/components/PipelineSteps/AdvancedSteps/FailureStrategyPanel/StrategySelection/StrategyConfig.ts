import { mapValues } from 'lodash-es'
import { Strategy, ErrorType, FailureErrorType } from '@pipeline/utils/FailureStrategyUtils'
import { StageType } from '@pipeline/utils/stageHelpers'
import { StepMode as Modes } from '@pipeline/utils/stepUtils'

export const allowedStrategiesAsPerStep: (domain: StageType) => Record<Modes, Strategy[]> = (
  domain = StageType.DEPLOY
) => {
  switch (domain) {
    case StageType.BUILD:
      return {
        [Modes.STEP]: [
          Strategy.ManualIntervention,
          Strategy.Ignore,
          Strategy.Retry,
          Strategy.MarkAsSuccess,
          Strategy.Abort
        ],
        [Modes.STEP_GROUP]: [
          Strategy.ManualIntervention,
          Strategy.Ignore,
          Strategy.Retry,
          Strategy.MarkAsSuccess,
          Strategy.Abort
        ],
        [Modes.STAGE]: [Strategy.Ignore, Strategy.Retry, Strategy.MarkAsSuccess, Strategy.Abort]
      }
    case StageType.DEPLOY:
    default:
      return {
        [Modes.STEP]: [
          Strategy.ManualIntervention,
          Strategy.StageRollback,
          Strategy.Ignore,
          Strategy.Retry,
          Strategy.MarkAsSuccess,
          Strategy.Abort
        ],
        [Modes.STEP_GROUP]: [
          Strategy.ManualIntervention,
          Strategy.StageRollback,
          Strategy.Ignore,
          Strategy.StepGroupRollback,
          Strategy.Retry,
          Strategy.MarkAsSuccess,
          Strategy.Abort
        ],
        [Modes.STAGE]: [
          Strategy.ManualIntervention,
          Strategy.StageRollback,
          Strategy.Ignore,
          Strategy.Retry,
          Strategy.MarkAsSuccess,
          Strategy.Abort
        ]
      }
  }
}

export const errorTypesOrderForCD: FailureErrorType[] = [
  ErrorType.Authentication,
  ErrorType.Authorization,
  ErrorType.Connectivity,
  ErrorType.DelegateProvisioning,
  ErrorType.Timeout,
  ErrorType.Unknown,
  ErrorType.Verification
]
export const errorTypesOrderForCI: FailureErrorType[] = [ErrorType.Timeout, ErrorType.Unknown]

export const testIds: Record<Strategy, string> = mapValues(
  Strategy,
  (_, key) => `failure-strategy-${key.toLowerCase()}`
)
