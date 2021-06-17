import React, { createContext, ReactElement, useState } from 'react'
import { Icon } from '@wings-software/uicore'
import CostUsageReportExtention from './steps/CostUsageReportExtenstion'
import CrossAccountRoleExtension from './steps/CrossAccountRoleExtension'
import css from './DialogExtension.module.scss'

export type ExtentionWindow = 'CrossAccountEx' | 'CostUsageEx'
interface ChildrenProps {
  triggerExtension: (exWindow: ExtentionWindow) => void
  closeExtension: () => void
}

interface ExtensionProps {
  dialogStyles?: { width?: number; height?: number }
  renderExtension?: ReactElement | React.FC
}

export const DialogExtensionContext = createContext<ChildrenProps>({
  triggerExtension: () => undefined,
  closeExtension: () => undefined
})

interface SelectExtentionProps {
  exWindow: ExtentionWindow
}

const SelectExtention: React.FC<SelectExtentionProps> = props => {
  const { exWindow } = props
  switch (exWindow) {
    case 'CrossAccountEx':
      return <CrossAccountRoleExtension />
    case 'CostUsageEx':
      return <CostUsageReportExtention />
  }
}

const DialogExtension: React.FC<ExtensionProps> = props => {
  const [showExtension, setShowExtension] = useState<boolean>(false)
  const [exWindow, setExWindow] = useState<ExtentionWindow>('CostUsageEx')
  const triggerExtension = (data: ExtentionWindow) => {
    setExWindow(data)
    setShowExtension(true)
  }
  const closeExtension = () => setShowExtension(false)
  return (
    <div style={{ display: 'flex', height: props.dialogStyles?.height || 640 }}>
      <div style={{ width: props.dialogStyles?.width || 1050, position: 'relative' }}>
        <DialogExtensionContext.Provider value={{ triggerExtension, closeExtension }}>
          {props.children}
        </DialogExtensionContext.Provider>
      </div>
      {showExtension && (
        <div className={css.extension}>
          <div>
            <SelectExtention exWindow={exWindow} />
          </div>
          <span className={css.closeBtn} onClick={() => setShowExtension(false)}>
            <Icon name={'caret-left'} />
          </span>
        </div>
      )}
    </div>
  )
}

export default DialogExtension
