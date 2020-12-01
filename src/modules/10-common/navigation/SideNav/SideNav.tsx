import React, { ReactElement } from 'react'
import cx from 'classnames'
import type { IconName } from '@blueprintjs/core'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'
import { Text, Layout, Color } from '@wings-software/uikit'
import css from './SideNav.module.scss'

export interface SideNavProps {
  subtitle?: string
  title?: string
}

export default function SideNav(props: React.PropsWithChildren<SideNavProps>): ReactElement {
  return (
    <div className={css.main}>
      <div>{props.children}</div>
      {props.title ? (
        <div className={css.titleContainer}>
          <Layout.Vertical>
            {props.subtitle ? (
              <Text font={{ size: 'small' }} color={Color.WHITE}>
                {props.subtitle}
              </Text>
            ) : null}
            {props.title ? (
              <Text color={Color.WHITE} className={css.title}>
                {props.title}
              </Text>
            ) : null}
          </Layout.Vertical>
        </div>
      ) : null}
    </div>
  )
}

interface SidebarLinkProps extends NavLinkProps {
  label: string
  icon?: IconName
  className?: string
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, className, ...others }) => (
  <Link className={cx(css.link, className)} activeClassName={css.selected} {...others}>
    <Text icon={icon} className={css.text}>
      {label}
    </Text>
  </Link>
)
