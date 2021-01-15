import React from 'react'
import { Button, Utils } from '@wings-software/uicore'

import { String } from 'framework/exports'
import css from './CopyText.module.scss'

export interface CopyTextProps {
  children: React.ReactNode
  className?: string
  textToCopy: string
}

export function CopyText(props: CopyTextProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false)

  function handleClick(): void {
    Utils.copy(props.textToCopy)
    setCopied(true)
  }

  function onClosed(): void {
    setCopied(false)
  }

  return (
    <div className={css.main}>
      <div className={css.text}>{props.children}</div>
      <Button
        icon="copy"
        minimal
        intent="primary"
        small
        className={css.copyIcon}
        tooltip={<String className={css.tooltip} stringID={copied ? 'copiedToClipboard' : 'clickToCopy'} />}
        tooltipProps={{ wrapperTagName: 'div', className: css.btnWrapper, onClosed }}
        onClick={handleClick}
      />
    </div>
  )
}
