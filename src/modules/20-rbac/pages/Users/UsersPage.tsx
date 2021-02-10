import React from 'react'
import { Button, ExpandingSearchInput, Layout } from '@wings-software/uicore'
import { noop } from 'lodash-es'

import { useStrings } from 'framework/exports'
import { PageHeader } from '@common/components/Page/PageHeader'

const UsersPage: React.FC = () => {
  const { getString } = useStrings()
  return (
    <>
      <PageHeader
        title={
          <Layout.Horizontal padding={{ left: 'large' }}>
            <Button text={getString('users')} intent="primary" icon="plus" onClick={noop} />
          </Layout.Horizontal>
        }
        toolbar={
          <Layout.Horizontal margin={{ right: 'small' }} height="xxxlarge">
            <ExpandingSearchInput placeholder={getString('usersPage.search')} />
          </Layout.Horizontal>
        }
      />
    </>
  )
}

export default UsersPage
