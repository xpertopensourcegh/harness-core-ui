import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { tooltipDictionary, TooltipEditor } from '@wings-software/ng-tooltip'

interface NGTooltipEditorPortalInterface {
  onEditorClose: () => void
  showTooltipEditor: boolean
}

const EditorContent = ({ onEditorClose }: NGTooltipEditorPortalInterface) => {
  const ngTooltipEditorPortalRoot = document.getElementById('ngTooltipEditorRootParent')
  const portalChild = document.createElement('div')
  if (ngTooltipEditorPortalRoot) {
    ngTooltipEditorPortalRoot.appendChild(portalChild)
    portalChild.id = 'ngTooltipEditorRoot'
    portalChild.className = 'ngTooltipEditorWrapper'
  }
  useEffect(() => {
    return () => ngTooltipEditorPortalRoot?.removeChild(portalChild) as void
  }, [])

  return ReactDOM.createPortal(
    <TooltipEditor onClose={onEditorClose} tooltipDictionary={tooltipDictionary} />,
    portalChild
  )
}

export const NGTooltipEditorPortal = ({ onEditorClose, showTooltipEditor }: NGTooltipEditorPortalInterface) => {
  if (!showTooltipEditor) {
    return null
  }

  return <EditorContent onEditorClose={onEditorClose} showTooltipEditor={showTooltipEditor} />
}
