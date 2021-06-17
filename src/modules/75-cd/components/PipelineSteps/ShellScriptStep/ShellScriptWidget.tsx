import React from 'react'
import { Formik, Accordion } from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'

import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepFormikFowardRef, setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/strings'

import type { ShellScriptFormData } from './shellScriptTypes'
import BaseShellScript from './BaseShellScript'
import OptionalConfiguration from './OptionalConfiguration'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

/**
 * Spec
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/1203634286/Shell+Script
 */

interface ShellScriptWidgetProps {
  initialValues: ShellScriptFormData
  onUpdate?: (data: ShellScriptFormData) => void
  readonly?: boolean
  stepViewType?: StepViewType
  isNewStep?: boolean
}

export function ShellScriptWidget(
  { initialValues, onUpdate, isNewStep = true, readonly }: ShellScriptWidgetProps,
  formikRef: StepFormikFowardRef
): JSX.Element {
  const { getString } = useStrings()

  const defaultSSHSchema = Yup.object().shape({
    name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.stepNameRequired') }),
    timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum')),
    spec: Yup.object().shape({
      shell: Yup.string().trim().required(getString('validation.scriptTypeRequired')),
      source: Yup.object().shape({
        spec: Yup.object().shape({
          script: Yup.string().trim().required(getString('cd.scriptRequired'))
        })
      })
    }),
    identifier: IdentifierSchema()
  })

  const values: any = {
    ...initialValues,
    spec: {
      ...initialValues.spec,
      executionTarget: {
        ...initialValues.spec.executionTarget,
        connectorRef: undefined
      }
    }
  }

  const validationSchema = defaultSSHSchema

  return (
    <Formik<ShellScriptFormData>
      onSubmit={submit => {
        onUpdate?.(submit)
      }}
      formName="shellScriptForm"
      initialValues={values}
      validationSchema={validationSchema}
    >
      {(formik: FormikProps<ShellScriptFormData>) => {
        // this is required
        setFormikRef(formikRef, formik)

        return (
          <React.Fragment>
            <BaseShellScript isNewStep={isNewStep} formik={formik} readonly={readonly} />
            <Accordion className={stepCss.accordion}>
              <Accordion.Panel
                id="optional-config"
                summary={getString('common.optionalConfig')}
                details={<OptionalConfiguration formik={formik} readonly={readonly} />}
              />
            </Accordion>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}

export const ShellScriptWidgetWithRef = React.forwardRef(ShellScriptWidget)
