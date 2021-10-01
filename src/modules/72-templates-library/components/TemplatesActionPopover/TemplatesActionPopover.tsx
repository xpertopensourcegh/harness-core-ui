import React from 'react'
import { IconName, Menu, Position } from '@blueprintjs/core'
import { Popover } from '@wings-software/uicore'
import type { PopoverProps } from '@wings-software/uicore/dist/components/Popover/Popover'

export interface TemplatesActionPopoverProps extends PopoverProps {
  open?: boolean
  items?: {
    icon?: IconName
    text: string
    onClick: () => void
  }[]
  setMenuOpen: (flag: boolean) => void
  className?: string
}
export const TemplatesActionPopover = (props: React.PropsWithChildren<TemplatesActionPopoverProps>) => {
  const { items, open, children, setMenuOpen, className, ...popoverProps } = props

  return (
    <Popover
      isOpen={open}
      onInteraction={nextOpenState => {
        setMenuOpen(nextOpenState)
      }}
      position={Position.BOTTOM_RIGHT}
      className={className}
      {...popoverProps}
    >
      {children}
      <Menu style={{ minWidth: 'unset' }} onClick={e => e.stopPropagation()}>
        {items?.map(item => {
          return (
            <Menu.Item
              icon={item.icon}
              text={item.text}
              key={item.text}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                item.onClick()
                setMenuOpen(false)
              }}
            />
          )
        })}
      </Menu>
    </Popover>
  )
}
