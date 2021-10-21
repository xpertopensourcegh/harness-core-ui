import React from 'react'
import {
  Color,
  Heading,
  Container,
  MultiTypeInputType,
  Text,
  Layout,
  Formik,
  getMultiTypeFromValue,
  PageError
} from '@wings-software/uicore'
import { parse } from 'yaml'
import { noop } from 'lodash-es'
import cx from 'classnames'
import { useGetTemplateInputSetYaml } from 'services/template-ng'
import type { TemplateDetailsProps } from '@templates-library/components/TemplateDetails/TemplateDetails'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { PageSpinner, useToaster } from '@common/components'
import type { StepElementConfig } from 'services/cd-ng'
import MultiTypeDelegateSelector from '@common/components/MultiTypeDelegateSelector/MultiTypeDelegateSelector'
import { useStrings } from 'framework/strings'
import css from './TemplateInputs.module.scss'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export interface TemplateInputsProps {
  templateInputs?: any
}

export const TemplateInputs: React.FC<TemplateDetailsProps> = props => {
  const { templateIdentifier, versionLabel, accountId, orgIdentifier, projectIdentifier } = props
  const [inputSetTemplate, setInputSetTemplate] = React.useState<StepElementConfig | null>()
  const [count, setCount] = React.useState<number>(0)
  const { showError } = useToaster()
  const { getString } = useStrings()

  const {
    data: templateInputYaml,
    error: inputSetError,
    refetch,
    loading
  } = useGetTemplateInputSetYaml({
    templateIdentifier: templateIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      versionLabel: versionLabel || ''
    }
  })

  React.useEffect(() => {
    if (!loading && templateInputYaml?.data) {
      try {
        const templateInput = parse(templateInputYaml.data || '')
        setCount((JSON.stringify(templateInput).match(/<\+input>/g) || []).length)
        setInputSetTemplate(templateInput)
      } catch (error) {
        showError(error.message, undefined, 'template.parse.inputSet.error')
      }
    }
  }, [loading, templateInputYaml?.data])

  React.useEffect(() => {
    setInputSetTemplate(null)
    refetch()
  }, [versionLabel])

  return (
    <Container padding={{ top: 'large', left: 'xxlarge', bottom: 'xxlarge', right: 'xxlarge' }}>
      {inputSetTemplate ? (
        <Layout.Vertical spacing={'xlarge'} className={css.inputsContainer}>
          <Container>
            <Layout.Horizontal flex={{ alignItems: 'center' }} spacing={'xxxlarge'}>
              <Text font={{ size: 'normal', weight: 'bold' }} color={Color.GREY_800}>
                {templateIdentifier}: {versionLabel}
              </Text>
              <Text className={css.inputsCount} font={{ size: 'small' }}>
                {getString('templatesLibrary.inputsCount', { count })}
              </Text>
            </Layout.Horizontal>
          </Container>
          <Formik<StepElementConfig /*TemplateStepFormData*/>
            onSubmit={noop}
            initialValues={inputSetTemplate}
            formName="templateInputs"
            enableReinitialize={true}
          >
            <StepWidget<Partial<StepElementConfig>>
              factory={factory}
              initialValues={inputSetTemplate}
              template={inputSetTemplate}
              readonly={true}
              type={inputSetTemplate?.type as StepType}
              stepViewType={StepViewType.InputSet}
              allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION, MultiTypeInputType.RUNTIME]}
            />
            {getMultiTypeFromValue(inputSetTemplate?.spec?.delegateSelectors) === MultiTypeInputType.RUNTIME && (
              <div className={cx(stepCss.formGroup, stepCss.sm)}>
                <MultiTypeDelegateSelector
                  inputProps={{ projectIdentifier, orgIdentifier }}
                  allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION, MultiTypeInputType.RUNTIME]}
                  label={getString('delegate.DelegateSelector')}
                  name={'spec.delegateSelectors'}
                  disabled={true}
                />
              </div>
            )}
          </Formik>
        </Layout.Vertical>
      ) : (
        <Layout.Vertical flex={{ align: 'center-center' }} className={css.sideContainer}>
          {loading && <PageSpinner />}
          {!loading && inputSetError && (
            <PageError className={css.error} message={inputSetError?.message} onClick={() => refetch()} />
          )}
          {!loading && !inputSetError && (
            <Heading level={2} font={{ weight: 'bold' }} color={Color.GREY_300}>
              This template has no inputs
            </Heading>
          )}
        </Layout.Vertical>
      )}
    </Container>
  )
}
