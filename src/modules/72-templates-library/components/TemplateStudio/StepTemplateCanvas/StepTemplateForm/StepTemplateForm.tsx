import React from 'react'
import { Color, Container, MultiTypeInputType } from '@wings-software/uicore'
import produce from 'immer'
import { debounce, isEmpty, isEqual, set } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import {
  StepCommandsWithRef as StepCommands,
  StepFormikRef
} from '@pipeline/components/PipelineStudio/StepCommands/StepCommands'
import type { StepElementConfig } from 'services/cd-ng'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { TabTypes, Values } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'
import { sanitize } from '@common/utils/JSONUtils'
import { TemplateContext } from '../../TemplateContext/TemplateContext'
import css from './StepTemplateForm.module.scss'

const StepTemplateForm = (_props: unknown, formikRef: TemplateFormRef): JSX.Element => {
  const {
    state: { template, isLoading, isUpdated },
    updateTemplate,
    isReadonly
  } = React.useContext(TemplateContext)
  const stepFormikRef = React.useRef<StepFormikRef | null>(null)
  const [key, setKey] = React.useState<string>(template.versionLabel)

  React.useImperativeHandle(formikRef, () => ({
    resetForm() {
      return stepFormikRef.current?.resetForm()
    },
    submitForm() {
      return stepFormikRef.current?.submitForm()
    },
    getErrors() {
      return stepFormikRef.current?.getErrors() || {}
    }
  }))

  const onSubmitStep = async (item: Partial<Values>): Promise<void> => {
    const processNode = produce(template.spec as StepElementConfig, node => {
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
      if (Array.isArray(item.failureStrategies) && !isEmpty(item.failureStrategies)) {
        node.failureStrategies = item.failureStrategies
      } else if (node.failureStrategies) {
        delete node.failureStrategies
      }
    })
    sanitize(processNode, { removeEmptyArray: false, removeEmptyObject: false, removeEmptyString: false })
    if (!isEqual(template.spec, processNode)) {
      set(template, 'spec', processNode)
      await updateTemplate(template)
    }
  }

  const debounceSubmit = debounce((step: Partial<Values>): void => {
    onSubmitStep(step)
  }, 500)

  React.useEffect(() => {
    if (!isUpdated && !isLoading) {
      setKey(uuid())
    }
  }, [isLoading])

  return (
    <Container background={Color.FORM_BG} key={key}>
      {template && !isEmpty(template.spec) && !!(template.spec as StepElementConfig)?.type && (
        <StepCommands
          className={css.stepForm}
          step={template.spec as StepElementConfig}
          isReadonly={isReadonly}
          stepsFactory={factory}
          onChange={debounceSubmit}
          onUpdate={debounceSubmit}
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
