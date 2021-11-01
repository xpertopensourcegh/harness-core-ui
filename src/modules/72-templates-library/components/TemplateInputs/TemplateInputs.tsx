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
import { TemplateSummaryResponse, useGetTemplateInputSetYaml } from 'services/template-ng'
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
  selectedTemplate: TemplateSummaryResponse
  accountIdentifier: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export const TemplateInputs: React.FC<TemplateInputsProps> = props => {
  const { selectedTemplate, accountIdentifier, orgIdentifier, projectIdentifier } = props
  const { identifier, versionLabel } = selectedTemplate
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
    templateIdentifier: identifier || '',
    queryParams: {
      accountIdentifier,
      orgIdentifier,
      projectIdentifier,
      versionLabel: versionLabel || ''
    }
  })

  React.useEffect(() => {
    if (!loading) {
      try {
        const templateInput = parse(templateInputYaml?.data || '')
        setCount((JSON.stringify(templateInput).match(/<\+input>/g) || []).length)
        setInputSetTemplate(templateInput)
      } catch (error) {
        showError(error.message, undefined, 'template.parse.inputSet.error')
      }
    }
  }, [loading, templateInputYaml?.data])

  React.useEffect(() => {
    refetch()
  }, [identifier, versionLabel])

  return (
    <Container
      style={{ overflow: 'auto' }}
      height={'100%'}
      padding={{ top: 'xlarge', left: 'xxlarge', bottom: 'xlarge', right: 'xxlarge' }}
      className={css.container}
    >
      <Layout.Vertical flex={{ align: 'center-center' }} height={'100%'}>
        {loading && <PageSpinner />}
        {!loading && inputSetError && <PageError message={inputSetError?.message} onClick={() => refetch()} />}
        {!loading && !inputSetError && !inputSetTemplate && (
          <Heading level={2} font={{ weight: 'bold' }} color={Color.GREY_300}>
            This template has no inputs
          </Heading>
        )}
        {!loading && !inputSetError && inputSetTemplate && (
          <Container height={'100%'} width={'100%'} className={css.inputsContainer}>
            <Layout.Vertical spacing={'xlarge'}>
              <Container>
                <Layout.Horizontal flex={{ alignItems: 'center' }} spacing={'xxxlarge'}>
                  <Text font={{ size: 'normal', weight: 'bold' }} color={Color.GREY_800}>
                    {identifier}: {versionLabel}
                  </Text>
                  <Text className={css.inputsCount} font={{ size: 'small' }}>
                    {getString('templatesLibrary.inputsCount', { count })}
                  </Text>
                </Layout.Horizontal>
              </Container>
              <Container
                className={css.inputsCard}
                background={Color.WHITE}
                padding={'large'}
                margin={{ bottom: 'xxlarge' }}
              >
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
                    allowableTypes={[
                      MultiTypeInputType.FIXED,
                      MultiTypeInputType.EXPRESSION,
                      MultiTypeInputType.RUNTIME
                    ]}
                  />
                  {getMultiTypeFromValue(inputSetTemplate?.spec?.delegateSelectors) === MultiTypeInputType.RUNTIME && (
                    <div className={cx(stepCss.formGroup, stepCss.sm)}>
                      <MultiTypeDelegateSelector
                        inputProps={{ projectIdentifier, orgIdentifier }}
                        allowableTypes={[
                          MultiTypeInputType.FIXED,
                          MultiTypeInputType.EXPRESSION,
                          MultiTypeInputType.RUNTIME
                        ]}
                        label={getString('delegate.DelegateSelector')}
                        name={'spec.delegateSelectors'}
                        disabled={true}
                      />
                    </div>
                  )}
                </Formik>
              </Container>
            </Layout.Vertical>
          </Container>
        )}
      </Layout.Vertical>
    </Container>
  )
}
