import React from 'react'
import {
  IconName,
  Text,
  Color,
  Button,
  useModalHook,
  Formik,
  FormikForm,
  FormInput,
  MultiTextInput,
  ButtonGroup
} from '@wings-software/uikit'
import { cloneDeep } from 'lodash'
import { Dialog, Classes } from '@blueprintjs/core'
import * as Yup from 'yup'
import type { Variable } from 'services/cd-ng'
import { Step, StepViewType, ConfigureOptions } from 'modules/common/exports'
import i18n from './CustomVariables.i18n'
import { StepType } from '../../PipelineStepInterface'
import css from './CustomVariables.module.scss'

type VariableList = { variables: Variable[] }

interface CustomVariableEditableProps {
  initialValues: VariableList
  onUpdate?: (data: VariableList) => void
  stepViewType?: StepViewType
}

const VariableTypes = {
  String: 'String',
  Secret: 'Secret',
  Number: 'Number'
}

const getDefaultVariable = (): Variable => ({ name: '', type: VariableTypes.String, value: '' })

const CustomVariableEditable: React.FC<CustomVariableEditableProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const [selectedVariable, setSelectedVariable] = React.useState<Variable>(getDefaultVariable())
  const [inputVariables, setInputVariables] = React.useState<Variable[]>(initialValues.variables)

  React.useEffect(() => {
    setInputVariables(initialValues.variables)
  }, [initialValues.variables])

  const [showModal, hideModal] = useModalHook(() => {
    return (
      <Dialog isOpen={true} title={i18n.addVariable} onClose={() => closeModal()}>
        <Formik
          initialValues={selectedVariable}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(i18n.validation.name)
          })}
          onSubmit={data => {
            const index = inputVariables.indexOf(selectedVariable)
            if (index === -1) {
              inputVariables.push(data)
            } else {
              inputVariables.splice(index, 1, data)
            }
            setInputVariables(cloneDeep(inputVariables))
            onUpdate?.({ variables: inputVariables })
            closeModal()
          }}
        >
          {({ submitForm }) => (
            <>
              <div className={Classes.DIALOG_BODY}>
                <FormikForm>
                  <FormInput.Text name="name" label={i18n.variableName} placeholder={i18n.variableName} />
                  <FormInput.Select
                    name="type"
                    items={[
                      { label: 'String', value: VariableTypes.String },
                      { label: 'Secret', value: VariableTypes.Secret },
                      { label: 'Number', value: VariableTypes.Number }
                    ]}
                    label={i18n.type}
                    placeholder={i18n.type}
                  />
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
  }, [initialValues, onUpdate, selectedVariable])

  const closeModal = React.useCallback(() => {
    setSelectedVariable(getDefaultVariable())
    hideModal()
  }, [hideModal])

  return (
    <div className={css.customVariables}>
      <div className={css.headerRow}>
        <Text color={Color.BLACK}>{i18n.customVariables}</Text>
        <Button minimal intent="primary" icon="plus" text={i18n.addVariable} onClick={showModal} />
      </div>
      {inputVariables.map?.((variable, index) => (
        <div key={variable.name} className={css.variableListTable}>
          <Text style={{ paddingTop: 'var(--spacing-large)' }}>{`$pipeline.${variable.name}`}</Text>
          <Text>{variable.type}</Text>
          <div className={css.valueRow}>
            <MultiTextInput
              width={270}
              value={variable.value}
              mentionsInfo={{
                data: done =>
                  done([
                    'app.name',
                    'app.description',
                    'pipeline.name',
                    'pipeline.description',
                    'pipeline.identifier',
                    'pipeline.stage.qa.displayName'
                  ])
              }}
              onChange={value => {
                inputVariables[index].value = value as string
                setInputVariables(cloneDeep(inputVariables))
                onUpdate?.({ variables: inputVariables })
              }}
            />
            <div>
              {variable.value?.startsWith?.('{input}') && (
                <ConfigureOptions
                  value={variable.value}
                  type={variable.type}
                  variableName={variable.name}
                  onChange={value => {
                    inputVariables[index].value = value
                    setInputVariables(cloneDeep(inputVariables))
                    onUpdate?.({ variables: inputVariables })
                  }}
                />
              )}
              <ButtonGroup>
                <Button
                  icon="edit"
                  tooltip={i18n.editVariable}
                  onClick={() => {
                    setSelectedVariable(variable)
                    showModal()
                  }}
                />
                <Button icon="trash" intent="danger" tooltip={i18n.removeThisVariable} />
              </ButtonGroup>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export class CustomVariables extends Step<VariableList> {
  renderStep(
    initialValues: VariableList,
    onUpdate?: (data: VariableList) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <CustomVariableEditable initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.CustomVariable
  protected stepName = i18n.customVariables
  protected stepIcon: IconName = 'variable'
  protected stepPaletteVisible = false

  protected defaultValues: VariableList = { variables: [] }
}
