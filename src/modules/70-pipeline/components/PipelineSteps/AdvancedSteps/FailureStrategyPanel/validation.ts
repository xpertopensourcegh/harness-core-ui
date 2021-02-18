import * as Yup from 'yup'
import { omit } from 'lodash-es'

import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import { ErrorType, Strategy } from './StrategySelection/StrategyConfig'

function getRetryActionBaseFields(getString: (str: string) => string): Record<string, Yup.Schema<unknown>> {
  return {
    retryCount: Yup.number()
      .typeError(getString('failureStrategies.validation.retryCountInteger'))
      .integer(getString('failureStrategies.validation.retryCountInteger'))
      .min(1, getString('failureStrategies.validation.retryCountMinimum'))
      .required(getString('failureStrategies.validation.retryCountRequired')),
    retryIntervals: Yup.array()
      .of(getDurationValidationSchema().required(getString('failureStrategies.validation.retryIntervalRequired')))
      .min(1, getString('failureStrategies.validation.retryIntervalMinimum'))
      .required(getString('failureStrategies.validation.retryIntervalRequired'))
  }
}

function getManualInterventionBaseFields(getString: (str: string) => string): Record<string, Yup.Schema<unknown>> {
  return {
    timeout: getDurationValidationSchema().required(getString('failureStrategies.validation.timeoutRequired'))
  }
}

export function getFailureStrategiesValidationSchema(
  getString: (str: string) => string
): Yup.NotRequiredArraySchema<unknown> {
  return Yup.array().of(
    Yup.object()
      .shape({
        onFailure: Yup.object()
          .shape({
            errors: Yup.array()
              .of(Yup.mixed().oneOf(Object.values(ErrorType)).required())
              .min(1, getString('failureStrategies.validation.errorsMinimum'))
              .required(getString('failureStrategies.validation.errorsRequired')),
            action: Yup.object()
              .shape({
                type: Yup.mixed()
                  .oneOf(Object.values(Strategy))
                  .required(getString('failureStrategies.validation.actionRequired')),
                spec: Yup.mixed()
                  .when('type', {
                    is: Strategy.Retry,
                    then: Yup.object()
                      .shape({
                        ...getRetryActionBaseFields(getString),
                        onRetryFailure: Yup.object()
                          .shape({
                            action: Yup.object().shape({
                              type: Yup.mixed()
                                .oneOf(Object.values(omit(Strategy, [Strategy.Retry])))
                                .required(getString('failureStrategies.validation.onRetryFailureRequired')),
                              spec: Yup.mixed().when('type', {
                                is: Strategy.ManualIntervention,
                                then: Yup.object().shape({
                                  ...getManualInterventionBaseFields(getString),
                                  onTimeout: Yup.object().shape({
                                    action: Yup.object()
                                      .shape({
                                        type: Yup.mixed()
                                          .oneOf(
                                            Object.values(omit(Strategy, [Strategy.ManualIntervention, Strategy.Retry]))
                                          )
                                          .required(getString('failureStrategies.validation.onTimeoutRequired'))
                                      })
                                      .required(getString('failureStrategies.validation.onTimeoutRequired'))
                                      .required(getString('failureStrategies.validation.onTimeoutRequired'))
                                  })
                                })
                              })
                            })
                          })
                          .required(getString('failureStrategies.validation.onRetryFailureRequired'))
                      })
                      .required()
                  })
                  .when('type', {
                    is: Strategy.ManualIntervention,
                    then: Yup.object()
                      .shape({
                        ...getManualInterventionBaseFields(getString),
                        onTimeout: Yup.object().shape({
                          action: Yup.object()
                            .shape({
                              type: Yup.mixed()
                                .oneOf(Object.values(omit(Strategy, [Strategy.ManualIntervention])))
                                .required(getString('failureStrategies.validation.onTimeoutRequired')),
                              spec: Yup.mixed().when('type', {
                                is: Strategy.Retry,
                                then: Yup.object()
                                  .shape({
                                    ...getRetryActionBaseFields(getString),
                                    onRetryFailure: Yup.object()
                                      .shape({
                                        action: Yup.object()
                                          .shape({
                                            type: Yup.mixed()
                                              .oneOf(
                                                Object.values(
                                                  omit(Strategy, [Strategy.Retry, Strategy.ManualIntervention])
                                                )
                                              )
                                              .required(
                                                getString('failureStrategies.validation.onRetryFailureRequired')
                                              )
                                          })
                                          .required(getString('failureStrategies.validation.onRetryFailureRequired'))
                                      })
                                      .required(getString('failureStrategies.validation.onRetryFailureRequired'))
                                  })
                                  .required(getString('failureStrategies.validation.onRetryFailureRequired'))
                              })
                            })
                            .required(getString('failureStrategies.validation.onTimeoutRequired'))
                        })
                      })
                      .required()
                  })
              })
              .required(getString('failureStrategies.validation.actionRequired'))
          })
          .required()
      })
      .required()
  )
}
