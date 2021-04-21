import React from 'react'
import { Text, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

const UserPreferencesPage: React.FC = () => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical flex>
      <Text>{getString('tbd')}</Text>
    </Layout.Vertical>
  )
}

export default UserPreferencesPage
