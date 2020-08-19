import React from 'react'
import { Position, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { Container, Heading, Color, Icon, Text, IconName } from '@wings-software/uikit'
import { Link } from 'react-router-dom'
import { Sidebar } from 'framework/exports'
import i18n from './AdminSelector.i18n'
import css from './AdminSelector.module.scss'

export interface AdminSelectorProps {
  selected?: boolean
}

export const AdminSelector: React.FC<AdminSelectorProps> = ({ children, selected }) => {
  return (
    <Sidebar.Button
      label={i18n.admin}
      icon="nav-settings"
      selected={selected}
      tooltip={
        <Container width={390} padding="medium">
          <Heading
            color={Color.WHITE}
            level={2}
            font={{ weight: 'semi-bold' }}
            padding="large"
            style={{ marginBottom: 'var(--spacing-large)' }}
          >
            {i18n.adminSelector}
          </Heading>
          <Container className={cx(css.grid, Classes.POPOVER_DISMISS)}>{children}</Container>
        </Container>
      }
      tooltipProps={{
        interactionKind: 'click',
        position: Position.RIGHT,
        className: css.btnContainer,
        minimal: true,
        portalClassName: css.portal
      }}
    />
  )
}

export interface AdminSelectorLinkProps {
  href: string
  label: string
  iconName: IconName
  selected?: boolean
}

export const AdminSelectorLink: React.FC<AdminSelectorLinkProps> = ({ href, label, iconName, selected }) => {
  const handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void = e => {
    ;(e.target as Element).closest('.' + css.link)?.parentElement?.click()
  }

  return (
    <Link className={cx(css.link, selected && css.selected)} to={href} onClick={handleLinkClick}>
      <Icon name={iconName} size={24} className={css.linkIcon} />
      <Text inline style={{ paddingTop: 'var(--spacing-medium)' }} className={css.text}>
        {label}
      </Text>
    </Link>
  )
}
