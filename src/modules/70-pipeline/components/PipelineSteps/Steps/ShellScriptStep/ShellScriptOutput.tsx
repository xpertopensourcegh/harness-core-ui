import React from 'react'
import { FieldArray, FormikProps } from 'formik'
import { Button, FormInput, MultiTypeInputType, Text, SelectOption } from '@wings-software/uicore'
import { v4 as uuid } from 'uuid'
import { useStrings } from 'framework/exports'
import type { ShellScriptFormData, ShellScriptOutputStepVariable } from './shellScriptTypes'
import stepCss from '../Steps.module.scss'
import css from './ShellScript.module.scss'

export const scriptOutputType: SelectOption[] = [{ label: 'String', value: 'String' }]

export default function ShellScriptOutput(props: { formik: FormikProps<ShellScriptFormData> }): React.ReactElement {
  const {
    formik: { values: formValues }
  } = props
  const { getString } = useStrings()

  return (
    <>
      <div className={css.stepDesc}>
        <Text className={css.stepValue}>{getString('exportScript')}</Text>
      </div>
      <div className={stepCss.formGroup}>
        <FieldArray
          name="spec.outputVariables"
          render={({ push, remove }) => {
            return (
              <div className={css.panel}>
                <div className={css.outputVarHeader}>
                  <span className={css.label}>Name</span>
                  <span className={css.label}>Type</span>
                  <span className={css.label}>Value</span>
                </div>
                {formValues.spec.outputVariables?.map(({ id }: ShellScriptOutputStepVariable, i: number) => (
                  <div className={css.outputVarHeader} key={id}>
                    <FormInput.Text name={`spec.outputVariables[${i}].name`} />
                    <FormInput.Select
                      items={scriptOutputType}
                      name={`spec.outputVariables[${i}].type`}
                      placeholder={getString('typeLabel')}
                    />
                    <FormInput.MultiTextInput
                      name={`spec.outputVariables[${i}].value`}
                      multiTextInputProps={{
                        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                      }}
                      label=""
                    />
                    <Button minimal icon="cross" onClick={() => remove(i)} />
                  </div>
                ))}
                <Button
                  icon="plus"
                  minimal
                  intent="primary"
                  onClick={() => push({ name: '', type: 'String', value: '', id: uuid() })}
                >
                  {getString('addOutputVar')}
                </Button>
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
