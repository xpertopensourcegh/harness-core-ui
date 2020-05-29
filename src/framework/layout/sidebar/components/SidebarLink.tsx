import { IconName, Link, Text } from '@wings-software/uikit'
import cx from 'classnames'
import React from 'react'
import css from './SidebarLink.module.scss'

interface SidebarLinkProps {
  label: string
  href: string
  selected?: boolean
  icon?: IconName
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ label, href, selected, icon }) => (
  <Link noStyling className={cx(css.link, selected && css.selected)} href={href}>
    <Text icon={icon} className={css.text} inline>
      {label}
    </Text>
  </Link>
)
