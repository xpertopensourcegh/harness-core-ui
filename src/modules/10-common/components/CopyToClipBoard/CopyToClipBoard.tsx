import React from 'react'
import { Position, PopoverInteractionKind } from '@blueprintjs/core'
import { Popover } from '@blueprintjs/core'
import { Icon } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

import css from './CopyToClipBoard.module.scss'

interface CopyToClipboardProps {
  content: string
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = props => {
  const { getString } = useStrings()
  const getPopoverContent = (): JSX.Element => {
    return (
      <div className={css.popoverContent}>
        <span className={css.tooltipLabel}>{getString('snippets.copyToClipboard')} </span>
      </div>
    )
  }
  return (
    <>
      <Popover
        minimal
        position={Position.BOTTOM}
        interactionKind={PopoverInteractionKind.HOVER}
        content={getPopoverContent()}
        //   onOpening={() => setTooltipLabel(getString('snippets.copyToClipboard'))}
      >
        <div>
          <Icon
            name="copy"
            size={20}
            onClick={async (event: React.MouseEvent<HTMLHeadingElement, globalThis.MouseEvent>) => {
              event.preventDefault()
              event.stopPropagation()
              navigator?.clipboard?.writeText(props?.content)
            }}
            className={css.copyIcon}
          />
        </div>
      </Popover>
    </>
  )
}

export default CopyToClipboard
