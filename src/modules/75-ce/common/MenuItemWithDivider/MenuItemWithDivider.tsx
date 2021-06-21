import React from 'react'
import { Text, Layout } from '@wings-software/uicore'

import css from './MenuItemWithDivider.module.scss'

const MenuItemWithDivider: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Layout.Horizontal
      spacing="small"
      padding={{
        left: 'small',
        right: 'small'
      }}
    >
      <Text font="small">
        <div className={css.menuItemDividerText}>{text}</div>
      </Text>
      <div className={css.divider} />
    </Layout.Horizontal>
  )
}

export default MenuItemWithDivider
