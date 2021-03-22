import React from 'react'
import { get, isEmpty } from 'lodash-es'
import { Card, FormInput } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { useStrings } from 'framework/exports'

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

  const inputLabels = {
    branch: getString('gitBranch'),
    tag: getString('gitTag')
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
