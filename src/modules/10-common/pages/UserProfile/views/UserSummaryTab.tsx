import React from 'react'
import { Text, Layout, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

const UserSummaryTab: React.FC = () => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="large">
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.myProjects')}
      </Text>
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.myGroups')}
      </Text>
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.mysourceCodeManagers')}
      </Text>
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.myTools')}
      </Text>
    </Layout.Vertical>
  )
}

export default UserSummaryTab
