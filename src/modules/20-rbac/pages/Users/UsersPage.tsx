import React from 'react'
import { Button, ExpandingSearchInput, Layout } from '@wings-software/uicore'
import { noop } from 'lodash-es'

import { useStrings } from 'framework/exports'
import css from './UsersPage.module.scss'

const UsersPage: React.FC = () => {
  const { getString } = useStrings()
  return (
    <>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal width="75%">
          <Button text="Users" intent="primary" icon="plus" onClick={noop} />
        </Layout.Horizontal>

        <Layout.Horizontal spacing="small" width="25%">
          <ExpandingSearchInput placeholder={getString('usersPage.search')} className={css.search} />
        </Layout.Horizontal>
      </Layout.Horizontal>
    </>
  )
}

export default UsersPage
