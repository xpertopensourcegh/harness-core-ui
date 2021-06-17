import React, { AnchorHTMLAttributes, ReactElement, Fragment } from 'react'
import { Classes, IMenuItemProps, Menu } from '@blueprintjs/core'
import { Button, ButtonProps } from '@wings-software/uicore'
import RbacMenuItem from '@rbac/components/MenuItem/MenuItem'
import type { RbacMenuItemProps } from '@rbac/components/MenuItem/MenuItem'

type Item = ((IMenuItemProps | RbacMenuItemProps) & AnchorHTMLAttributes<HTMLAnchorElement>) | '-'

export interface RbacOptionsMenuButtonProps extends ButtonProps {
  items: Item[]
}

const RbacOptionsMenuButton = ({ items, ...props }: RbacOptionsMenuButtonProps): ReactElement => (
  <Button
    minimal
    icon="Options"
    tooltipProps={{ isDark: true, interactionKind: 'click', hasBackdrop: true }}
    tooltip={
      <Menu style={{ minWidth: 'unset' }}>
        {items.map((item: Item, key: number) => (
          <Fragment key={key}>
            {item === '-' ? (
              <Menu.Divider />
            ) : (item as RbacMenuItemProps)?.permission ? (
              <RbacMenuItem className={Classes.POPOVER_DISMISS} {...(item as RbacMenuItemProps)} />
            ) : (
              <Menu.Item className={Classes.POPOVER_DISMISS} {...item} />
            )}
          </Fragment>
        ))}
      </Menu>
    }
    {...props}
  />
)

export default RbacOptionsMenuButton
