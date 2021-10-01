import React from 'react'
import { Template, TemplateColorMap, TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import { TemplateType } from '@templates-library/utils/templatesUtils'
import type { StepElementConfig } from 'services/cd-ng'
import StepTemplateDiagram, {
  StepTemplateDiagramProps
} from '@templates-library/components/TemplateStudio/StepTemplate/StepTemplateDiagram/StepTemplateDiagram'
import { StepTemplateFormWithRef } from '@templates-library/components/TemplateStudio/StepTemplate/StepTemplateForm/StepTemplateForm'

export class StepTemplate extends Template<StepElementConfig> {
  renderTemplateDiagram(props: StepTemplateDiagramProps): JSX.Element {
    return <StepTemplateDiagram {...props} />
  }

  renderTemplateForm(props: TemplateProps<StepElementConfig>): JSX.Element {
    const { formikRef, ...rest } = props
    return <StepTemplateFormWithRef ref={formikRef} {...rest} />
  }

  protected type = TemplateType.Step
  protected name = 'Step Template'

  protected primaryColorMap: TemplateColorMap = {
    primary: '#7D4DD3',
    secondary: '#6938C0',
    text: '#EADEFF'
  }

  protected secondaryColorMap: TemplateColorMap = {
    primary: '#E1D0FF',
    secondary: '#EADEFF',
    text: '#592BAA'
  }

  protected defaultValues: StepElementConfig = {
    name: 'Template name',
    identifier: 'Template_name',
    type: 'ShellScript'
  }
}
