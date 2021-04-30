import React from 'react'
import { Layout } from '@wings-software/uicore'
import SourceCodeManagerList from '@user-profile/components/UserSummary/SourceCodeManagerList'
import MyProjectsList from '@user-profile/components/UserSummary/MyProjectsList'

const UserSummaryTab: React.FC = () => {
  return (
    <Layout.Vertical spacing="large">
      <MyProjectsList />
      {/* <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.myGroups')}
      </Text> */}
      <SourceCodeManagerList />
      {/* <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('userProfile.myTools')}
      </Text> */}
    </Layout.Vertical>
  )
}

export default UserSummaryTab
