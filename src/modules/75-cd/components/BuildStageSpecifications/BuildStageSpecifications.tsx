import React from 'react'
import * as yup from 'yup'
import {
  Layout,
  Button,
  Formik,
  FormikForm,
  FormInput,
  MultiTextInput,
  Switch,
  Icon,
  Text,
  Popover,
  getMultiTypeFromValue,
  MultiTypeInputType
} from '@wings-software/uicore'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import { Dialog, Classes, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { FieldArray } from 'formik'
import { isEqual } from 'lodash-es'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { SecretDTOV2, listSecretsV2Promise } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'
import { loggerFor, ModuleName } from 'framework/exports'
import SecretReference from '@secrets/components/SecretReference/SecretReference'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import css from './BuildStageSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const validationSchema = yup.object().shape({
  name: yup.string().trim().required()
})

export interface Variable {
  name: string
  type: string
  value?: string
}

enum VariableTypes {
  // eslint-disable-next-line no-shadow
  Text = 'text',
  Secret = 'secret'
}

const secretsOptions: Map<string, string> = new Map()

export const getSecretKey = (secret: SecretDTOV2): string =>
  `${secret.orgIdentifier ? Scope.ORG : secret.projectIdentifier ? Scope.PROJECT : Scope.ACCOUNT}.${
    secret.identifier
  }` || ''

export default function BuildStageSpecifications(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)
  const [selectedVariable, setSelectedVariable] = React.useState<Variable>({
    name: '',
    type: VariableTypes.Text,
    value: ''
  })

  const [secrets, setSecrets] = React.useState<SecretDTOV2[]>()
  const [lastFetchedSecrets, setLastFetchedSecrets] = React.useState<number>(0)

  const { getString } = useStrings()

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

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

  const getInitialValues = (): {
    identifier: string
    name: string
    description: string
    tags: null | string[]
    cloneCodebase: boolean
    sharedPaths: string[]
    customVariables: { name: string; type: string; value?: string }[]
  } => {
    const pipelineData = stage?.stage || null
    const spec = stage?.stage?.spec || null

    const identifier = pipelineData?.identifier || ''
    const name = pipelineData?.name || ''
    const description = pipelineData?.description || ''
    const cloneCodebase = spec?.cloneCodebase || true
    const sharedPaths =
      typeof spec?.sharedPaths === 'string'
        ? spec?.sharedPaths
        : spec?.sharedPaths?.map((_value: string) => ({
            id: uuid('', nameSpace()),
            value: _value
          })) || []
    const customVariables = spec?.customVariables || []

    // Adding a default value
    if (Array.isArray(sharedPaths) && sharedPaths.length === 0) {
      sharedPaths.push({ id: uuid('', nameSpace()), value: '' })
    }

    return { identifier, name, description, tags: null, cloneCodebase, sharedPaths, customVariables }
  }

  const handleValidate = (values: any): void => {
    if (stage) {
      const pipelineData = stage.stage
      const spec = stage.stage.spec

      pipelineData.identifier = values.identifier
      pipelineData.name = values.name

      if (values.description) {
        pipelineData.description = values.description
      } else {
        delete pipelineData.description
      }

      // if (values.tags) {
      //   pipelineData.tags = values.tags
      // } else {
      //   delete pipelineData.tags
      // }

      spec.cloneCodebase = values.cloneCodebase

      if (values.sharedPaths && values.sharedPaths.length > 0) {
        spec.sharedPaths =
          typeof values.sharedPaths === 'string'
            ? values.sharedPaths
            : values.sharedPaths
                ?.filter((listValue: { id: string; value: string }) => !!listValue.value)
                .map((listValue: { id: string; value: string }) => listValue.value)
      } else {
        delete spec.sharedPaths
      }

      if (values.customVariables && values.customVariables.length > 0) {
        spec.customVariables = values.customVariables
      } else {
        delete spec.customVariables
      }

      updatePipeline(pipeline)
    }
  }

  const openDialog = (): void => setIsDialogOpen(true)

  const closeDialog = React.useCallback(() => {
    setSelectedVariable({
      name: '',
      type: VariableTypes.Text,
      value: ''
    })
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  React.useEffect(() => {
    const fetchSecrets = async (): Promise<void> => {
      // Fetch only if the data is older then 60 Seconds
      if (lastFetchedSecrets + 60000 < new Date().getTime()) {
        setLastFetchedSecrets(new Date().getTime())
        const listOfSecrets = await listSecretsV2Promise({
          queryParams: { accountIdentifier: accountId }
        }).then(response => response?.data?.content?.map(secretResponse => secretResponse.secret))
        setSecrets(listOfSecrets)
      }
    }
    fetchSecrets()
  })

  secrets?.forEach(secret => {
    const key = getSecretKey(secret)
    if (key) {
      secretsOptions.set(key, secret.name || '')
    }
  })
  return (
    <Layout.Vertical>
      <Layout.Vertical spacing="large" style={{ alignItems: 'center' }}>
        <Layout.Vertical width="100%" spacing="large">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            validate={handleValidate}
            onSubmit={values => logger.info(JSON.stringify(values))}
          >
            {({ values: formValues, setFieldValue }) => (
              <>
                <div className={cx(css.section, css.noPadTop)}>
                  <Layout.Vertical flex={true} className={css.specTabs}>
                    <Text font={{ size: 'medium', weight: 'semi-bold' }}>{getString('stageDetails')}</Text>
                  </Layout.Vertical>
                  <FormikForm>
                    <Layout.Horizontal spacing="medium">
                      <FormInput.InputWithIdentifier
                        inputName="name"
                        inputLabel={getString('stageNameLabel')}
                        inputGroupProps={{
                          className: css.fields,
                          placeholder: getString('pipelineSteps.build.stageSpecifications.stageNamePlaceholder')
                        }}
                      />
                      <div className={css.addDataLinks}>
                        {!isDescriptionVisible && !formValues.description && (
                          <Button
                            minimal
                            text={getString('pipelineSteps.build.stageSpecifications.addDescription')}
                            icon="plus"
                            onClick={() => setDescriptionVisible(true)}
                          />
                        )}
                        {!isTagsVisible && !formValues.tags && (
                          <Button
                            minimal
                            text={getString('pipelineSteps.build.stageSpecifications.addTags')}
                            icon="plus"
                            onClick={() => setTagsVisible(true)}
                          />
                        )}
                      </div>
                    </Layout.Horizontal>

                    {(isDescriptionVisible || formValues.description) && (
                      <div className={css.fields}>
                        <span
                          onClick={() => {
                            setDescriptionVisible(false)
                            setFieldValue('description', '')
                          }}
                          className={css.removeLink}
                        >
                          {getString('removeLabel')}
                        </span>
                        <FormInput.TextArea name={'description'} label={getString('description')} />
                      </div>
                    )}

                    {(isTagsVisible || formValues.tags) && (
                      <div className={css.fields}>
                        <span
                          onClick={() => {
                            setTagsVisible(false)
                            setFieldValue('tags', '')
                          }}
                          className={css.removeLink}
                        >
                          {getString('removeLabel')}
                        </span>
                        <FormInput.TagInput
                          name="tags"
                          label={getString('tagsLabel')}
                          items={[]}
                          labelFor={name => name as string}
                          itemFromNewTag={newTag => newTag}
                          tagInputProps={{
                            noInputBorder: true,
                            openOnKeyDown: false,
                            showAddTagButton: true,
                            showClearAllButton: true,
                            allowNewTag: true,
                            getTagProps: (value, _index, _selectedItems, createdItems) => {
                              return createdItems.includes(value)
                                ? { intent: 'danger', minimal: true }
                                : { intent: 'none', minimal: true }
                            }
                          }}
                        />
                      </div>
                    )}

                    <Switch
                      checked={formValues.cloneCodebase}
                      label={getString('cloneCodebaseLabel')}
                      onChange={e => setFieldValue('cloneCodebase', e.currentTarget.checked)}
                    />
                  </FormikForm>
                </div>

                <div className={css.section}>
                  <Layout.Vertical flex={true} className={css.specTabs}>
                    <Text font={{ size: 'medium', weight: 'semi-bold' }}>
                      {getString('pipelineSteps.build.stageSpecifications.sharedPaths')}
                    </Text>
                  </Layout.Vertical>
                  <FormikForm className={css.fields}>
                    <MultiTypeList
                      name="sharedPaths"
                      multiTypeFieldSelectorProps={{
                        label: (
                          <Text margin={{ bottom: 'xsmall' }}>
                            {getString('pipelineSteps.build.stageSpecifications.sharedPaths')}
                          </Text>
                        )
                      }}
                    />
                  </FormikForm>
                </div>
                <div className={css.section}>
                  <Layout.Vertical flex={true} className={css.specTabs}>
                    <Text font={{ size: 'medium', weight: 'semi-bold' }}>
                      {getString('pipelineSteps.build.stageSpecifications.variablesDetails')}
                    </Text>
                  </Layout.Vertical>
                  <FormikForm>
                    <FieldArray
                      name="customVariables"
                      render={({ push, remove }) => (
                        <>
                          {formValues.customVariables.length > 0 && (
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
                                {formValues.customVariables.map(({ name, type, value }, index) => (
                                  <div className={cx(css.variablesGrid, css.row)} key={name}>
                                    <Text color="black">{name}</Text>

                                    <div>
                                      {type === VariableTypes.Secret && (
                                        <div className={css.secretContainer}>
                                          {getMultiTypeFromValue(value) === MultiTypeInputType.FIXED && (
                                            <div className={css.fixed}>
                                              <Popover position={Position.BOTTOM}>
                                                <div className={css.icon}>
                                                  <Icon name="key-main" size={24} height={12} width={24} />{' '}
                                                  <Icon name="chevron-down" size={14} />
                                                </div>
                                                <SecretReference
                                                  type="SecretText"
                                                  accountIdentifier={accountId}
                                                  projectIdentifier={projectIdentifier}
                                                  orgIdentifier={orgIdentifier}
                                                  onSelect={secret => {
                                                    setFieldValue(
                                                      `customVariables[${index}].value`,
                                                      getSecretKey(secret)
                                                    )
                                                  }}
                                                />
                                              </Popover>
                                            </div>
                                          )}
                                          <MultiTextInput
                                            value={secretsOptions.get(value as string) || value}
                                            name={`customVariables[${index}].value`}
                                            textProps={{
                                              disabled: true
                                            }}
                                            onChange={newValue => {
                                              setFieldValue(`customVariables[${index}].value`, newValue)
                                            }}
                                          />
                                        </div>
                                      )}

                                      {type !== VariableTypes.Secret && (
                                        <>
                                          <FormInput.MultiTextInput
                                            label=""
                                            name={`customVariables[${index}].value`}
                                            style={{ flexGrow: 1 }}
                                          />
                                        </>
                                      )}

                                      {getMultiTypeFromValue(formValues.customVariables[index].value) ===
                                        MultiTypeInputType.RUNTIME && (
                                        <ConfigureOptions
                                          value={formValues.customVariables[index].value as string}
                                          type={
                                            <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                              <Text>{name}</Text>
                                            </Layout.Horizontal>
                                          }
                                          variableName={`customVariables[${index}].value`}
                                          showRequiredField={false}
                                          showDefaultField={false}
                                          showAdvanced={true}
                                          onChange={newValue =>
                                            setFieldValue(`customVariables[${index}].value`, newValue)
                                          }
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
                                  name: yup.string().trim().required(),
                                  type: yup.string().trim().required()
                                })}
                                onSubmit={(values: { name: string; type: string }): void => {
                                  const index = formValues.customVariables.findIndex(variable =>
                                    isEqual(selectedVariable, variable)
                                  )

                                  if (index === -1) {
                                    push({
                                      name: values.name,
                                      type: values.type,
                                      value: ''
                                    })
                                  } else {
                                    setFieldValue(`customVariables[${index}]`, {
                                      name: values.name,
                                      type: values.type,
                                      value: formValues.customVariables[index].value
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
                                          placeholder={getString('name')}
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
                                      />{' '}
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
                </div>
              </>
            )}
          </Formik>
        </Layout.Vertical>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
