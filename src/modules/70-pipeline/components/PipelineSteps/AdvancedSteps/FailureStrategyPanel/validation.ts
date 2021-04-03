import * as Yup from 'yup'
import { omit } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'

import type { UseStringsReturn } from 'framework/exports'
import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import { ErrorType, Strategy } from './StrategySelection/StrategyConfig'

const MAX_RETRIES = 10000

function getRetryActionBaseFields(getString: UseStringsReturn['getString']): Record<string, Yup.Schema<unknown>> {
  return {
    retryCount: Yup.mixed().test({
      name: 'failureStrategies-retryCount',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      test(value: any) {
        if (getMultiTypeFromValue(value) !== MultiTypeInputType.FIXED) {
          return true
        }

        const schema = Yup.number()
          .typeError(getString('failureStrategies.validation.retryCountInteger'))
          .integer(getString('failureStrategies.validation.retryCountInteger'))
          .min(1, getString('failureStrategies.validation.retryCountMinimum'))
          .max(MAX_RETRIES, getString('failureStrategies.validation.retryCountMaximum', { count: MAX_RETRIES }))
          .required(getString('failureStrategies.validation.retryCountRequired'))

        try {
          schema.validateSync(value)
          return true
        } catch (e) {
          return this.createError({ message: e.message })
        }
      }
    }),
    retryIntervals: Yup.array()
      .of(getDurationValidationSchema().required(getString('failureStrategies.validation.retryIntervalRequired')))
      .min(1, getString('failureStrategies.validation.retryIntervalMinimum'))
      .required(getString('failureStrategies.validation.retryIntervalRequired'))
  }
}

function getManualInterventionBaseFields(
  getString: UseStringsReturn['getString']
): Record<string, Yup.Schema<unknown>> {
  return {
    timeout: getDurationValidationSchema().required(getString('failureStrategies.validation.timeoutRequired'))
  }
}

export function getFailureStrategiesValidationSchema(
  getString: UseStringsReturn['getString']
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
