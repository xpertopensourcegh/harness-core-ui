import React from 'react'
import { Classes } from '@blueprintjs/core'
import { Button, Checkbox, Formik, FormikForm, Layout, Popover, Text } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import cx from 'classnames'
import { parse, stringify } from 'yaml'
import { noop, pick } from 'lodash-es'
import * as Yup from 'yup'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import {
  NgPipeline,
  Failure,
  getInputSetForPipelinePromise,
  useCreateInputSetForPipeline,
  useGetMergeInputSetFromPipelineTemplateWithListInput,
  useGetPipeline,
  useGetTemplateFromPipeline,
  usePostPipelineExecuteWithInputSetYaml
} from 'services/cd-ng'
import { useToaster } from '@common/exports'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from '@common/interfaces/YAMLBuilderProps'
import { YamlEntity } from '@common/constants/YamlConstants'
import { routeCDPipelineExecutionPipline } from 'navigation/cd/routes'
import { PipelineInputSetForm } from '@pipeline/components/PipelineInputSetForm/PipelineInputSetForm'
import { BasicInputSetForm, InputFormType, InputSetDTO } from '../InputSetForm/InputSetForm'
import i18n from './RunPipelineModal.i18n'
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
  const [skipPreFlightCheck, setSkipPreFlightCheck] = React.useState<boolean>(false)
  const { data: template, loading: loadingTemplate, error: errorTemplate } = useGetTemplateFromPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier }
  })

  const [currentPipeline, setCurrentPipeline] = React.useState<{ pipeline?: NgPipeline } | undefined>()

  React.useEffect(() => {
    setCurrentPipeline(parse(template?.data?.inputSetTemplateYaml || '') as { pipeline: NgPipeline })
  }, [template?.data?.inputSetTemplateYaml])

  const { showError, showSuccess, showWarning } = useToaster()

  const { data: pipelineResponse, loading: loadingPipeline, error: errorPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const handleModeSwitch = React.useCallback(
    (view: SelectedView) => {
      if (view === SelectedView.VISUAL) {
        setCurrentPipeline(parse(yamlHandler?.getLatestYaml() || '') as { pipeline: NgPipeline })
      }
      setSelectedView(view)
    },
    [yamlHandler?.getLatestYaml]
  )

  const pipeline: NgPipeline | undefined = (pipelineResponse?.data?.ngPipeline as any)?.pipeline
  const history = useHistory()
  const { mutate: runPipeline } = usePostPipelineExecuteWithInputSetYaml({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    identifier: pipelineIdentifier,
    requestOptions: {
      headers: {
        'content-type': 'application/yaml'
      }
    }
  })

  const handleRunPipeline = React.useCallback(
    async (valuesPipeline?: NgPipeline) => {
      try {
        const response = await runPipeline(
          valuesPipeline ? (stringify({ pipeline: valuesPipeline || '' }) as any) : (valuesPipeline as any)
        )
        if (response.status === 'SUCCESS') {
          if (!response.data?.errorResponse) {
            showSuccess(i18n.pipelineRunSuccessFully)
            history.push(
              routeCDPipelineExecutionPipline.url({
                orgIdentifier,
                pipelineIdentifier: pipelineIdentifier,
                projectIdentifier,
                executionIdentifier: response.data?.planExecution?.uuid || ''
              })
            )
          }
        }
      } catch (error) {
        showWarning(error?.data?.message || i18n.runPipelineFailed)
      }
    },
    [runPipeline, showWarning, showSuccess, pipelineIdentifier, history, orgIdentifier, projectIdentifier]
  )

  const [selectedInputSets, setSelectedInputSets] = React.useState<InputSetSelectorProps['value']>(inputSetSelected)

  React.useEffect(() => {
    setSelectedInputSets(inputSetSelected)
  }, [inputSetSelected])

  const {
    mutate: mergeInputSet,
    loading: loadingUpdate,
    error: errorMergeInputSet
  } = useGetMergeInputSetFromPipelineTemplateWithListInput({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
  })

  const {
    mutate: createInputSet,
    error: createInputSetError,
    loading: createInputSetLoading
  } = useCreateInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  React.useEffect(() => {
    if (template?.data?.inputSetTemplateYaml) {
      if ((selectedInputSets && selectedInputSets.length > 1) || selectedInputSets?.[0].type === 'OVERLAY_INPUT_SET') {
        const fetchData = async (): Promise<void> => {
          const data = await mergeInputSet({
            inputSetReferences: selectedInputSets.map(item => item.value as string)
          })
          if (data?.data?.pipelineYaml) {
            setCurrentPipeline(parse(data.data.pipelineYaml) as { pipeline: NgPipeline })
          }
        }
        fetchData()
      } else if (selectedInputSets && selectedInputSets.length === 1) {
        const fetchData = async (): Promise<void> => {
          const data = await getInputSetForPipelinePromise({
            inputSetIdentifier: selectedInputSets[0].value as string,
            queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
          })
          if (data?.data?.inputSetYaml) {
            if (selectedInputSets[0].type === 'INPUT_SET') {
              setCurrentPipeline(pick(parse(data.data.inputSetYaml)?.inputSet, 'pipeline') as { pipeline: NgPipeline })
            }
          }
        }
        fetchData()
      }
    }
  }, [
    template?.data?.inputSetTemplateYaml,
    selectedInputSets?.length,
    selectedInputSets,
    accountId,
    projectIdentifier,
    orgIdentifier,
    pipelineIdentifier
  ])

  if (loadingPipeline || loadingTemplate || createInputSetLoading || loadingUpdate) {
    return <PageSpinner />
  }

  if (errorPipeline || errorTemplate || createInputSetError || errorMergeInputSet) {
    showError(
      (errorTemplate?.data as Failure)?.message ||
        (errorPipeline?.data as Failure)?.message ||
        (errorMergeInputSet?.data as Failure)?.message ||
        (createInputSetError?.data as Failure)?.message ||
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
          {pipeline && currentPipeline && template?.data?.inputSetTemplateYaml && (
            <Layout.Horizontal flex={{ distribution: 'space-between' }}>
              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
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
                pipelineIdentifier={pipelineIdentifier}
                onChange={value => {
                  setSelectedInputSets(value)
                }}
                value={selectedInputSets}
              />
            </Layout.Horizontal>
          )}
          <Layout.Vertical>
            <Formik initialValues={currentPipeline || {}} onSubmit={noop} enableReinitialize>
              {({ setFieldValue, values }) => {
                return (
                  <>
                    {selectedView === SelectedView.VISUAL ? (
                      <FormikForm>
                        {pipeline && currentPipeline && template?.data?.inputSetTemplateYaml ? (
                          <PipelineInputSetForm
                            originalPipeline={pipeline}
                            template={parse(template.data.inputSetTemplateYaml).pipeline}
                            pipeline={values.pipeline}
                            onUpdate={updatedPipeline => {
                              setFieldValue('pipeline', updatedPipeline)
                            }}
                          />
                        ) : (
                          <Layout.Horizontal padding="medium" margin="medium">
                            <Text>{i18n.noRuntimeInput}</Text>
                          </Layout.Horizontal>
                        )}
                      </FormikForm>
                    ) : (
                      <div className={css.editor}>
                        <YAMLBuilder {...yamlBuilderReadOnlyModeProps} existingJSON={values} bind={setYamlHandler} />
                      </div>
                    )}

                    <Layout.Horizontal padding={{ top: 'medium  ' }}>
                      <Layout.Horizontal flex={{ distribution: 'space-between' }} style={{ width: '100%' }}>
                        <Layout.Horizontal spacing="xxxlarge" style={{ alignItems: 'center' }}>
                          <Button
                            intent="primary"
                            type="submit"
                            text={i18n.runPipeline}
                            onClick={() => handleRunPipeline(values.pipeline as any)}
                          />
                          <Checkbox
                            label={i18n.skipPreFlightCheck}
                            checked={skipPreFlightCheck}
                            onChange={e => setSkipPreFlightCheck(e.currentTarget.checked)}
                          />
                        </Layout.Horizontal>
                        {pipeline && currentPipeline && template?.data?.inputSetTemplateYaml && (
                          <Popover
                            content={
                              <Layout.Vertical
                                padding="medium"
                                spacing="medium"
                                className={Classes.POPOVER_DISMISS_OVERRIDE}
                              >
                                <Formik
                                  onSubmit={input => {
                                    createInputSet(stringify({ inputSet: input }) as any).then(response => {
                                      if (response.data?.errorResponse) {
                                        showError(i18n.inputSetSavedError)
                                      } else {
                                        showSuccess(i18n.inputSetSaved)
                                      }
                                    })
                                  }}
                                  validationSchema={Yup.object().shape({
                                    name: Yup.string().trim().required(i18n.nameIsRequired)
                                  })}
                                  initialValues={{ pipeline: values.pipeline, name: '', identifier: '' } as InputSetDTO}
                                >
                                  {({ submitForm, values: formikValues }) => {
                                    return (
                                      <>
                                        <BasicInputSetForm
                                          isEdit={false}
                                          formType={InputFormType.InputForm}
                                          values={formikValues}
                                        />

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
                        )}
                      </Layout.Horizontal>
                    </Layout.Horizontal>
                  </>
                )
              }}
            </Formik>
          </Layout.Vertical>
        </Layout.Vertical>
      </div>
      <div className={Classes.DIALOG_FOOTER}></div>
    </>
  )
}
