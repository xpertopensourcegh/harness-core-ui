import React from 'react'
import SplitPane from 'react-split-pane'
import { debounce } from 'lodash-es'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'
import { StepTemplateFormWithRef } from '@templates-library/components/TemplateStudio/StepTemplateCanvas/StepTemplateForm/StepTemplateForm'
import { StepTemplateDiagram } from '@templates-library/components/TemplateStudio/StepTemplateCanvas/StepTemplateDiagram/StepTemplateDiagram'

const StepTemplateCanvas = (_props: unknown, formikRef: TemplateFormRef) => {
  const [splitPaneSize, setSplitPaneSize] = React.useState(200)
  const setSplitPaneSizeDeb = React.useRef(debounce(setSplitPaneSize, 200))
  const handleStageResize = (size: number): void => {
    setSplitPaneSizeDeb.current(size)
  }
  const resizerStyle = navigator.userAgent.match(/firefox/i)
    ? { display: 'flow-root list-item' }
    : { display: 'inline-table' }

  return (
    <SplitPane
      size={splitPaneSize}
      split="horizontal"
      minSize={160}
      maxSize={300}
      style={{ overflow: 'auto' }}
      pane2Style={{ overflow: 'initial', zIndex: 2 }}
      resizerStyle={resizerStyle}
      onChange={handleStageResize}
    >
      <StepTemplateDiagram />
      <StepTemplateFormWithRef ref={formikRef} />
    </SplitPane>
  )
}

export const StepTemplateCanvasWithRef = React.forwardRef(StepTemplateCanvas)
