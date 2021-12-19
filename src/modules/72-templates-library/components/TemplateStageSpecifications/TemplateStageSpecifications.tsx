import React from 'react'
import { debounce, defaultTo, noop } from 'lodash-es'
import {
  Card,
  Color,
  Container,
  Formik,
  FormikForm,
  Heading,
  Layout,
  MultiTypeInputType,
  PageError
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { parse } from 'yaml'
import type { FormikProps } from 'formik'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import type { StageElementConfig } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'
import { PageSpinner } from '@common/components'
import { Scope } from '@common/interfaces/SecretsInterface'
import { getIdentifierFromValue, getScopeFromValue } from '@common/components/EntityReference/EntityReference'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { NameId } from '@common/components/NameIdDescriptionTags/NameIdDescriptionTags'
import { useToaster } from '@common/exports'
import { useGetTemplateInputSetYaml } from 'services/template-ng'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StageForm } from '@pipeline/components/PipelineInputSetForm/PipelineInputSetForm'
import { StageTemplateBar } from '@pipeline/components/PipelineStudio/StageTemplateBar/StageTemplateBar'
import css from './TemplateStageSpecifications.module.scss'

export const TemplateStageSpecifications = (): JSX.Element => {
  const {
    state: {
      selectionState: { selectedStageId = '' }
    },
    updateStage,
    isReadonly,
    getStageFromPipeline
  } = usePipelineContext()
  const { stage } = getStageFromPipeline(selectedStageId)
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const [inputSetTemplate, setInputSetTemplate] = React.useState<StageElementConfig>()
  const templateIdentifier = getIdentifierFromValue(defaultTo(stage?.stage?.template?.templateRef, ''))
  const scope = getScopeFromValue(defaultTo(stage?.stage?.template?.templateRef, ''))
  const { showError } = useToaster()
  const { getString } = useStrings()

  const onChange = React.useCallback(
    debounce(async (values: StageElementConfig): Promise<void> => {
      await updateStage({ ...stage?.stage, ...values })
    }, 300),
    [stage?.stage, updateStage]
  )

  const {
    data: templateInputYaml,
    error: inputSetError,
    refetch,
    loading
  } = useGetTemplateInputSetYaml({
    templateIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
      orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined,
      versionLabel: defaultTo(stage?.stage?.template?.versionLabel, '')
    }
  })

  React.useEffect(() => {
    try {
      setInputSetTemplate(parse(defaultTo(templateInputYaml?.data, '')))
    } catch (error) {
      showError(error.message, undefined, 'template.parse.inputSet.error')
    }
  }, [templateInputYaml?.data])

  return (
    <Container className={css.serviceOverrides}>
      <Container className={css.contentSection}>
        <StageTemplateBar />
        <Formik
          initialValues={{
            name: defaultTo(stage?.stage?.name, ''),
            identifier: defaultTo(stage?.stage?.identifier, ''),
            template: defaultTo(stage?.stage?.template, {
              templateRef: '',
              versionLabel: ''
            })
          }}
          formName="templateStageOverview"
          onSubmit={noop}
          validate={values => {
            onChange?.(values)
          }}
          validationSchema={Yup.object().shape({
            name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.build.create.stageNameRequiredError') }),
            identifier: IdentifierSchema()
          })}
          enableReinitialize={true}
        >
          {(formik: FormikProps<StageElementConfig>) => {
            return (
              <FormikForm>
                <Card className={css.sectionCard}>
                  <NameId
                    identifierProps={{
                      inputLabel: getString('stageNameLabel'),
                      isIdentifierEditable: false,
                      inputGroupProps: { disabled: isReadonly }
                    }}
                    inputGroupProps={{ placeholder: getString('common.namePlaceholder') }}
                  />
                </Card>
                <Container className={css.inputsContainer}>
                  {loading && <PageSpinner />}
                  {!loading && inputSetError && (
                    <PageError className={css.error} message={inputSetError.message} onClick={() => refetch()} />
                  )}
                  {!loading && !inputSetError && inputSetTemplate && formik.values.template?.templateInputs && (
                    <Layout.Vertical
                      margin={{ top: 'medium' }}
                      padding={{ top: 'large', bottom: 'large' }}
                      spacing={'large'}
                    >
                      <Heading level={5} color={Color.BLACK}>
                        {getString('templatesLibrary.templateInputs')}
                      </Heading>
                      <StageForm
                        template={{ stage: inputSetTemplate }}
                        allValues={{ stage: formik.values.template.templateInputs as StageElementConfig }}
                        path={'template.templateInputs'}
                        readonly={isReadonly}
                        viewType={StepViewType.InputSet}
                        hideTitle={true}
                        stageClassName={css.stageCard}
                        allowableTypes={[
                          MultiTypeInputType.FIXED,
                          MultiTypeInputType.EXPRESSION,
                          MultiTypeInputType.RUNTIME
                        ]}
                      />
                    </Layout.Vertical>
                  )}
                </Container>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Container>
  )
}
