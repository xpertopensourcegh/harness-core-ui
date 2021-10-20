import React from 'react'
import { Menu, Position } from '@blueprintjs/core'
import { Popover, Icon, IconName } from '@wings-software/uicore'
import type { PopoverProps } from '@wings-software/uicore/dist/components/Popover/Popover'
import cx from 'classnames'
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
              <li
                key={item.label}
                className={cx(css.menuItem, { [css.disabled]: item.disabled })}
                onClick={e => {
                  e.stopPropagation()
                  if (!item.disabled) {
                    item.onClick()
                    setMenuOpen(false)
                  }
                }}
              >
                {item.icon && <Icon name={item.icon} size={12} />}
                {item.label}
              </li>
            )
          })}
        </Menu>
      ) : null}
    </Popover>
  )
}
