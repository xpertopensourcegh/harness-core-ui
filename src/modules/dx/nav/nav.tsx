import { Icon, Link } from '@wings-software/uikit'
import React from 'react'
import css from './Nav.module.scss'

const ICON_SIZE = 24

export const Nav: React.FC = () => {
  return (
    <Link noStyling href="/dashboard" className={css.moduleItem}>
      <Icon name="harness" size={ICON_SIZE} />
    </Link>
  )
}

// module: DX
// component: the button
// nav: DXNav
