import React from 'react'
import { Color, Icon, Layout, Tag, Text } from '@wings-software/uikit'
import { Link, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useGetOrganization } from 'services/cd-ng'
import OrgNavCardRenderer from '@projects-orgs/components/OrgNavCardRenderer/OrgNavCardRenderer'
import i18n from './OrganizationDetailsPage.i18n'
import css from './OrganizationDetailsPage.module.scss'

const OrganizationDetailsPage: React.FC = () => {
  const { accountId, orgIdentifier } = useParams()
  const { data, refetch } = useGetOrganization({
    identifier: orgIdentifier,
    queryParams: {
      accountIdentifier: accountId
    }
  })
  return (
    <>
      <Page.Header
        size="xlarge"
        title={
          <Layout.Vertical spacing="small" padding="medium" className={css.title}>
            <Layout.Horizontal>
              <Link to={routes.toOrganizations({ accountId })}>
                <Text font="small" color={Color.BLUE_600}>
                  {i18n.manage}
                </Text>
              </Link>
            </Layout.Horizontal>
            <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK}>
              {data?.data?.name}
            </Text>
            <Text font="small" lineClamp={2}>
              {data?.data?.description}
            </Text>
            {data?.data?.tags ? (
              <Layout.Horizontal padding={{ top: 'small' }} className={css.wrap}>
                {Object.keys(data.data.tags).map(key => {
                  const value = data?.data?.tags?.[key]
                  return (
                    <Tag className={css.cardTags} key={key}>
                      {value ? `${key}:${value}` : key}
                    </Tag>
                  )
                })}
              </Layout.Horizontal>
            ) : null}
          </Layout.Vertical>
        }
        content={
          <Layout.Vertical spacing="xsmall">
            <Layout.Horizontal flex={{ align: 'center-center' }} spacing="medium">
              <Icon name="nav-project-selected" size={30}></Icon>
              <Text font="medium">{i18n.numberOfProjects}</Text>
            </Layout.Horizontal>
            <Link to={`${routes.toProjects({ accountId })}?orgId=${orgIdentifier}`}>
              <Text>{i18n.viewProjects}</Text>
            </Link>
          </Layout.Vertical>
        }
        toolbar={
          <Layout.Horizontal padding="xxlarge">
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall">
              <Icon name="main-user-groups" size={20} />
              <Text font="xsmall">{i18n.admin.toUpperCase()}</Text>
            </Layout.Vertical>
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall">
              <Icon name="main-user-groups" size={20} />
              <Text font="xsmall">{i18n.collaborators.toUpperCase()}</Text>
            </Layout.Vertical>
          </Layout.Horizontal>
        }
        className={css.header}
      />
      <Page.Body
        retryOnError={() => {
          refetch()
        }}
      >
        <OrgNavCardRenderer />
      </Page.Body>
    </>
  )
}

export default OrganizationDetailsPage
