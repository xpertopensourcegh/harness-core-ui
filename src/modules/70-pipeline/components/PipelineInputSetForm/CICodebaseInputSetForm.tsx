import React from 'react'
import { get } from 'lodash-es'
import { FormInput } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import i18n from './PipelineInputSetForm.i18n'

export interface CICodebaseInputSetFormProps {
  path: string
  readonly?: boolean
  formik?: FormikContext<any>
}

const CICodebaseInputSetFormInternal = ({ path, readonly, formik }: CICodebaseInputSetFormProps): JSX.Element => {
  const type = get(formik?.values, `${path}.properties.ci.codebase.build.type`, '') as 'branch' | 'tag'

  const radioGroupItems = [
    {
      label: i18n.gitBranch,
      value: 'branch',
      disabled: readonly
    },
    {
      label: i18n.gitTag,
      value: 'tag',
      disabled: readonly
    }
  ]

  const inputLabels = {
    branch: i18n.gitBranch,
    tag: i18n.gitTag
  }

  return (
    <>
      <FormInput.RadioGroup
        name={`${path}.properties.ci.codebase.build.type`}
        items={radioGroupItems}
        radioGroup={{ inline: true }}
        onChange={() => {
          formik?.setFieldValue(`${path}.properties.ci.codebase.build.spec`, undefined)
        }}
      />
      {type && (
        <FormInput.Text
          label={inputLabels[type]}
          name={`${path}.properties.ci.codebase.build.spec.${type}`}
          disabled={readonly}
        />
      )}
    </>
  )
}

export const CICodebaseInputSetForm = connect(CICodebaseInputSetFormInternal)
