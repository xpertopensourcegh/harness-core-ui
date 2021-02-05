import React from 'react'
import { Layout, Text } from '@wings-software/uicore'

import { useStrings } from 'framework/exports'

const UserGroups: React.FC = () => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical flex>
      <Text>{getString('tbd')}</Text>
    </Layout.Vertical>
  )
}

export default UserGroups
