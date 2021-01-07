import React from 'react'
import { FieldArray } from 'formik'
import type { FormikProps } from 'formik'
import { Button, FormInput, MultiTypeInputType, SelectOption } from '@wings-software/uicore'
import { v4 as uuid } from 'uuid'
import type { ShellScriptStepInfo } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import type { ShellScriptStepVariable } from './shellScriptTypes'
import stepCss from '../Steps.module.scss'
import css from './ShellScript.module.scss'

export const scriptInputType: SelectOption[] = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' }
]

export default function ShellScriptInput(props: { formik: FormikProps<ShellScriptStepInfo> }): React.ReactElement {
  const {
    formik: { values: formValues }
  } = props
  const { getString } = useStrings()
  return (
    <div className={stepCss.formGroup}>
      <FieldArray
        name="spec.environmentVariables"
        render={({ push, remove }) => {
          return (
            <div className={css.panel}>
              <div className={css.environmentVarHeader}>
                <span className={css.label}>Name</span>
                <span className={css.label}>Type</span>
                <span className={css.label}>Value</span>
              </div>
              {formValues.spec.environmentVariables.map(({ id }: ShellScriptStepVariable, i: number) => (
                <div className={css.environmentVarHeader} key={id}>
                  <FormInput.Text name={`spec.environmentVariables[${i}].name`} />
                  <FormInput.Select
                    items={scriptInputType}
                    name={`spec.environmentVariables[${i}].type`}
                    placeholder={getString('typeLabel')}
                  />
                  <FormInput.MultiTextInput
                    name={`spec.environmentVariables[${i}].value`}
                    multiTextInputProps={{
                      allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                    }}
                    label=""
                  />
                  <Button minimal icon="cross" data-testid={`remove-environmentVar-${i}`} onClick={() => remove(i)} />
                </div>
              ))}
              <Button
                icon="plus"
                minimal
                intent="primary"
                data-testid="add-environmentVar"
                onClick={() => push({ name: '', type: 'String', value: '', id: uuid() })}
              >
                Add Input Variable
              </Button>
            </div>
          )
        }}
      />
    </div>
  )
}
