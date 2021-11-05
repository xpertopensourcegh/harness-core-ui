import React from 'react'
import SplitPane from 'react-split-pane'
import { debounce } from 'lodash-es'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'
import { StageTemplateFormWithRef } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateForm/StageTemplateForm'
import { StageTemplateDiagram } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateDiagram/StageTemplateDiagram'
import { RightDrawer } from '@pipeline/components/PipelineStudio/RightDrawer/RightDrawer'
import { TemplateDrawer } from '@templates-library/components/TemplateDrawer/TemplateDrawer'

const StageTemplateCanvas = (_props: unknown, formikRef: TemplateFormRef): JSX.Element => {
  const [splitPaneSize, setSplitPaneSize] = React.useState(200)
  const setSplitPaneSizeDeb = React.useRef(debounce(setSplitPaneSize, 200))
  const handleStageResize = (size: number): void => {
    setSplitPaneSizeDeb.current(size)
  }
  const resizerStyle = navigator.userAgent.match(/firefox/i)
    ? { display: 'flow-root list-item' }
    : { display: 'inline-table' }

  return (
    <>
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
        <StageTemplateDiagram />
        <StageTemplateFormWithRef ref={formikRef} />
      </SplitPane>
      <RightDrawer />
      <TemplateDrawer />
    </>
  )
}

export const StageTemplateCanvasWithRef = React.forwardRef(StageTemplateCanvas)
