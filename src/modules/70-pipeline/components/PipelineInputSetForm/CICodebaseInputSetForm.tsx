import React from 'react'
import { get, isEmpty } from 'lodash-es'
import { FormInput, Color, Text, MultiTypeInputType } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { useStrings } from 'framework/strings'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { TriggerTypes } from '../../pages/triggers/utils/TriggersWizardPageUtils'
import css from './CICodebaseInputSetForm.module.scss'

export interface CICodebaseInputSetFormProps {
  path: string
  readonly?: boolean
  formik?: FormikContext<any>
}

const CICodebaseInputSetFormInternal = ({ path, readonly, formik }: CICodebaseInputSetFormProps): JSX.Element => {
  const type = get(formik?.values, `${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.type`, '') as
    | 'branch'
    | 'tag'
  const { getString } = useStrings()
  const disableOnWebhookTrigger = formik?.values?.triggerType === TriggerTypes.WEBHOOK
  const radioGroupItems = [
    {
      label: getString('gitBranch'),
      value: 'branch',
      disabled: readonly
    },
    {
      label: getString('gitTag'),
      value: 'tag',
      disabled: readonly
    }
  ]

  const { expressions } = useVariablesExpression()

  const inputLabels = {
    branch: getString('gitBranch'),
    tag: getString('gitTag')
  }

  return (
    <div className={css.container}>
      <FormInput.RadioGroup
        name={`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.type`}
        items={radioGroupItems}
        radioGroup={{ inline: true }}
        disabled={disableOnWebhookTrigger}
        onChange={() => {
          formik?.setFieldValue(`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.spec`, undefined)
        }}
        style={{ marginBottom: 0 }}
      />
      {type && (
        <FormInput.MultiTextInput
          label={inputLabels[type]}
          name={`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.spec.${type}`}
          multiTextInputProps={{
            expressions,
            allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
          }}
          style={{ marginBottom: 0 }}
          disabled={readonly || disableOnWebhookTrigger}
        />
      )}
      {disableOnWebhookTrigger && (
        <Text style={{ marginTop: 'var(--spacing-xsmall)' }} color={Color.GREY_400}>
          {getString('pipeline.triggers.pipelineInputPanel.automaticallyExtractedFromText')}
        </Text>
      )}
    </div>
  )
}

export const CICodebaseInputSetForm = connect(CICodebaseInputSetFormInternal)
