import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { Icon } from '@wings-software/uicore'
import css from './Breadcrumbs.module.scss'

export interface Breadcrumb {
  url: string
  label: string
}
export interface BreadcrumbsProps {
  links: Breadcrumb[]
  className?: string
}
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links = [], className = '' }) => {
  return (
    <div className={cx(className, css.breadcrumbs)}>
      {links.map((link: Breadcrumb, index: number) => (
        <div key={index}>
          {index === links.length - 1 ? (
            <span className={css.lastBreadcrumb}>{link.label}</span>
          ) : (
            <Link className={css.breadcrumb} to={link.url}>
              {link.label}
            </Link>
          )}
          {index !== links.length - 1 && <Icon size={11} name="main-chevron-right" className={css.separator} />}
        </div>
      ))}
    </div>
  )
}
