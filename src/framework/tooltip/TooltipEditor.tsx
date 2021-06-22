import React from 'react'
import ReactDOM from 'react-dom'
import { tooltipDictionary, TooltipEditor } from '@wings-software/ng-tooltip'

interface NGTooltipEditorPortalInterface {
  onEditorClose: () => void
  showTooltipEditor: boolean
}

export const NGTooltipEditorPortal = ({ onEditorClose, showTooltipEditor }: NGTooltipEditorPortalInterface) => {
  if (!showTooltipEditor) {
    return null
  }

  const ngTooltipEditorPortalRoot = document.getElementById('ngTooltipEditorRootParent')
  return ReactDOM.createPortal(
    <TooltipEditor onClose={onEditorClose} tooltipDictionary={tooltipDictionary} />,
    ngTooltipEditorPortalRoot!
  )
}
