import React from 'react'
import { IconName, Menu, Position } from '@blueprintjs/core'
import { Popover } from '@wings-software/uicore'
import type { PopoverProps } from '@wings-software/uicore/dist/components/Popover/Popover'
import css from './TemplatesActionPopover.module.scss'

export interface TemplatesActionPopoverProps extends PopoverProps {
  open?: boolean
  items?: {
    icon?: IconName
    label: string
    disabled?: boolean
    onClick: () => void
  }[]
  setMenuOpen: (flag: boolean) => void
  className?: string
}
export const TemplatesActionPopover = (props: React.PropsWithChildren<TemplatesActionPopoverProps>) => {
  const { items, open, children, setMenuOpen, className, content, ...popoverProps } = props

  return (
    <Popover
      isOpen={open}
      onInteraction={nextOpenState => {
        setMenuOpen(nextOpenState)
      }}
      position={Position.BOTTOM_RIGHT}
      className={className}
      popoverClassName={css.popOver}
      {...popoverProps}
    >
      {children}
      {content ? (
        content
      ) : items ? (
        <Menu style={{ minWidth: 'unset' }} onClick={e => e.stopPropagation()}>
          {items?.map(item => {
            return (
              <Menu.Item
                icon={item.icon}
                text={item.label}
                disabled={item.disabled}
                key={item.label}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  item.onClick()
                  setMenuOpen(false)
                }}
              />
            )
          })}
        </Menu>
      ) : null}
    </Popover>
  )
}
