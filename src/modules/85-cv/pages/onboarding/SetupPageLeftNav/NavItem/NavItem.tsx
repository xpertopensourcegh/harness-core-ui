import React from 'react'
import { Icon, Container, Text, Color } from '@wings-software/uikit'
import cx from 'classnames'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import css from './NavItem.module.scss'

export interface NavItemProps {
  leftLogo: IconProps
  label: string
  status?: 'WARNING' | 'SUCCESS' | 'ERROR'
  className?: string
  isSelected?: boolean
  isHeaderItem?: boolean
  onClick?: (label: string) => void
}

function statusToIconProps(status: NavItemProps['status']): IconProps {
  switch (status) {
    case 'ERROR':
      return {
        name: 'error',
        size: 15,
        intent: 'danger'
      }
    case 'WARNING':
      return {
        name: 'warning-sign',
        size: 15,
        intent: 'warning'
      }
    case 'SUCCESS':
      return {
        name: 'tick-circle',
        size: 15,
        intent: 'success'
      }
    default:
      return { name: 'unresolve', size: 0 }
  }
}

export function NavItem(props: NavItemProps): JSX.Element {
  const { leftLogo, label, status, className, onClick, isSelected } = props
  return (
    <Container
      height={30}
      className={cx(css.main, isSelected ? css.selected : undefined, className)}
      onClick={() => onClick?.(label)}
    >
      <Icon {...leftLogo} />
      <Text color={Color.BLACK} className={css.itemLabel} lineClamp={1} width={170}>
        {label}
      </Text>
      {status && <Icon {...statusToIconProps(status)} data-name={status} />}
    </Container>
  )
}
