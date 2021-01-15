import React from 'react'
import { Text, Color, Button, FormInput, MultiTypeInputType, getMultiTypeFromValue } from '@wings-software/uicore'
// import { useParams } from 'react-router-dom'
import { Formik, FieldArray } from 'formik'
import { v4 as uuid } from 'uuid'

import { debounce } from 'lodash-es'
import { StepViewType } from '@pipeline/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import MultiTypeSecretInput from '@secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'

import AddEditCustomVariable from './AddEditCustomVariable'
import type { VariableState, Variable } from './AddEditCustomVariable'
import i18n from './CustomVariables.i18n'
import css from './CustomVariables.module.scss'

export interface CustomVariablesData {
  variables: Variable[]
  isPropagating?: boolean
  canAddVariable?: boolean
}

export interface CustomVariableEditableExtraProps {
  variableNamePrefix?: string
  domId?: string
}

export interface CustomVariableEditableProps extends CustomVariableEditableExtraProps {
  initialValues: CustomVariablesData
  onUpdate?: (data: CustomVariablesData) => void
  stepViewType?: StepViewType
}

const VariableTypes = {
  String: 'String',
  Secret: 'Secret',
  Number: 'Number'
}

export function CustomVariableEditable(props: CustomVariableEditableProps): React.ReactElement {
  const { initialValues, onUpdate, stepViewType = StepViewType.Edit, variableNamePrefix = '', domId } = props
  const uids = React.useRef<string[]>([])
  // const [secretsOptions] = React.useState()

  const [selectedVariable, setSelectedVariable] = React.useState<VariableState | null>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = React.useCallback(
    debounce((data: CustomVariablesData) => onUpdate?.(data), 500),
    [onUpdate]
  )

  function addNew(): void {
    setSelectedVariable({
      variable: { name: '', type: 'String', value: '' },
      index: -1
    })
  }

  return (
    <Formik initialValues={initialValues} onSubmit={data => onUpdate?.(data)} validate={debouncedUpdate}>
      {({ values, setFieldValue }) => (
        <FieldArray name="variables">
          {({ remove, push, replace }) => {
            function handleAdd(variable: Variable): void {
              uids.current.push(uuid())
              push(variable)
            }

            function handleUpdate(index: number, variable: Variable): void {
              replace(index, variable)
            }

            function handleRemove(index: number): void {
              uids.current.splice(index, 1)
              remove(index)
            }

            return (
              <div className={css.customVariables} id={domId}>
                <AddEditCustomVariable
                  addNewVariable={handleAdd}
                  updateVariable={handleUpdate}
                  selectedVariable={selectedVariable}
                  setSelectedVariable={setSelectedVariable}
                />
                {values.canAddVariable ? (
                  <div className={css.headerRow}>
                    <Text color={Color.BLACK}>
                      {stepViewType === StepViewType.Edit ? i18n.variables : i18n.customVariables}
                    </Text>
                    <Button minimal intent="primary" icon="plus" text={i18n.addVariable} onClick={addNew} />
                  </div>
                ) : /* istanbul ignore next */ null}
                {stepViewType === StepViewType.StageVariable && values.variables.length > 0 && (
                  <section className={css.subHeader}>
                    <span>{i18n.variablesTableHeaders.name}</span>
                    <span>{i18n.variablesTableHeaders.type}</span>
                    <span>{i18n.variablesTableHeaders.value}</span>
                  </section>
                )}
                {values.variables.map?.((variable, index) => {
                  // generated uuid if they are not present
                  if (!uids.current[index]) {
                    uids.current[index] = uuid()
                  }

                  const key = uids.current[index]

                  return (
                    <div key={key} className={css.variableListTable}>
                      <Text>{`${variableNamePrefix}${variable.name}`}</Text>

                      <Text>{variable.type}</Text>
                      <div className={css.valueRow}>
                        {variable.type === VariableTypes.Secret ? (
                          <MultiTypeSecretInput name={`variables[${index}].value`} label="" />
                        ) : (
                          <FormInput.MultiTextInput
                            className="variableInput"
                            name={`variables[${index}].value`}
                            label=""
                            multiTextInputProps={{
                              textProps: {
                                disabled: !initialValues.canAddVariable,
                                type: variable.type === VariableTypes.Number ? 'number' : 'text'
                              },
                              mentionsInfo: {
                                data: done =>
                                  done([
                                    'app.name',
                                    'app.description',
                                    'pipeline.name',
                                    'pipeline.description',
                                    'pipeline.identifier',
                                    'pipeline.stage.qa.displayName'
                                  ])
                              }
                            }}
                          />
                        )}
                        <div>
                          {getMultiTypeFromValue(variable.value) === MultiTypeInputType.RUNTIME ? (
                            <ConfigureOptions
                              value={variable.value}
                              type={variable.type || /* istanbul ignore next */ 'String'}
                              variableName={variable.name || /* istanbul ignore next */ ''}
                              onChange={value => {
                                setFieldValue(`variables[${index}].value`, value)
                              }}
                            />
                          ) : null}
                          {initialValues.canAddVariable ? (
                            <section className={css.actionButtons}>
                              <Button
                                icon="edit"
                                tooltip={i18n.editVariable}
                                data-testid={`edit-variable-${index}`}
                                onClick={() => {
                                  setSelectedVariable({ variable, index })
                                }}
                              />
                              <Button
                                icon="trash"
                                data-testid={`delete-variable-${index}`}
                                tooltip={i18n.removeThisVariable}
                                onClick={() => handleRemove(index)}
                              />
                            </section>
                          ) : /* istanbul ignore next */ null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }}
        </FieldArray>
      )}
    </Formik>
  )
}
