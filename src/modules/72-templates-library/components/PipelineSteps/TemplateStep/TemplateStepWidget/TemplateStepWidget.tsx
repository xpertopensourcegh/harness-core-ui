import React from 'react'
import {
  Color,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  MultiTypeInputType,
  Heading,
  PageError
} from '@wings-software/uicore'
import * as Yup from 'yup'
import cx from 'classnames'
import type { FormikProps } from 'formik'
import { useParams } from 'react-router-dom'
import { parse } from 'yaml'
import { defaultTo, get, isEmpty, isEqual, merge, noop, set } from 'lodash-es'
import { NameSchema } from '@common/utils/Validation'
import { setFormikRef, StepViewType, StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/strings'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type { StepElementConfig } from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetTemplateInputSetYaml } from 'services/template-ng'
import { useToaster } from '@common/exports'
import { PageSpinner } from '@common/components'
import { Scope } from '@common/interfaces/SecretsInterface'
import { getIdentifierFromValue, getScopeFromValue } from '@common/components/EntityReference/EntityReference'
import type { TemplateStepNode } from 'services/pipeline-ng'
import { validateStep } from '@pipeline/components/PipelineStudio/StepUtil'
import { StepForm } from '@pipeline/components/PipelineInputSetForm/StageInputSetForm'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from './TemplateStepWidget.module.scss'

export interface TemplateStepWidgetProps {
  initialValues: TemplateStepNode
  isNewStep?: boolean
  isDisabled?: boolean
  onUpdate?: (data: TemplateStepNode) => void
  stepViewType?: StepViewType
  readonly?: boolean
  factory: AbstractStepFactory
  allowableTypes: MultiTypeInputType[]
}

export function TemplateStepWidget(
  props: TemplateStepWidgetProps,
  formikRef: StepFormikFowardRef<TemplateStepNode>
): React.ReactElement {
  const { initialValues, onUpdate, isNewStep, readonly, allowableTypes } = props
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const [inputSetTemplate, setInputSetTemplate] = React.useState<StepElementConfig>()
  const { showError } = useToaster()
  const templateRef = getIdentifierFromValue(initialValues.template.templateRef)
  const scope = getScopeFromValue(initialValues.template.templateRef)

  const {
    data: templateInputYaml,
    error: inputSetError,
    refetch,
    loading
  } = useGetTemplateInputSetYaml({
    templateIdentifier: templateRef,
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
      orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined,
      versionLabel: initialValues.template.versionLabel || ''
    }
  })

  React.useEffect(() => {
    if (!loading) {
      try {
        const templateInputs = parse(defaultTo(templateInputYaml?.data, ''))
        setInputSetTemplate(templateInputs)
        if (!isEqual(templateInputs, initialValues.template?.templateInputs)) {
          set(
            initialValues,
            'template.templateInputs',
            merge({}, templateInputs, initialValues.template?.templateInputs)
          )
          onUpdate?.(initialValues)
        }
      } catch (error) {
        showError(error.message, undefined, 'template.parse.inputSet.error')
      }
    }
  }, [templateInputYaml?.data, loading])

  const validateForm = (values: TemplateStepNode) => {
    const errorsResponse = validateStep({
      step: values.template?.templateInputs as StepElementConfig,
      template: inputSetTemplate,
      originalStep: { step: initialValues?.template?.templateInputs as StepElementConfig },
      getString,
      viewType: StepViewType.DeploymentForm
    })
    if (!isEmpty(errorsResponse)) {
      return set({}, 'template.templateInputs', get(errorsResponse, 'step'))
    } else {
      return errorsResponse
    }
  }

  return (
    <div className={stepCss.stepPanel}>
      {loading && <PageSpinner />}
      {!loading && inputSetError && (
        <PageError
          className={css.error}
          message={defaultTo((inputSetError.data as Error)?.message, inputSetError.message)}
          onClick={() => refetch()}
        />
      )}
      {!loading && !inputSetError && inputSetTemplate && initialValues.template?.templateInputs && (
        <Formik<TemplateStepNode>
          onSubmit={values => {
            onUpdate?.(values)
          }}
          initialValues={initialValues}
          formName="templateStepWidget"
          validationSchema={Yup.object().shape({
            name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.stepNameRequired') })
          })}
          validate={validateForm}
          enableReinitialize={true}
        >
          {(formik: FormikProps<TemplateStepNode>) => {
            setFormikRef(formikRef, formik)
            return (
              <FormikForm>
                <Container className={css.inputsContainer}>
                  <Layout.Vertical
                    margin={{ top: 'medium' }}
                    padding={{ top: 'large', bottom: 'large' }}
                    border={{ top: true }}
                    spacing={'large'}
                  >
                    <div className={cx(stepCss.formGroup, stepCss.md)}>
                      <FormInput.InputWithIdentifier
                        isIdentifierEditable={isNewStep && !readonly}
                        inputLabel={getString('name')}
                        inputGroupProps={{ disabled: readonly }}
                      />
                    </div>
                    <Heading level={5} color={Color.BLACK}>
                      {getString('templatesLibrary.templateInputs')}
                    </Heading>
                    <StepForm
                      template={{ step: inputSetTemplate }}
                      values={{ step: formik.values.template?.templateInputs as StepElementConfig }}
                      allValues={{ step: formik.values.template?.templateInputs as StepElementConfig }}
                      readonly={readonly}
                      viewType={StepViewType.InputSet}
                      path={'template.templateInputs'}
                      allowableTypes={allowableTypes}
                      onUpdate={noop}
                    />
                  </Layout.Vertical>
                </Container>
              </FormikForm>
            )
          }}
        </Formik>
      )}
    </div>
  )
}

export const TemplateStepWidgetWithRef = React.forwardRef(TemplateStepWidget)
