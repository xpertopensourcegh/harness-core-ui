import React from 'react'
import { get, isEmpty } from 'lodash-es'
import { Card, FormInput } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import i18n from './PipelineInputSetForm.i18n'

export interface CICodebaseInputSetFormProps {
  path: string
  readonly?: boolean
  formik?: FormikContext<any>
}

const CICodebaseInputSetFormInternal = ({ path, readonly, formik }: CICodebaseInputSetFormProps): JSX.Element => {
  const type = get(formik?.values, `${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.type`, '') as
    | 'branch'
    | 'tag'

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
    <Card>
      <FormInput.RadioGroup
        name={`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.type`}
        items={radioGroupItems}
        radioGroup={{ inline: true }}
        onChange={() => {
          formik?.setFieldValue(`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.spec`, undefined)
        }}
        style={{ marginBottom: 0 }}
      />
      {type && (
        <FormInput.Text
          label={inputLabels[type]}
          name={`${isEmpty(path) ? '' : `${path}.`}properties.ci.codebase.build.spec.${type}`}
          disabled={readonly}
          style={{ marginBottom: 0 }}
        />
      )}
    </Card>
  )
}

export const CICodebaseInputSetForm = connect(CICodebaseInputSetFormInternal)
