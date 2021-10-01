import React from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { StepPopover } from '@pipeline/components/PipelineStudio/StepPalette/StepPopover/StepPopover'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import type { StepElementConfig } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import type { TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import css from './StepTemplateDiagram.module.scss'

export interface StepTemplateDiagramProps extends TemplateProps<StepElementConfig> {
  formik: FormikContext<StepElementConfig>
}

const StepTemplateDiagram = (props: StepTemplateDiagramProps) => {
  const { openStepSelection, formik } = props
  const { getString } = useStrings()

  React.useEffect(() => {
    if (!formik.values?.type) {
      openStepSelector()
    }
  }, [formik.values])

  const openStepSelector = () => {
    openStepSelection?.(step => {
      formik.setValues({ ...step, type: step.type })
    })
  }

  const stepData = {
    ...(!!formik.values?.type && { name: factory.getStepName(formik.values.type) || '', type: formik.values.type })
  }

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
            onClick={() => openStepSelector()}
            flex={{ alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <StepPopover className={css.stepPalette} stepsFactory={factory} stepData={stepData} />
            <Text font={{ size: 'small', weight: 'semi-bold' }} color={Color.GREY_600}>
              {stepData.name}
            </Text>
          </Layout.Horizontal>
        </Container>
      </Layout.Vertical>
    </Container>
  )
}

export default connect<StepTemplateDiagramProps>(StepTemplateDiagram)
