import { useCallback } from 'react'
import * as yup from 'yup'
import type { ObjectSchema } from 'yup'
import { yupToFormErrors, FormikErrors } from 'formik'
import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { set, uniqBy } from 'lodash-es'
import { useStrings } from 'framework/exports'
import { StringUtils } from '@common/exports'
import type { ExecutionWrapperConfig, StepElementConfig } from 'services/cd-ng'
import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'

export enum Types {
  Identifier,
  Name,
  ConnectorRef,
  AWSConnectorRef,
  GCPConnectorRef,
  DockerHubConnectorRef,
  Image,
  ImageName,
  Command,
  Host,
  ProjectID,
  Region,
  Account,
  Repo,
  Bucket,
  SourcePath,
  Target,
  ReportPaths,
  Tags,
  SourcePaths,
  Entrypoint,
  Args,
  BuildArgs,
  EnvVariables,
  Labels,
  Settings,
  OutputVariables,
  LimitMemory,
  LimitCPU,
  Timeout,
  Key
}

interface Field {
  name: string
  type: Types
  required?: boolean
}

type Dependencies = { [key: string]: any }

type ValidateReturnType<T> = FormikErrors<T> | {}
type UseValidateReturnType<T> = (values: T) => ValidateReturnType<T>

const validIdRegex = /^(?![0-9])[0-9a-zA-Z_]*$/
const validNameRegex = /^[0-9a-zA-Z_-\s]*$/

export function validate<T>(values: T, schema: ObjectSchema): ValidateReturnType<T> {
  try {
    schema.validateSync(values, { abortEarly: false })
    return {}
  } catch (error) {
    return yupToFormErrors(error)
  }
}

export function useValidate<T>(fields: Field[], { initialValues, steps }: Dependencies = {}): UseValidateReturnType<T> {
  const { getString } = useStrings()

  const objectSchema: { [key: string]: any } = {}

  fields.forEach(({ name, type, required }) => {
    let validationRule

    if (type === Types.Identifier) {
      validationRule = yup
        .string()
        .trim()
        .matches(validIdRegex, getString('validation.validStepIdRegex'))
        .notOneOf(StringUtils.illegalIdentifiers, getString('validation.illegalIdentifier'))
        .test('isStepIdUnique', getString('validation.uniqueStepId'), identifier => {
          if (!initialValues || !steps) return true

          const allSteps: StepElementConfig[] = []

          // TODO: Add support for stepGroup
          steps.forEach(({ step, parallel }: ExecutionWrapperConfig) => {
            if (parallel) {
              // TODO: Fix typings
              ;(parallel as any).forEach(({ step: parallelStep }: { step: StepElementConfig }) => {
                allSteps.push(parallelStep)
              })
            } else {
              allSteps.push(step as StepElementConfig)
            }
          })

          const currentStepIndex = allSteps.findIndex(step => {
            return step?.identifier === initialValues.identifier
          })

          return allSteps.every((step, index: number) => {
            // Skip ID validation for the currently opened step (if it was already added)
            if (currentStepIndex === index) return true

            return step?.identifier !== identifier
          })
        })

      if (required) {
        validationRule = validationRule.required(getString('validation.identifierRequired'))
      }
    }

    if (type === Types.Name) {
      validationRule = yup.string().matches(validNameRegex, getString('validation.validStepNameRegex'))

      if (required) {
        validationRule = validationRule.required(getString('validation.stepNameRequired'))
      }
    }

    if (type === Types.Key) {
      validationRule = yup.string().required(getString('validation.keyRequired'))
    }

    if (type === Types.ConnectorRef) {
      if (required) {
        validationRule = yup.string().required(getString('validation.connectorRefRequired'))
      }
    }

    if (type === Types.AWSConnectorRef) {
      if (required) {
        validationRule = yup.string().required(getString('validation.AWSConnectorRefRequired'))
      }
    }

    if (type === Types.GCPConnectorRef) {
      if (required) {
        validationRule = yup.string().required(getString('validation.GCPConnectorRefRequired'))
      }
    }
    if (type === Types.DockerHubConnectorRef) {
      if (required) {
        validationRule = yup.string().required(getString('validation.dockerHubConnectorRefRequired'))
      }
    }

    if (type === Types.Image) {
      if (required) {
        validationRule = yup.string().required(getString('validation.imageRequired'))
      }
    }

    if (type === Types.ImageName) {
      if (required) {
        validationRule = yup.string().required(getString('validation.imageNameRequired'))
      }
    }

    if (type === Types.Command) {
      if (required) {
        validationRule = yup.string().required(getString('validation.commandRequired'))
      }
    }

    if (type === Types.Host) {
      if (required) {
        validationRule = yup.string().required(getString('validation.hostRequired'))
      }
    }

    if (type === Types.ProjectID) {
      if (required) {
        validationRule = yup.string().required(getString('validation.projectIDRequired'))
      }
    }

    if (type === Types.Region) {
      if (required) {
        validationRule = yup.string().required(getString('validation.regionRequired'))
      }
    }

    if (type === Types.Account) {
      if (required) {
        validationRule = yup.string().required(getString('validation.accountRequired'))
      }
    }

    if (type === Types.Repo) {
      if (required) {
        validationRule = yup.string().required(getString('validation.repoRequired'))
      }
    }

    if (type === Types.Bucket) {
      if (required) {
        validationRule = yup.string().required(getString('validation.bucketRequired'))
      }
    }

    if (type === Types.SourcePath) {
      if (required) {
        validationRule = yup.string().required(getString('validation.sourcePathRequired'))
      }
    }

    if (type === Types.Target) {
      if (required) {
        validationRule = yup.string().required(getString('validation.targetRequired'))
      }
    }

    if (
      type === Types.ReportPaths ||
      type === Types.Tags ||
      type === Types.SourcePaths ||
      type === Types.Entrypoint ||
      type === Types.Args
    ) {
      validationRule = yup.lazy(value => {
        if (Array.isArray(value)) {
          let schema = yup.array().test('valuesShouldBeUnique', getString('validation.uniqueValues'), paths => {
            if (!paths) return true
            return uniqBy(paths, 'value').length === paths.length
          })

          if (Array.isArray(value) && type === Types.Tags && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.tagsRequired'))
          }

          if (Array.isArray(value) && type === Types.SourcePaths && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.sourcePathsRequired'))
          }

          return schema
        } else {
          return yup.string()
        }
      })
    }

    if (type === Types.EnvVariables || type === Types.Settings || type === Types.Labels || type === Types.BuildArgs) {
      validationRule = yup.lazy(value => {
        if (Array.isArray(value)) {
          let schema = yup
            .array()
            .of(
              yup.object().shape(
                {
                  key: yup.string().when('value', {
                    is: val => val?.length,
                    then: yup
                      .string()
                      .matches(validIdRegex, getString('validation.validKeyRegex'))
                      .required(getString('validation.keyRequired'))
                  }),
                  value: yup.string().when('key', {
                    is: val => val?.length,
                    then: yup.string().required(getString('validation.valueRequired'))
                  })
                },
                [['key', 'value']]
              )
            )
            .test('keysShouldBeUnique', getString('validation.uniqueKeys'), envVariables => {
              if (!envVariables) return true
              return uniqBy(envVariables, 'key').length === envVariables.length
            })

          if (Array.isArray(value) && type == Types.EnvVariables && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.environmentVariablesRequired'))
          }
          if (Array.isArray(value) && type == Types.Settings && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.settingsRequired'))
          }
          if (Array.isArray(value) && type == Types.Labels && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.labelsRequired'))
          }
          if (Array.isArray(value) && type == Types.BuildArgs && required) {
            schema = schema
              .ensure()
              .compact((val: any) => !val?.value)
              .min(1, getString('validation.buildArgsRequired'))
          }
          return schema
        } else {
          return yup.string()
        }
      })
    }

    if (type === Types.OutputVariables) {
      validationRule = yup.lazy(value =>
        Array.isArray(value)
          ? yup
              .array()
              .of(
                yup.object().shape({
                  value: yup.lazy(val =>
                    getMultiTypeFromValue(val as string) === MultiTypeInputType.FIXED
                      ? yup.string().matches(validIdRegex, getString('validation.validOutputVariableRegex'))
                      : yup.string()
                  )
                })
              )
              .test('valuesShouldBeUnique', getString('validation.uniqueValues'), outputVariables => {
                if (!outputVariables) return true
                return uniqBy(outputVariables, 'value').length === outputVariables.length
              })
          : yup.string()
      )
    }

    if (type === Types.LimitMemory) {
      validationRule = yup.lazy(value =>
        getMultiTypeFromValue(value as string) === MultiTypeInputType.FIXED
          ? yup
              .string()
              // ^$ in the end is to pass empty string because otherwise it will fail
              .matches(/^\d+$|^\d+(E|P|T|G|M|K|Ei|Pi|Ti|Gi|Mi|Ki)$|^$/, getString('validation.matchPattern'))
          : yup.string()
      )
    }

    if (type === Types.LimitCPU) {
      validationRule = yup.lazy(value =>
        getMultiTypeFromValue(value as string) === MultiTypeInputType.FIXED
          ? // ^$ in the end is to pass empty string because otherwise it will fail
            yup.string().matches(/^\d+(\.\d+)?$|^\d+m$|^$/, getString('validation.matchPattern'))
          : yup.string()
      )
    }

    if (type === Types.Timeout) {
      validationRule = getDurationValidationSchema({ minimum: '10s' })
    }

    set(objectSchema, name, validationRule)
  })

  if (objectSchema.spec) {
    objectSchema.spec = yup.object().shape(objectSchema.spec).required()
  }

  const schema = yup.object().shape(objectSchema)

  return useCallback(values => validate<T>(values, schema), [])
}
