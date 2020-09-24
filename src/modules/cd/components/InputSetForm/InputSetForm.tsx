import React from 'react'
import cx from 'classnames'
import { Classes, Dialog, IDialogProps } from '@blueprintjs/core'
import * as Yup from 'yup'
import {
  Button,
  Collapse,
  Color,
  Formik,
  FormikForm,
  FormInput,
  Icon,
  IconName,
  Layout,
  SelectOption,
  Text
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { parse, stringify } from 'yaml'
import { FieldArray, FieldArrayRenderProps } from 'formik'
import {
  CDPipeline,
  FailureDTO,
  InputSetResponseDTO,
  OverlayInputSetResponseDTO,
  useCreateInputSetForPipeline,
  useGetInputSetForPipeline,
  useGetOverlayInputSetForPipeline,
  useGetPipeline,
  useGetTemplateFromPipeline,
  useUpdateInputSetForPipeline,
  useCreateOverlayInputSetForPipeline,
  useUpdateOverlayInputSetForPipeline,
  useGetInputSetsListForPipeline
} from 'services/cd-ng'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { useToaster } from 'modules/common/exports'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import i18n from './InputSetForm.18n'
import { PipelineInputSetForm } from '../PipelineInputSetForm/PipelineInputSetForm'
import css from './InputSetForm.module.scss'

export enum InputFormType {
  InputForm = 'InputForm',
  OverlayInputForm = 'OverlayInputForm'
}

interface InputSetDTO
  extends Omit<InputSetResponseDTO, 'inputSetYaml'>,
    Omit<OverlayInputSetResponseDTO, 'overlayInputSetYaml'> {
  pipeline?: CDPipeline
}

const getDefaultInputSet = (template?: CDPipeline): InputSetDTO => ({
  name: '',
  identifier: '',
  description: '',
  pipeline: template,
  inputSetReferences: []
})

export interface InputSetFormProps {
  formType: InputFormType
  hideForm: () => void
  identifier?: string
}

enum SelectedView {
  VISUAL = 'VISUAL',
  YAML = 'YAML'
}

const dialogProps: Omit<IDialogProps, 'isOpen'> = {
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  style: { minWidth: 700, minHeight: 600 }
}

const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
  fileName: `input-set.yaml`,
  entityType: YamlEntity.INPUT_SET,
  width: 620,
  height: 360,
  showSnippetSection: false
}

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

const getTitle = (isEdit: boolean, formType: InputFormType, inputSet: InputSetDTO): string => {
  if (isEdit) {
    return formType === InputFormType.OverlayInputForm
      ? i18n.editOverlayTitle(inputSet.name || '')
      : i18n.editTitle(inputSet.name || '')
  } else {
    return formType === InputFormType.OverlayInputForm ? i18n.newOverlayInputSet : i18n.newInputSet
  }
}
const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export const InputSetForm: React.FC<InputSetFormProps> = ({ hideForm, identifier, formType }): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isEdit, setIsEdit] = React.useState(false)
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()

  const {
    refetch: refetchTemplate,
    data: template,
    loading: loadingTemplate,
    error: errorTemplate
  } = useGetTemplateFromPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    lazy: true
  })

  const [selectedView, setSelectedView] = React.useState<SelectedView>(SelectedView.VISUAL)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { showSuccess, showError } = useToaster()

  const { data: inputSetResponse, refetch, loading: loadingInputSet, error: errorInputSet } = useGetInputSetForPipeline(
    {
      queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
      inputSetIdentifier: identifier || '',
      lazy: true
    }
  )

  const {
    data: overlayInputSetResponse,
    refetch: refetchOverlay,
    loading: loadingOverlayInputSet,
    error: errorOverlayInputSet
  } = useGetOverlayInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    inputSetIdentifier: identifier || '',
    lazy: true
  })

  const {
    mutate: createInputSet,
    error: createInputSetError,
    loading: createInputSetLoading
  } = useCreateInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'text/yaml' } }
  })
  const {
    mutate: updateInputSet,
    error: updateInputSetError,
    loading: updateInputSetLoading
  } = useUpdateInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    inputSetIdentifier: '',
    requestOptions: { headers: { 'content-type': 'text/yaml' } }
  })

  const {
    mutate: createOverlayInputSet,
    error: createOverlayInputSetError,
    loading: createOverlayInputSetLoading
  } = useCreateOverlayInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'text/yaml' } }
  })
  const {
    mutate: updateOverlayInputSet,
    error: updateOverlayInputSetError,
    loading: updateOverlayInputSetLoading
  } = useUpdateOverlayInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    inputSetIdentifier: '',
    requestOptions: { headers: { 'content-type': 'text/yaml' } }
  })

  const {
    data: inputSetList,
    refetch: refetchInputSetList,
    loading: loadingInputSetList,
    error: errorInputSetList
  } = useGetInputSetsListForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier, pipelineIdentifier },
    debounce: 300,
    lazy: true
  })

  const { data: pipeline, loading: loadingPipeline, error: errorPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const inputSet = React.useMemo(() => {
    if (inputSetResponse?.data && formType === InputFormType.InputForm) {
      const inputSetObj = inputSetResponse?.data
      const inputYamlObj = parse(inputSetObj.inputSetYaml || '')
      return {
        name: inputSetObj.name,
        identifier: inputSetObj.identifier,
        description: inputSetObj?.description,
        pipeline: inputYamlObj?.inputSet?.pipeline
      }
    } else if (overlayInputSetResponse?.data && formType === InputFormType.OverlayInputForm) {
      const inputSetObj = overlayInputSetResponse?.data
      return {
        name: inputSetObj.name,
        identifier: inputSetObj.identifier,
        description: inputSetObj?.description,
        inputSetReferences: inputSetObj?.inputSetReferences || []
      }
    }
    return getDefaultInputSet(parse(template?.data?.inputSetTemplateYaml || '')?.pipeline as any)
  }, [inputSetResponse?.data, template?.data?.inputSetTemplateYaml, formType, overlayInputSetResponse?.data])

  const inputSetListOptions: SelectOption[] = React.useMemo(() => {
    return inputSetList?.data?.content?.map(item => ({ label: item.name || '', value: item.identifier || '' })) || []
  }, [inputSetList?.data?.content?.map])

  React.useEffect(() => {
    if (identifier) {
      setIsEdit(true)
      if (formType === InputFormType.InputForm) {
        refetch({ pathParams: { inputSetIdentifier: identifier } })
        refetchTemplate()
      } else {
        refetchInputSetList()
        refetchOverlay({ pathParams: { inputSetIdentifier: identifier } })
      }
    } else {
      if (formType === InputFormType.InputForm) {
        refetchTemplate()
      } else {
        refetchInputSetList()
      }
      setIsEdit(false)
    }
  }, [identifier, formType])

  const handleModeSwitch = React.useCallback(
    (view: SelectedView) => {
      if (view === SelectedView.VISUAL) {
        const yaml = yamlHandler?.getLatestYaml() || ''
        const inputSetYamlVisual = parse(yaml).inputSet as InputSetDTO
        inputSet.name = inputSetYamlVisual.name
        inputSet.identifier = inputSetYamlVisual.identifier
        inputSet.description = inputSetYamlVisual.description
        inputSet.pipeline = inputSetYamlVisual.pipeline
      }
      setSelectedView(view)
    },
    [yamlHandler?.getLatestYaml, inputSet]
  )

  const closeForm = React.useCallback(() => {
    setIsOpen(false)
    hideForm()
  }, [hideForm])

  const handleSubmit = React.useCallback(
    async (inputSetObj: InputSetDTO) => {
      if (inputSetObj && formType === InputFormType.InputForm) {
        try {
          if (isEdit) {
            await updateInputSet(stringify({ inputSet: inputSetObj }), {
              pathParams: { inputSetIdentifier: inputSetObj.identifier || '' }
            })
          } else {
            await createInputSet(stringify({ inputSet: inputSetObj }))
          }
          showSuccess(i18n.inputSetSaved)
          closeForm()
        } catch (e) {
          showError(e?.message || i18n.commonError)
        }
      } else if (inputSetObj && formType === InputFormType.OverlayInputForm) {
        delete inputSetObj.pipeline
        try {
          if (isEdit) {
            await updateOverlayInputSet(stringify({ overlayInputSet: inputSetObj }), {
              pathParams: { inputSetIdentifier: inputSetObj.identifier || '' }
            })
          } else {
            await createOverlayInputSet(stringify({ overlayInputSet: inputSetObj }))
          }
          showSuccess(i18n.overlayInputSetSaved)
          closeForm()
        } catch (e) {
          showError(e?.message || i18n.commonError)
        }
      }
    },
    [
      isEdit,
      updateInputSet,
      createInputSet,
      showSuccess,
      closeForm,
      showError,
      formType,
      createOverlayInputSet,
      updateOverlayInputSet
    ]
  )

  const onDragStart = React.useCallback((event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('data', index.toString())
    event.currentTarget.classList.add(css.dragging)
  }, [])

  const onDragEnd = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragging)
  }, [])

  const onDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragOver)
  }, [])

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (event.preventDefault) {
      event.preventDefault()
    }
    event.currentTarget.classList.add(css.dragOver)
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, arrayHelpers: FieldArrayRenderProps, droppedIndex: number) => {
      if (event.preventDefault) {
        event.preventDefault()
      }
      const data = event.dataTransfer.getData('data')
      if (data) {
        const index = parseInt(data, 10)
        arrayHelpers.swap(index, droppedIndex)
      }
      event.currentTarget.classList.remove(css.dragOver)
    },
    []
  )

  if (
    (loadingInputSet ||
      loadingPipeline ||
      loadingTemplate ||
      createInputSetLoading ||
      updateInputSetLoading ||
      createOverlayInputSetLoading ||
      updateOverlayInputSetLoading ||
      loadingInputSetList ||
      loadingOverlayInputSet) &&
    (template?.data?.inputSetTemplateYaml || inputSetList?.data?.content)
  ) {
    return <PageSpinner />
  }

  if (errorInputSet || errorPipeline || errorTemplate || createInputSetError || updateInputSetError) {
    showError(
      (errorInputSet as FailureDTO)?.message ||
        (errorPipeline as FailureDTO)?.message ||
        (errorTemplate as FailureDTO)?.message ||
        (createInputSetError as FailureDTO)?.message ||
        (updateInputSetError as FailureDTO)?.message ||
        (createOverlayInputSetError as FailureDTO)?.message ||
        (updateOverlayInputSetError as FailureDTO)?.message ||
        (errorOverlayInputSet as FailureDTO)?.message ||
        (errorInputSetList as FailureDTO)?.message ||
        i18n.commonError
    )
  }

  return (
    <Dialog title={getTitle(isEdit, formType, inputSet)} onClose={() => closeForm()} isOpen={isOpen} {...dialogProps}>
      <div className={Classes.DIALOG_BODY}>
        <Layout.Vertical spacing="medium">
          <div className={css.optionBtns}>
            <div
              className={cx(css.item, { [css.selected]: selectedView === SelectedView.VISUAL })}
              onClick={() => handleModeSwitch(SelectedView.VISUAL)}
            >
              {i18n.VISUAL}
            </div>
            <div
              className={cx(css.item, { [css.selected]: selectedView === SelectedView.YAML })}
              onClick={() => handleModeSwitch(SelectedView.YAML)}
            >
              {i18n.YAML}
            </div>
          </div>

          <Formik<InputSetDTO>
            initialValues={{ ...inputSet }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              name: Yup.string().trim().required(i18n.nameIsRequired)
            })}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, setFieldValue }) => {
              return (
                <>
                  {selectedView === SelectedView.VISUAL ? (
                    <FormikForm>
                      <div className={css.basicForm}>
                        <FormInput.InputWithIdentifier
                          isIdentifierEditable={!isEdit}
                          inputLabel={
                            formType === InputFormType.OverlayInputForm ? i18n.overlaySetName : i18n.inputSetName
                          }
                          inputGroupProps={{ placeholder: i18n.name }}
                        />
                        <div className={css.collapseDiv}>
                          <Collapse {...descriptionCollapseProps}>
                            <FormInput.TextArea name="description" />
                          </Collapse>
                        </div>
                        <div className={css.collapseDiv}>
                          <Collapse {...tagCollapseProps}>
                            <FormInput.TagInput
                              name="tags"
                              items={[]}
                              labelFor={name => (typeof name === 'string' ? name : '')}
                              itemFromNewTag={newTag => newTag}
                              tagInputProps={{
                                noInputBorder: true,
                                openOnKeyDown: false,
                                showAddTagButton: true,
                                showClearAllButton: true,
                                allowNewTag: true,
                                placeholder: i18n.enterTags,
                                getTagProps: (value, _index, _selectedItems, createdItems) => {
                                  return createdItems.includes(value)
                                    ? { intent: 'danger', minimal: true }
                                    : { intent: 'primary', minimal: true }
                                }
                              }}
                            />
                          </Collapse>
                        </div>
                      </div>

                      {formType === InputFormType.InputForm &&
                        pipeline?.data?.cdPipeline &&
                        template?.data?.inputSetTemplateYaml && (
                          <PipelineInputSetForm
                            originalPipeline={(pipeline.data.cdPipeline as any).pipeline}
                            template={parse(template.data.inputSetTemplateYaml).pipeline}
                            inputSet={values}
                            onUpdate={updatedPipeline => {
                              setFieldValue('pipeline', updatedPipeline)
                            }}
                          />
                        )}
                      {formType === InputFormType.OverlayInputForm && (
                        <Layout.Vertical padding={{ top: 'large', bottom: 'xxxlarge' }} spacing="small">
                          <Text font={{ size: 'medium' }}>{i18n.selectInputSets}</Text>
                          <Text icon="info-sign" iconProps={{ color: Color.BLUE_450, size: 23, padding: 'small' }}>
                            {i18n.selectInputSetsHelp}
                          </Text>
                          <Layout.Vertical padding={{ top: 'xxxlarge', bottom: 'large' }}>
                            <FieldArray
                              name="inputSetReferences"
                              render={arrayHelpers => (
                                <Layout.Vertical>
                                  {values.inputSetReferences?.map((inputReference, index) => (
                                    <Layout.Horizontal
                                      key={`${index}-${inputReference}`}
                                      flex={{ distribution: 'space-between' }}
                                      style={{ alignItems: 'end' }}
                                    >
                                      <Layout.Horizontal
                                        spacing="medium"
                                        style={{ alignItems: 'baseline' }}
                                        draggable={true}
                                        onDragStart={event => {
                                          onDragStart(event, index)
                                        }}
                                        onDragEnd={onDragEnd}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={event => onDrop(event, arrayHelpers, index)}
                                      >
                                        <Icon name="drag-handle-vertical" className={css.drag} />
                                        <Text>{`${index + 1}.`}</Text>
                                        <FormInput.Select
                                          items={inputSetListOptions}
                                          name={`inputSetReferences[${index}]`}
                                          style={{ width: 400 }}
                                          placeholder={i18n.selectInputSet}
                                        />
                                      </Layout.Horizontal>
                                      <Button minimal icon="delete" onClick={() => arrayHelpers.remove(index)} />
                                    </Layout.Horizontal>
                                  ))}
                                  <span>
                                    <Button
                                      minimal
                                      text={i18n.addInputSet}
                                      intent="primary"
                                      onClick={() => arrayHelpers.push('')}
                                    />
                                  </span>
                                </Layout.Vertical>
                              )}
                            />
                          </Layout.Vertical>
                        </Layout.Vertical>
                      )}
                      <div className={Classes.DIALOG_FOOTER}>
                        <Button intent="primary" type="submit" text={i18n.save} />
                        &nbsp; &nbsp;
                        <Button onClick={closeForm} text={i18n.cancel} />
                      </div>
                    </FormikForm>
                  ) : (
                    <div className={css.editor}>
                      <YAMLBuilder
                        {...yamlBuilderReadOnlyModeProps}
                        existingJSON={{ inputSet: values }}
                        bind={setYamlHandler}
                      />
                      <Layout.Horizontal padding={{ top: 'medium' }}>
                        <Button
                          intent="primary"
                          type="submit"
                          text={i18n.save}
                          onClick={() => {
                            const latestYaml = yamlHandler?.getLatestYaml() || ''
                            handleSubmit(parse(latestYaml)?.inputSet)
                          }}
                        />
                        &nbsp; &nbsp;
                        <Button onClick={closeForm} text={i18n.cancel} />
                      </Layout.Horizontal>
                    </div>
                  )}
                </>
              )
            }}
          </Formik>
        </Layout.Vertical>
      </div>
    </Dialog>
  )
}
