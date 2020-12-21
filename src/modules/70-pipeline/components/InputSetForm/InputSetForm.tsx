import React from 'react'
import { isNull, isUndefined, omit, omitBy } from 'lodash-es'
import cx from 'classnames'
import type { IconName } from '@blueprintjs/core'
import * as Yup from 'yup'
import { Button, Collapse, Container, Formik, FormikForm, FormInput, Layout, Text } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import { parse, stringify } from 'yaml'
import type { NgPipeline } from 'services/cd-ng'

import {
  useGetTemplateFromPipeline,
  useGetPipeline,
  useCreateInputSetForPipeline,
  useGetInputSetForPipeline,
  useUpdateInputSetForPipeline,
  Failure,
  InputSetResponse,
  ResponseInputSetResponse,
  useGetMergeInputSetFromPipelineTemplateWithListInput
} from 'services/pipeline-ng'

import { useToaster } from '@common/exports'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from '@common/interfaces/YAMLBuilderProps'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { pipelineSchema } from '@common/services/mocks/pipeline-schema.ts'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { InputSetPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { PageHeader } from '@common/components/Page/PageHeader'
import { PageBody } from '@common/components/Page/PageBody'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import { useAppStore, useStrings } from 'framework/exports'
import i18n from './InputSetForm.18n'
import { PipelineInputSetForm } from '../PipelineInputSetForm/PipelineInputSetForm'
import css from './InputSetForm.module.scss'

export interface InputSetDTO extends Omit<InputSetResponse, 'identifier' | 'pipeline'> {
  pipeline?: NgPipeline
  identifier?: string
}

const getDefaultInputSet = (template: NgPipeline): InputSetDTO => ({
  name: undefined,
  identifier: '',
  description: undefined,
  pipeline: template
})

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}
const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.tags })

export const BasicInputSetForm: React.FC<{ isEdit: boolean; values: InputSetDTO }> = ({ isEdit, values }) => (
  <div className={css.basicForm}>
    <FormInput.InputWithIdentifier
      isIdentifierEditable={!isEdit}
      inputLabel={i18n.inputSetName}
      inputGroupProps={{ placeholder: i18n.name }}
    />
    <div className={css.collapseDiv}>
      <Collapse {...descriptionCollapseProps} isOpen={(values.description && values.description?.length > 0) || false}>
        <FormInput.TextArea name="description" />
      </Collapse>
    </div>
    <div className={css.collapseDiv}>
      <Collapse {...tagCollapseProps} isOpen={values.tags && Object.keys(values.tags).length > 0}>
        <FormInput.KVTagInput name="tags" />
      </Collapse>
    </div>
  </div>
)

enum SelectedView {
  VISUAL = 'VISUAL',
  YAML = 'YAML'
}

const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
  fileName: `input-set.yaml`,
  entityType: 'InputSets',
  width: 620,
  height: 360,
  showSnippetSection: false
}

const clearNullUndefined = /* istanbul ignore next */ (data: InputSetDTO): InputSetDTO =>
  omitBy(omitBy(data, isUndefined), isNull)

const getTitle = (isEdit: boolean, inputSet: InputSetDTO): string => {
  if (isEdit) {
    return i18n.editTitle(inputSet.name || /* istanbul ignore next */ '')
  } else {
    return i18n.newInputSet
  }
}

export const InputSetForm: React.FC = (): JSX.Element => {
  const [isEdit, setIsEdit] = React.useState(false)
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier, inputSetIdentifier, module } = useParams<
    PipelineType<InputSetPathProps> & { accountId: string }
  >()
  const history = useHistory()
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
      inputSetIdentifier: inputSetIdentifier || '',
      lazy: true
    }
  )

  const [mergeTemplate, setMergeTemplate] = React.useState<string>()

  const {
    mutate: mergeInputSet,
    loading: loadingMerge,
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
  const {
    mutate: updateInputSet,
    error: updateInputSetError,
    loading: updateInputSetLoading
  } = useUpdateInputSetForPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier },
    inputSetIdentifier: '',
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const { data: pipeline, loading: loadingPipeline, error: errorPipeline, refetch: refetchPipeline } = useGetPipeline({
    pipelineIdentifier,
    lazy: true,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const inputSet = React.useMemo(() => {
    if (inputSetResponse?.data && mergeTemplate) {
      const inputSetObj = inputSetResponse?.data
      const inputYamlObj =
        parse(mergeTemplate || /* istanbul ignore next */ '')?.pipeline || /* istanbul ignore next */ {}
      return {
        name: inputSetObj.name,
        tags: inputSetObj.tags,
        identifier: inputSetObj.identifier || /* istanbul ignore next */ '',
        description: inputSetObj?.description,
        pipeline: inputYamlObj
      }
    }
    return getDefaultInputSet(
      parse(template?.data?.inputSetTemplateYaml || /* istanbul ignore next */ '')?.pipeline as any
    )
  }, [mergeTemplate, inputSetResponse?.data, template?.data?.inputSetTemplateYaml])

  React.useEffect(() => {
    if (inputSetIdentifier !== '-1') {
      setIsEdit(true)
      refetch({ pathParams: { inputSetIdentifier: inputSetIdentifier } })
      refetchTemplate()
      refetchPipeline()
      mergeInputSet({ inputSetReferences: [inputSetIdentifier] }).then(response => {
        setMergeTemplate(response.data?.pipelineYaml)
      })
    } else {
      refetchTemplate()
      refetchPipeline()

      setIsEdit(false)
    }
  }, [inputSetIdentifier])

  const { selectedProject } = useAppStore()
  const project = selectedProject
  const { getString } = useStrings()

  const handleModeSwitch = React.useCallback(
    (view: SelectedView) => {
      if (view === SelectedView.VISUAL) {
        const yaml = yamlHandler?.getLatestYaml() || /* istanbul ignore next */ ''
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

  const handleSubmit = React.useCallback(
    async (inputSetObj: InputSetDTO) => {
      if (inputSetObj) {
        try {
          let response: ResponseInputSetResponse | null = null
          if (isEdit) {
            response = await updateInputSet(stringify({ inputSet: clearNullUndefined(inputSetObj) }) as any, {
              pathParams: { inputSetIdentifier: inputSetObj.identifier || /* istanbul ignore next */ '' }
            })
          } else {
            response = await createInputSet(stringify({ inputSet: clearNullUndefined(inputSetObj) }) as any)
          }
          /* istanbul ignore else */
          if (response) {
            if (response.data?.errorResponse) {
              showError(i18n.inputSetSavedError)
            } else {
              showSuccess(i18n.inputSetSaved)
            }
          }
          history.goBack()
        } catch (_e) {
          // showError(e?.message || i18n.commonError)
        }
      }
    },
    [isEdit, updateInputSet, createInputSet, showSuccess, showError]
  )

  /* istanbul ignore else */
  if (
    errorInputSet ||
    errorPipeline ||
    errorTemplate ||
    createInputSetError ||
    updateInputSetError ||
    errorMergeInputSet
  ) {
    /* istanbul ignore next */
    showError(
      (errorInputSet as Failure)?.message ||
        (errorPipeline?.data as Failure)?.message ||
        (errorTemplate?.data as Failure)?.message ||
        (createInputSetError?.data as Failure)?.message ||
        (updateInputSetError?.data as Failure)?.message ||
        (errorMergeInputSet?.data as Failure)?.message ||
        i18n.commonError
    )
  }

  return (
    <>
      <PageHeader
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                {
                  url: routes.toCDProjectOverview({ orgIdentifier, projectIdentifier, accountId }),
                  label: project?.name as string
                },
                {
                  url: routes.toPipelines({ orgIdentifier, projectIdentifier, accountId, module }),
                  label: getString('pipelines')
                },
                {
                  url: routes.toInputSetList({
                    orgIdentifier,
                    projectIdentifier,
                    accountId,
                    pipelineIdentifier,
                    module
                  }),
                  label: parse(pipeline?.data?.yamlPipeline || '')?.pipeline.name || ''
                },
                { url: '#', label: isEdit ? inputSet.name : i18n.newInputSet }
              ]}
            />
            <Layout.Horizontal>
              <Text font="medium">{getTitle(isEdit, inputSet)}</Text>
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
          </Layout.Vertical>
        }
      />
      <PageBody
        loading={
          loadingInputSet ||
          loadingPipeline ||
          loadingTemplate ||
          createInputSetLoading ||
          updateInputSetLoading ||
          loadingMerge
        }
      >
        <Container className={css.inputSetForm}>
          <Layout.Vertical spacing="medium">
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
                        <Layout.Vertical className={css.content} padding="xlarge">
                          <AddDescriptionAndKVTagsWithIdentifier
                            identifierProps={{
                              inputLabel: i18n.overlaySetName,
                              isIdentifierEditable: !isEdit
                            }}
                          />
                          {pipeline?.data?.yamlPipeline &&
                            template?.data?.inputSetTemplateYaml &&
                            parse(template.data.inputSetTemplateYaml) && (
                              <PipelineInputSetForm
                                originalPipeline={parse(pipeline.data.yamlPipeline || '').pipeline}
                                template={parse(template.data.inputSetTemplateYaml).pipeline}
                                pipeline={values.pipeline}
                                onUpdate={updatedPipeline => {
                                  setFieldValue('pipeline', updatedPipeline)
                                }}
                              />
                            )}
                        </Layout.Vertical>
                        <Layout.Horizontal className={css.footer} padding="medium">
                          <Button intent="primary" type="submit" text={i18n.save} />
                          &nbsp; &nbsp;
                          <Button
                            onClick={() => {
                              history.goBack()
                            }}
                            text={i18n.cancel}
                          />
                        </Layout.Horizontal>
                      </FormikForm>
                    ) : (
                      <div className={css.editor}>
                        <Layout.Vertical className={css.content} padding="xlarge">
                          <YAMLBuilder
                            {...yamlBuilderReadOnlyModeProps}
                            existingJSON={{ inputSet: omit(values, 'inputSetReferences') }}
                            bind={setYamlHandler}
                            schema={pipelineSchema}
                          />
                        </Layout.Vertical>
                        <Layout.Horizontal className={css.footer} padding="medium">
                          <Button
                            intent="primary"
                            type="submit"
                            text={i18n.save}
                            onClick={() => {
                              const latestYaml = yamlHandler?.getLatestYaml() || /* istanbul ignore next */ ''
                              handleSubmit(parse(latestYaml)?.inputSet)
                            }}
                          />
                          &nbsp; &nbsp;
                          <Button
                            onClick={() => {
                              history.goBack()
                            }}
                            text={i18n.cancel}
                          />
                        </Layout.Horizontal>
                      </div>
                    )}
                  </>
                )
              }}
            </Formik>
          </Layout.Vertical>
        </Container>
      </PageBody>
    </>
  )
}
