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
  Icon,
  Popover,
  MultiTypeInputType,
  getMultiTypeFromValue
} from '@wings-software/uikit'
import { cloneDeep, get } from 'lodash-es'
import { Dialog, Classes, Position } from '@blueprintjs/core'
import * as Yup from 'yup'
import { parse } from 'yaml'
import { CompletionItemKind } from 'vscode-languageserver-types'
import { useParams } from 'react-router-dom'
import { loggerFor, ModuleName } from 'framework/exports'
import { NGVariable, SecretDTOV2, listSecretsV2Promise } from 'services/cd-ng'
import { Step, StepViewType, ConfigureOptions } from '@pipeline/exports'
import type { CompletionItemInterface } from '@common/interfaces/YAMLBuilderProps'
import SecretReference from '@secrets/components/SecretReference/SecretReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import i18n from './CustomVariables.i18n'
import { StepType } from '../../PipelineStepInterface'
import css from './CustomVariables.module.scss'

const logger = loggerFor(ModuleName.CD)
export interface Variable extends NGVariable {
  value: string
}

type VariableList = { variables: Variable[] }

const RUNTIME_INPUT_VALUE = '{input}'
const isValueAnExpression = (value: string): boolean => /^\${.*}$/.test(value)

const valueToType = (value: string | undefined = '', allowableTypes?: MultiTypeInputType[]): MultiTypeInputType => {
  if (typeof value === 'string') {
    value = value.toLocaleLowerCase().trim()
    if (value.startsWith(RUNTIME_INPUT_VALUE)) return MultiTypeInputType.RUNTIME
    if (isValueAnExpression(value)) return MultiTypeInputType.EXPRESSION
  }
  if (!value && allowableTypes?.length) {
    return allowableTypes[0]
  }
  return MultiTypeInputType.FIXED
}

interface CustomVariableEditableProps {
  initialValues: VariableList
  secrets: SecretDTOV2[] | undefined
  onUpdate?: (data: VariableList) => void
  stepViewType?: StepViewType
}

const VariableTypes = {
  String: 'String',
  Secret: 'Secret',
  Number: 'Number'
}

const getSecretKey = (secret: SecretDTOV2): string =>
  `${secret.orgIdentifier ? Scope.ORG : secret.projectIdentifier ? Scope.PROJECT : Scope.ACCOUNT}.${
    secret.identifier
  }` || ''

const getDefaultVariable = (): Variable => ({ name: '', type: 'String', value: '' })

const secretsOptions: Map<string, string> = new Map()

const CustomVariableEditable: React.FC<CustomVariableEditableProps> = ({
  initialValues,
  onUpdate,
  secrets,
  stepViewType = StepViewType.Edit
}): JSX.Element => {
  const [selectedVariable, setSelectedVariable] = React.useState<Variable>(getDefaultVariable())
  const [inputVariables, setInputVariables] = React.useState<Variable[]>(initialValues.variables)
  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
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

  secrets?.forEach(secret => {
    const key = getSecretKey(secret)
    if (key) {
      secretsOptions.set(key, secret.name || '')
    }
  })
  return (
    <div className={css.customVariables}>
      <div className={css.headerRow}>
        <Text color={Color.BLACK}>{stepViewType === StepViewType.Edit ? i18n.variables : i18n.customVariables}</Text>
        <Button minimal intent="primary" icon="plus" text={i18n.addVariable} onClick={showModal} />
      </div>
      {stepViewType === StepViewType.StageVariable && inputVariables.length > 0 && (
        <section className={css.subHeader}>
          <span>{i18n.variablesTableHeaders.name}</span>
          <span>{i18n.variablesTableHeaders.type}</span>
          <span>{i18n.variablesTableHeaders.value}</span>
        </section>
      )}
      {inputVariables.map?.((variable, index) => (
        <div key={variable.name} className={css.variableListTable}>
          <Text>{stepViewType === StepViewType.StageVariable ? variable.name : `$pipeline.${variable.name}`}</Text>

          <Text>{variable.type}</Text>
          <div className={css.valueRow}>
            {variable.type === VariableTypes.Secret && (
              <div className={css.secretContainer}>
                {valueToType(variable.value) === MultiTypeInputType.FIXED && (
                  <div className={css.fixed}>
                    <Popover position={Position.BOTTOM}>
                      <div className={css.icon}>
                        <Icon name="key-main" size={24} height={12} width={24} /> <Icon name="chevron-down" size={14} />
                      </div>
                      <SecretReference
                        accountIdentifier={accountId}
                        projectIdentifier={projectIdentifier}
                        orgIdentifier={orgIdentifier}
                        onSelect={secret => {
                          inputVariables[index].value = getSecretKey(secret)
                          setInputVariables(cloneDeep(inputVariables))
                          onUpdate?.({ variables: inputVariables })
                        }}
                      />
                    </Popover>
                  </div>
                )}
                <MultiTextInput
                  width={270}
                  textProps={{ disabled: true, value: secretsOptions.get(variable.value) || variable.value }}
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
              </div>
            )}
            {variable.type !== VariableTypes.Secret && (
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
            )}
            <div>
              {getMultiTypeFromValue(variable.value) === MultiTypeInputType.RUNTIME && (
                <ConfigureOptions
                  value={variable.value}
                  type={variable.type || 'String'}
                  variableName={variable.name || ''}
                  onChange={value => {
                    inputVariables[index].value = value
                    setInputVariables(cloneDeep(inputVariables))
                    onUpdate?.({ variables: inputVariables })
                  }}
                />
              )}
              <section className={css.actionButtons}>
                <Button
                  icon="edit"
                  tooltip={i18n.editVariable}
                  onClick={() => {
                    setSelectedVariable(variable)
                    showModal()
                  }}
                />
                <Button
                  icon="trash"
                  tooltip={i18n.removeThisVariable}
                  onClick={() => {
                    inputVariables.splice(index, 1)
                    onUpdate?.({ variables: inputVariables })
                  }}
                />
              </section>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export class CustomVariables extends Step<VariableList> {
  lastFetched: number
  secrets: SecretDTOV2[] | undefined
  protected invocationMap: Map<RegExp, (path: string, yaml: string) => Promise<CompletionItemInterface[]>> = new Map()

  constructor() {
    super()
    this.lastFetched = new Date().getTime()
    this.invocationMap.set(/^.+\.variables.+\.value$/, this.getSecretValueForYaml.bind(this))
  }

  protected getSecretValueForYaml(path: string, yaml: string): Promise<CompletionItemInterface[]> {
    let pipelineObj
    try {
      pipelineObj = parse(yaml)
    } catch (err) {
      logger.error('Error while parsing the yaml', err)
    }

    if (pipelineObj) {
      const obj = get(pipelineObj, path.replace('.value', ''))
      if (obj.type === 'Secret') {
        return this.getSecrets().then(
          secrets =>
            secrets?.map(secret => ({
              label: secret.name || '',
              insertText: getSecretKey(secret),
              kind: CompletionItemKind.Field
            })) || []
        )
      }
    }

    return new Promise(resolve => {
      resolve([])
    })
  }

  protected async getSecrets(): Promise<SecretDTOV2[] | undefined> {
    // TODO: Class based component can't use useRouteParams() hook to get accountId
    // Get it from localStorage for now
    const accountId = localStorage.acctId

    // Fetch only if the data is older then 60 Seconds
    if (this.lastFetched + 60000 < new Date().getTime() || !this.secrets) {
      this.lastFetched = new Date().getTime()
      this.secrets = await listSecretsV2Promise({ queryParams: { accountIdentifier: accountId } }).then(response =>
        response?.data?.content?.map(secretResponse => secretResponse.secret)
      )
    }

    return this.secrets
  }

  renderStep(
    initialValues: VariableList,
    onUpdate?: (data: VariableList) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    this.getSecrets()
    return (
      <CustomVariableEditable
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        secrets={this.secrets}
      />
    )
  }

  protected type = StepType.CustomVariable
  protected stepName = i18n.customVariables
  protected stepIcon: IconName = 'variable'
  protected stepPaletteVisible = false

  protected defaultValues: VariableList = { variables: [] }
}
