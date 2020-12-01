import React from 'react'
import { Color, Icon, IconName, Layout, Text } from '@wings-software/uikit'
import { Card } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import i18n from '@projects-orgs/pages/organizations/OrganizationDetails/OrganizationDetailsPage.i18n'
import css from './OrgNavCardRenderer.module.scss'

interface OrgNavCardProps {
  icon: IconName
  title: string
  description: string
  route: (orgIdentifier: string, accountId: string) => string
}

const options: OrgNavCardProps[] = [
  {
    icon: 'resources-icon',
    title: i18n.accessContolTitle,
    description: i18n.accessContolDescription,
    route: (orgIdentifier, accountId) => routes.toOrgResources({ orgIdentifier, accountId })
  },
  {
    icon: 'resources-icon',
    title: i18n.governanceTitle,
    description: i18n.governanceDescription,
    route: (orgIdentifier, accountId) => routes.toOrgGovernance({ orgIdentifier, accountId })
  },
  {
    icon: 'resources-icon',
    title: i18n.resourcesTitle,
    description: i18n.resourcesDescription,
    route: (orgIdentifier, accountId) => routes.toOrgResources({ orgIdentifier, accountId })
  },
  {
    icon: 'resources-icon',
    title: i18n.gitSyncTitle,
    description: i18n.gitSyncDescription,
    route: (orgIdentifier, accountId) => routes.toOrgGitSync({ orgIdentifier, accountId })
  }
]

const OrgNavCardRenderer: React.FC = () => {
  const { orgIdentifier, accountId } = useParams()
  const history = useHistory()
  return (
    <Layout.Horizontal spacing="medium" padding="huge">
      {options.map(option => (
        <Card
          key={option.title}
          className={css.card}
          onClick={() => {
            history.push(option.route(orgIdentifier, accountId))
          }}
        >
          <Layout.Vertical>
            <Layout.Horizontal spacing="medium" className={css.title}>
              <Icon size={20} name={option.icon}></Icon>
              <Text font={{ weight: 'bold' }} color={Color.BLACK}>
                {option.title}
              </Text>
            </Layout.Horizontal>
            <Text font="small">{option.description}</Text>
          </Layout.Vertical>
        </Card>
      ))}
    </Layout.Horizontal>
  )
}

export default OrgNavCardRenderer
