import React from 'react'
import * as Yup from 'yup'
import { Dialog, Classes } from '@blueprintjs/core'
import { Button, Formik, FormikForm, FormInput } from '@wings-software/uicore'

import type { NGVariable } from 'services/cd-ng'

import i18n from './CustomVariables.i18n'

export interface Variable extends Omit<NGVariable, 'value'> {
  value: string
}

export interface VariableState {
  variable: Variable
  index: number
}

export interface AddEditCustomVariableProps {
  selectedVariable: VariableState | null
  setSelectedVariable(variable: VariableState | null): void
  addNewVariable(variable: Variable): void
  updateVariable(index: number, variable: Variable): void
}

export enum VariableTypes {
  String = 'String',
  Secret = 'Secret',
  Number = 'Number'
}

const typeOptions = [
  { label: 'String', value: VariableTypes.String },
  { label: 'Secret', value: VariableTypes.Secret },
  { label: 'Number', value: VariableTypes.Number }
]

export default function AddEditCustomVariable(props: AddEditCustomVariableProps): React.ReactElement {
  const { selectedVariable, setSelectedVariable, addNewVariable, updateVariable } = props

  function closeModal(): void {
    setSelectedVariable(null)
  }

  return (
    <Dialog isOpen={!!selectedVariable} title={i18n.addVariable} onClose={closeModal}>
      <Formik
        initialValues={selectedVariable?.variable}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validation.name)
        })}
        onSubmit={data => {
          if (data && selectedVariable) {
            if (selectedVariable.index === -1) {
              addNewVariable(data)
            } else {
              updateVariable(selectedVariable.index, data)
            }
            closeModal()
          }
        }}
      >
        {({ submitForm }) => (
          <>
            <div className={Classes.DIALOG_BODY}>
              <FormikForm>
                <FormInput.Text name="name" label={i18n.variableName} placeholder={i18n.variableName} />
                <FormInput.Select name="type" items={typeOptions} label={i18n.type} placeholder={i18n.type} />
              </FormikForm>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <Button intent="primary" text={i18n.save} onClick={submitForm} /> &nbsp; &nbsp;
              <Button text={i18n.cancel} onClick={() => closeModal()} />
            </div>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
