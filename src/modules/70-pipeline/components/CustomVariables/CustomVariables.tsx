import React from 'react'
import {
  Text,
  Formik,
  FormikForm,
  FormInput,
  Button,
  Layout,
  Icon,
  getMultiTypeFromValue,
  MultiTypeInputType,
  MultiTextInput,
  Popover
} from '@wings-software/uikit'
import cx from 'classnames'
import * as yup from 'yup'
import { Dialog, Classes, Position } from '@blueprintjs/core'
import { FieldArray } from 'formik'
import { useParams } from 'react-router-dom'
import isEqual from 'lodash-es/isEqual'
import cloneDeep from 'lodash-es/cloneDeep'
import noop from 'lodash-es/noop'
import SecretReference from '@secrets/components/SecretReference/SecretReference'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import { Scope } from '@common/interfaces/SecretsInterface'
import type { SecretDTOV2, NgPipeline } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { PipelineContext } from '../PipelineStudio/PipelineContext/PipelineContext'
import { getStageFromPipeline, getStageIndexFromPipeline } from '../PipelineStudio/StageBuilder/StageBuilderUtil'
import css from './CustomVariables.module.scss'

export interface Variable {
  name: string
  type: string
  value?: string
}
interface InitialValues {
  variables: Variable[]
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required()
})

const getSecretKey = (secret: SecretDTOV2): string =>
  `${secret.orgIdentifier ? Scope.ORG : secret.projectIdentifier ? Scope.PROJECT : Scope.ACCOUNT}.${
    secret.identifier
  }` || ''

const secretsOptions: Map<string, string> = new Map()
enum VariableTypes {
  // eslint-disable-next-line no-shadow
  Text = 'text',
  Secret = 'secret'
}

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

export const CustomVariables: React.FC = (): JSX.Element => {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipeline
  } = React.useContext(PipelineContext)
  const { stage = {} } = getStageFromPipeline(pipeline, selectedStageId || '')

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { getString } = useStrings()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [state, setState] = React.useState(stage.stage)
  const stateRef = React.useRef(state)
  const openDialog = (): void => setIsDialogOpen(true)

  const closeDialog = React.useCallback(() => {
    setSelectedVariable({
      name: '',
      type: VariableTypes.Text,
      value: ''
    })
    setIsDialogOpen(false)
  }, [setIsDialogOpen])
  const [selectedVariable, setSelectedVariable] = React.useState<Variable>({
    name: '',
    type: VariableTypes.Text,
    value: ''
  })
  const getInitialValues = () => {
    const initialValues: InitialValues = { variables: [] }
    if (stage?.stage?.spec?.variables) {
      initialValues.variables = cloneDeep(stage?.stage?.spec?.variables)
    } else {
      initialValues.variables = []
    }
    return initialValues
  }
  const handleValidate = (values: InitialValues) => {
    const updatedState = cloneDeep(state)
    updatedState.spec.variables = values.variables
    setState(updatedState)
    stateRef.current = updatedState
  }

  React.useEffect(() => {
    return () => {
      const updatedPipeline: NgPipeline = cloneDeep(pipeline) || {}
      const { index: stageIndex } = getStageIndexFromPipeline(pipeline, selectedStageId || '')

      if (updatedPipeline && updatedPipeline?.stages && updatedPipeline?.stages[stageIndex]) {
        updatedPipeline.stages[stageIndex].stage = stateRef.current
      }

      updatePipeline(updatedPipeline)
    }
  }, [])

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={validationSchema}
      validate={handleValidate}
      onSubmit={noop}
    >
      {({ values: formValues, setFieldValue }) => (
        <FormikForm>
          <FieldArray
            name="variables"
            render={({ push, remove }) => (
              <>
                {formValues?.variables?.length > 0 && (
                  <>
                    <div className={css.variablesGrid}>
                      <Text className={css.variableTitle} font={{ size: 'small', weight: 'semi-bold' }}>
                        {getString('pipelineSteps.build.stageSpecifications.variablesCell')}
                        <Icon name="pipeline-variables" margin={{ left: 'small' }} />
                      </Text>
                      <Text className={css.variableTitle} font={{ size: 'small', weight: 'semi-bold' }}>
                        {getString('pipelineSteps.build.stageSpecifications.valueCell')}
                      </Text>
                    </div>
                    <div className={css.box}>
                      {formValues?.variables?.map(({ name, type, value }: Variable, index: number) => (
                        <div className={cx(css.variablesGrid, css.row)} key={name}>
                          <Text color="black">{name}</Text>

                          <div>
                            {type === VariableTypes.Secret && (
                              <div className={css.secretContainer}>
                                {valueToType(value) === MultiTypeInputType.FIXED && (
                                  <div className={css.fixed}>
                                    <Popover position={Position.BOTTOM}>
                                      <div className={css.icon}>
                                        <Icon name="key-main" size={24} height={12} width={24} />{' '}
                                        <Icon name="chevron-down" size={14} />
                                      </div>
                                      <SecretReference
                                        accountIdentifier={accountId}
                                        projectIdentifier={projectIdentifier}
                                        orgIdentifier={orgIdentifier}
                                        onSelect={secret => {
                                          setFieldValue(`variables[${index}].value`, getSecretKey(secret))
                                        }}
                                      />
                                    </Popover>
                                  </div>
                                )}
                                <MultiTextInput
                                  value={secretsOptions.get(value as string) || value}
                                  name={`variables[${index}].value`}
                                  textProps={{
                                    disabled: true
                                  }}
                                  onChange={newValue => {
                                    setFieldValue(`variables[${index}].value`, newValue)
                                  }}
                                />
                              </div>
                            )}

                            {type !== VariableTypes.Secret && (
                              <>
                                <FormInput.MultiTextInput
                                  label=""
                                  name={`variables[${index}].value`}
                                  style={{ flexGrow: 1 }}
                                />
                              </>
                            )}

                            {getMultiTypeFromValue(formValues.variables[index].value) ===
                              MultiTypeInputType.RUNTIME && (
                              <ConfigureOptions
                                value={formValues.variables[index].value as string}
                                type={
                                  <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                    <Text>{name}</Text>
                                  </Layout.Horizontal>
                                }
                                variableName={`variables[${index}].value`}
                                showRequiredField={false}
                                showDefaultField={false}
                                showAdvanced={true}
                                onChange={newValue => setFieldValue(`variables[${index}].value`, newValue)}
                              />
                            )}

                            <Button
                              className={css.editVariable}
                              icon="Edit"
                              minimal
                              onClick={() => {
                                setSelectedVariable({ name, type, value })
                                openDialog()
                              }}
                            />
                            <Button icon="trash" minimal onClick={() => remove(index)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <Button
                  className={css.addVariable}
                  intent="primary"
                  minimal
                  text={getString('pipelineSteps.build.stageSpecifications.addVariable')}
                  onClick={() => openDialog()}
                />
                {isDialogOpen && (
                  <Dialog
                    isOpen={true}
                    title={getString('pipelineSteps.build.stageSpecifications.addCustomVariableDialogTitle')}
                    onClose={closeDialog}
                  >
                    <Formik
                      initialValues={selectedVariable}
                      validationSchema={yup.object().shape({
                        name: yup.string().trim().required(getString('validation.nameRequired')),
                        type: yup.string().trim().required()
                      })}
                      onSubmit={(values: { name: string; type: string }): void => {
                        const index = formValues.variables.findIndex((variable: Variable) =>
                          isEqual(selectedVariable, variable)
                        )

                        if (index === -1) {
                          push({
                            name: values.name,
                            type: values.type,
                            value: ''
                          })
                        } else {
                          setFieldValue(`variables[${index}]`, {
                            name: values.name,
                            type: values.type,
                            value: formValues.variables[index].value
                          })
                        }

                        closeDialog()
                      }}
                    >
                      {({ submitForm }) => (
                        <>
                          <div className={Classes.DIALOG_BODY}>
                            <FormikForm>
                              <FormInput.Text
                                name="name"
                                label={getString('variableNameLabel')}
                                placeholder={getString(
                                  'pipelineSteps.build.stageSpecifications.variableNamePlaceholder'
                                )}
                              />
                              <FormInput.Select
                                name="type"
                                items={[
                                  {
                                    label: getString('pipelineSteps.build.stageSpecifications.textType'),
                                    value: VariableTypes.Text
                                  },
                                  {
                                    label: getString('pipelineSteps.build.stageSpecifications.secretType'),
                                    value: VariableTypes.Secret
                                  }
                                ]}
                                label={getString('typeLabel')}
                                placeholder={getString('typeLabel')}
                              />
                            </FormikForm>
                          </div>
                          <div className={Classes.DIALOG_FOOTER}>
                            <Button
                              intent="primary"
                              text={selectedVariable.name ? getString('save') : getString('add')}
                              onClick={submitForm}
                            />
                            &nbsp; &nbsp;
                            <Button text={getString('cancel')} onClick={closeDialog} />
                          </div>
                        </>
                      )}
                    </Formik>
                  </Dialog>
                )}
              </>
            )}
          />
        </FormikForm>
      )}
    </Formik>
  )
}
