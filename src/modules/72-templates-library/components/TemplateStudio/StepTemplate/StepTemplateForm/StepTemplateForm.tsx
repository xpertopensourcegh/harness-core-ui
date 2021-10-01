import React from 'react'
import { Color, Container, MultiTypeInputType } from '@wings-software/uicore'
import produce from 'immer'
import { isEmpty, set } from 'lodash-es'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import {
  StepCommandsWithRef as StepCommands,
  StepFormikRef
} from '@pipeline/components/PipelineStudio/StepCommands/StepCommands'
import type { StepElementConfig } from 'services/cd-ng'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { TabTypes } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import type { TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'
import css from './StepTemplateForm.module.scss'

const StepTemplateForm = (props: TemplateProps<StepElementConfig>, formikRef: TemplateFormRef) => {
  const { formikProps } = props
  const stepFormikRef = React.useRef<StepFormikRef | null>(null)

  React.useImperativeHandle(formikRef, () => ({
    resetForm() {
      return stepFormikRef.current?.resetForm()
    }
  }))

  const onSubmitStep = async (
    item: Partial<
      StepElementConfig & {
        tab?: TabTypes
        delegateSelectors?: string[]
      }
    >
  ): Promise<void> => {
    const processNode = produce(formikProps.values as StepElementConfig, node => {
      if (item.tab !== TabTypes.Advanced) {
        if ((item as StepElementConfig).description) {
          node.description = (item as StepElementConfig).description
        } else if (node.description) {
          delete node.description
        }
        if ((item as StepElementConfig).timeout) {
          node.timeout = (item as StepElementConfig).timeout
        } else if (node.timeout) {
          delete node.timeout
        }
        if ((item as StepElementConfig).spec) {
          node.spec = { ...(item as StepElementConfig).spec }
        }
      } else {
        if (item.when) {
          node.when = item.when
        }
        if (!isEmpty(item.delegateSelectors)) {
          set(node, 'spec.delegateSelectors', item.delegateSelectors)
        } else if (node.spec?.delegateSelectors) {
          delete node.spec.delegateSelectors
        }
      }
      // default strategies can be present without having the need to click on Advanced Tab. For eg. in CV step.
      if (Array.isArray(item.failureStrategies)) {
        node.failureStrategies = item.failureStrategies
      } else if (node.failureStrategies) {
        delete node.failureStrategies
      }
    })
    formikProps?.setValues(processNode)
  }

  return (
    <Container background={Color.FORM_BG}>
      {formikProps && !isEmpty(formikProps.values) && !!formikProps.values.type && (
        <StepCommands
          className={css.stepForm}
          step={formikProps.values}
          isReadonly={false}
          stepsFactory={factory}
          onChange={onSubmitStep}
          onUpdate={onSubmitStep}
          isStepGroup={false}
          stepViewType={StepViewType.Template}
          ref={stepFormikRef}
          allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]}
        />
      )}
    </Container>
  )
}

export const StepTemplateFormWithRef = React.forwardRef(StepTemplateForm)
