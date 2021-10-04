import React from 'react'
import { Color } from '@wings-software/uicore'
import { Template, TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import { TemplateType } from '@templates-library/utils/templatesUtils'
import StepTemplateDiagram, {
  StepTemplateDiagramProps
} from '@templates-library/components/TemplateStudio/StepTemplate/StepTemplateDiagram/StepTemplateDiagram'
import { StepTemplateFormWithRef } from '@templates-library/components/TemplateStudio/StepTemplate/StepTemplateForm/StepTemplateForm'
import type { NGTemplateInfoConfig } from 'services/template-ng'

export class StepTemplate extends Template<NGTemplateInfoConfig> {
  renderTemplateDiagram(props: StepTemplateDiagramProps): JSX.Element {
    return <StepTemplateDiagram {...props} />
  }

  renderTemplateForm(props: TemplateProps<NGTemplateInfoConfig>): JSX.Element {
    const { formikRef, ...rest } = props
    return <StepTemplateFormWithRef ref={formikRef} {...rest} />
  }

  protected type = TemplateType.Step
  protected name = 'Step Template'
  protected color = Color.PURPLE_700

  protected defaultValues: NGTemplateInfoConfig = {
    name: 'Template name',
    identifier: 'Template_name',
    versionLabel: '',
    type: 'Step'
  }
}
