import React from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { StepPopover } from '@pipeline/components/PipelineStudio/StepPalette/StepPopover/StepPopover'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import type { StepElementConfig } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import type { TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import type { NGTemplateInfoConfig } from 'services/template-ng'
import type { StepData } from 'services/pipeline-ng'
import css from './StepTemplateDiagram.module.scss'

export interface StepTemplateDiagramProps extends TemplateProps<NGTemplateInfoConfig> {
  formik: FormikContext<NGTemplateInfoConfig>
}

const StepTemplateDiagram = (props: StepTemplateDiagramProps) => {
  const { openStepSelection, formik } = props
  const { getString } = useStrings()
  const [stepData, setStepData] = React.useState<StepData>()

  React.useEffect(() => {
    if (!!formik.values.name && !(formik.values.spec as StepElementConfig)?.type) {
      openStepSelector()
    }
  }, [formik.values.name])

  const openStepSelector = () => {
    openStepSelection?.(step => {
      formik.setFieldValue('spec.type', step.type)
    })
  }

  React.useEffect(() => {
    const stepType = (formik.values.spec as StepElementConfig)?.type
    if (stepType) {
      setStepData({ name: factory.getStepName(stepType) || '', type: stepType })
    }
  }, [(formik.values.spec as StepElementConfig)?.type])

  return (
    <Container
      className={css.container}
      background={Color.FORM_BG}
      width={'100%'}
      padding={{ left: 'xxxlarge', right: 'xxxlarge' }}
    >
      <Layout.Vertical height={'100%'} flex={{ justifyContent: 'center', alignItems: 'flex-start' }} spacing={'small'}>
        <Text font={{ size: 'small', weight: 'semi-bold' }} color={Color.GREY_600}>
          {getString('stepType')}
        </Text>
        <Container>
          <Layout.Horizontal
            spacing={'medium'}
            onClick={openStepSelector}
            flex={{ alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <StepPopover className={css.stepPalette} stepsFactory={factory} stepData={stepData} />
            <Text font={{ size: 'small', weight: 'semi-bold' }} color={Color.GREY_600}>
              {stepData?.name || ''}
            </Text>
          </Layout.Horizontal>
        </Container>
      </Layout.Vertical>
    </Container>
  )
}

export default connect<StepTemplateDiagramProps>(StepTemplateDiagram)
