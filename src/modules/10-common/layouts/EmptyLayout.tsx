import React from 'react'

import css from './layouts.module.scss'

export function EmptyLayout(props: React.PropsWithChildren<{}>): React.ReactElement {
  return (
    <div className={css.children} data-layout="empty">
      {props.children}
    </div>
  )
}
