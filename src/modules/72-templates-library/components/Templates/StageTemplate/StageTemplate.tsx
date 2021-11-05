import React from 'react'
import { Color } from '@wings-software/uicore'
import { Template, TemplateProps } from '@templates-library/components/AbstractTemplate/Template'
import { TemplateType } from '@templates-library/utils/templatesUtils'
import type { NGTemplateInfoConfig } from 'services/template-ng'
import { StageTemplateCanvasWrapperWithRef } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateCanvasWrapper'

export class StageTemplate extends Template<NGTemplateInfoConfig> {
  protected type = TemplateType.Stage
  protected name = 'Stage Template'
  protected color = Color.TEAL_700

  protected defaultValues: NGTemplateInfoConfig = {
    name: 'Template name',
    identifier: 'Template_name',
    versionLabel: '',
    type: 'Stage'
  }

  renderTemplateCanvas(props: TemplateProps<NGTemplateInfoConfig>): JSX.Element {
    return <StageTemplateCanvasWrapperWithRef ref={props.formikRef} />
  }
}
