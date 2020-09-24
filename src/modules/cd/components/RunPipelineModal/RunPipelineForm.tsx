import React from 'react'
import { Classes } from '@blueprintjs/core'
import { Button, Color, Formik, FormikForm, Layout, Popover, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { parse, stringify } from 'yaml'
import { noop } from 'lodash-es'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import {
  CDPipeline,
  FailureDTO,
  getInputSetForPipelinePromise,
  useCreateInputSetForPipeline,
  useGetMergeInputSetFromPipelineTemplate,
  useGetPipeline,
  useGetTemplateFromPipeline,
  usePostPipelineExecute
} from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { BasicInputSetForm, InputFormType, InputSetDTO } from '../InputSetForm/InputSetForm'
import i18n from './RunPipelineModal.i18n'
import { PipelineInputSetForm } from '../PipelineInputSetForm/PipelineInputSetForm'
import { InputSetSelector, InputSetSelectorProps } from '../InputSetSelector/InputSetSelector'
import css from './RunPipelineModal.module.scss'

export interface RunPipelineFormProps {
  pipelineIdentifier: string
  inputSetSelected?: InputSetSelectorProps['value']
  onClose: () => void
}

enum SelectedView {
  VISUAL = 'VISUAL',
  YAML = 'YAML'
}

const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
  fileName: `run-pipeline.yaml`,
  entityType: YamlEntity.PIPELINE,
  width: 620,
  height: 360,
  showSnippetSection: false
}

export const RunPipelineForm: React.FC<RunPipelineFormProps> = ({ pipelineIdentifier, onClose, inputSetSelected }) => {
  const { projectIdentifier, orgIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const [selectedView, setSelectedView] = React.useState<SelectedView>(SelectedView.VISUAL)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()

  const { data: template, loading: loadingTemplate, error: errorTemplate } = useGetTemplateFromPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier }
  })

  const [currentPipeline, setCurrentPipeline] = React.useState<{ pipeline: CDPipeline } | undefined>()

  React.useEffect(() => {
    setCurrentPipeline(parse(template?.data?.inputSetTemplateYaml || '') as { pipeline: CDPipeline })
  }, [template?.data?.inputSetTemplateYaml])

  const { showError, showSuccess, showWarning } = useToaster()

  const { data: pipelineResponse, loading: loadingPipeline, error: errorPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const handleModeSwitch = React.useCallback(
    (view: SelectedView) => {
      if (view === SelectedView.VISUAL) {
        setCurrentPipeline(parse(yamlHandler?.getLatestYaml() || '') as { pipeline: CDPipeline })
      }
      setSelectedView(view)
    },
    [yamlHandler?.getLatestYaml]
  )

  const pipeline: CDPipeline | undefined = (pipelineResponse?.data?.cdPipeline as any)?.pipeline

  const { mutate: runPipeline } = usePostPipelineExecute({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    identifier: pipelineIdentifier,
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const handleRunPipeline = React.useCallback(async () => {
    try {
      const response = await runPipeline()
      if (response.status === 'SUCCESS') {
        showSuccess(i18n.pipelineRunSuccessFully)
      }
    } catch (error) {
      showWarning(error?.data?.message || i18n.runPipelineFailed)
    }
  }, [runPipeline, showWarning, showSuccess])

  const [selectedInputSets, setSelectedInputSets] = React.useState<InputSetSelectorProps['value']>()

  React.useEffect(() => {
    setSelectedInputSets(inputSetSelected)
  }, [inputSetSelected])

  const {
    mutate: mergeInputSet,
    loading: loadingUpdate,
    error: errorMergeInputSet
  } = useGetMergeInputSetFromPipelineTemplate({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
  })

  const {
    mutate: createInputSet,
    error: createInputSetError,
    loading: createInputSetLoading
  } = useCreateInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'text/yaml' } }
  })

  React.useEffect(() => {
    if (selectedInputSets && Array.isArray(selectedInputSets)) {
      const fetchData = async (): Promise<void> => {
        const data = await mergeInputSet({
          inputSetIdentifierList: selectedInputSets.map(item => item.value as string)
        })
        if (data?.data?.pipelineYaml) {
          setCurrentPipeline(parse(data.data.pipelineYaml) as { pipeline: CDPipeline })
        }
      }
      fetchData()
    } else if (selectedInputSets && selectedInputSets.value) {
      const fetchData = async (): Promise<void> => {
        const data = await getInputSetForPipelinePromise({
          inputSetIdentifier: selectedInputSets.value as string,
          queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
        })
        if (data?.data?.inputSetYaml) {
          setCurrentPipeline(parse(data.data.inputSetYaml)?.inputSet as { pipeline: CDPipeline })
        }
      }
      fetchData()
    }
  }, [selectedInputSets, accountId, projectIdentifier, orgIdentifier, pipelineIdentifier])

  if (loadingPipeline || loadingTemplate || loadingUpdate || createInputSetLoading) {
    return <PageSpinner />
  }

  if (errorPipeline || errorTemplate || errorMergeInputSet || createInputSetError) {
    showError(
      (errorTemplate as FailureDTO)?.message ||
        (errorPipeline as FailureDTO)?.message ||
        (errorMergeInputSet as FailureDTO)?.message ||
        (createInputSetError as FailureDTO)?.message ||
        i18n.commonError
    )
  }

  return (
    <>
      <Layout.Horizontal flex={{ distribution: 'space-between' }} padding="medium">
        <Text font="medium">{`${i18n.runPipeline}: ${pipeline?.name}`}</Text>
        <Button icon="cross" minimal onClick={onClose} />
      </Layout.Horizontal>
      <div className={Classes.DIALOG_BODY}>
        <Layout.Vertical spacing="medium">
          <Layout.Horizontal flex={{ distribution: 'space-between' }}>
            <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
              <Text font={{ weight: 'bold' }} color={Color.BLACK}>
                {i18n.inputForm}
              </Text>
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
            </Layout.Horizontal>
            <InputSetSelector
              onChange={value => {
                setSelectedInputSets(value)
              }}
              value={selectedInputSets}
            />
          </Layout.Horizontal>
          <Layout.Vertical>
            {currentPipeline && (
              <Formik initialValues={currentPipeline} onSubmit={noop} enableReinitialize>
                {({ setFieldValue, values }) => {
                  return (
                    <>
                      {selectedView === SelectedView.VISUAL ? (
                        <FormikForm>
                          {pipeline && template?.data?.inputSetTemplateYaml && (
                            <PipelineInputSetForm
                              originalPipeline={pipeline}
                              template={parse(template.data.inputSetTemplateYaml).pipeline}
                              pipeline={values.pipeline}
                              onUpdate={updatedPipeline => {
                                setFieldValue('pipeline', updatedPipeline)
                              }}
                            />
                          )}
                        </FormikForm>
                      ) : (
                        <div className={css.editor}>
                          <YAMLBuilder {...yamlBuilderReadOnlyModeProps} existingJSON={values} bind={setYamlHandler} />
                        </div>
                      )}

                      <Layout.Horizontal padding={{ top: 'medium' }}>
                        <Layout.Horizontal flex={{ distribution: 'space-between' }} style={{ width: '100%' }}>
                          <Button intent="primary" type="submit" text={i18n.runPipeline} onClick={handleRunPipeline} />
                          <Popover
                            content={
                              <Layout.Vertical
                                padding="medium"
                                spacing="medium"
                                className={Classes.POPOVER_DISMISS_OVERRIDE}
                              >
                                <Formik
                                  onSubmit={input => {
                                    createInputSet(stringify({ inputSet: input })).then(() => {
                                      showSuccess(i18n.inputSetSaved)
                                    })
                                  }}
                                  initialValues={{ pipeline: values.pipeline, name: '', identifier: '' } as InputSetDTO}
                                >
                                  {({ submitForm }) => {
                                    return (
                                      <>
                                        <BasicInputSetForm isEdit={false} formType={InputFormType.InputForm} />

                                        <Layout.Horizontal
                                          flex={{ distribution: 'space-between' }}
                                          padding={{ top: 'medium' }}
                                        >
                                          <Button
                                            intent="primary"
                                            text={i18n.save}
                                            onClick={event => {
                                              event.stopPropagation()
                                              submitForm()
                                            }}
                                          />
                                          <Button className={Classes.POPOVER_DISMISS} text={i18n.cancel} />
                                        </Layout.Horizontal>
                                      </>
                                    )
                                  }}
                                </Formik>
                              </Layout.Vertical>
                            }
                          >
                            <Button minimal intent="primary" text={i18n.saveAsInputSet} />
                          </Popover>
                        </Layout.Horizontal>
                      </Layout.Horizontal>
                    </>
                  )
                }}
              </Formik>
            )}
          </Layout.Vertical>
        </Layout.Vertical>
      </div>
      <div className={Classes.DIALOG_FOOTER}></div>
    </>
  )
}
