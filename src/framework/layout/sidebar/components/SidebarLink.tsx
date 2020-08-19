import { Link } from 'react-router-dom'
import { IconName, Text, Button, ButtonProps } from '@wings-software/uikit'
import cx from 'classnames'
import React from 'react'
import css from './SidebarLink.module.scss'

interface SidebarLinkProps {
  label: string
  href: string
  selected?: boolean
  icon?: IconName
  className?: string
}

type SidebarButtonProps = Omit<SidebarLinkProps, 'href'> & Omit<ButtonProps, 'href'>

export const SidebarLink: React.FC<SidebarLinkProps> = ({ label, href, selected, icon, className }) => (
  <Link className={cx(css.link, selected && css.selected, className)} to={href}>
    <Text icon={icon} className={css.text} inline>
      {label}
    </Text>
  </Link>
)

export const SidebarButton: React.FC<SidebarButtonProps> = ({ label, selected, icon, className, ...others }) => (
  <Button noStyling className={cx(css.button, css.link, selected && css.selected, className)} {...others}>
    <Text icon={icon} className={css.text} inline>
      {label}
    </Text>
  </Button>
)
