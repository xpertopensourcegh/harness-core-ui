import React from 'react'
import { AvatarGroup, Color, Icon, Layout, Text } from '@wings-software/uicore'
import { Link, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useGetOrganizationAggregateDTO } from 'services/cd-ng'
import OrgNavCardRenderer from '@projects-orgs/components/OrgNavCardRenderer/OrgNavCardRenderer'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import TagsRenderer from '@common/components/TagsRenderer/TagsRenderer'
import i18n from './OrganizationDetailsPage.i18n'
import css from './OrganizationDetailsPage.module.scss'

const OrganizationDetailsPage: React.FC = () => {
  const { accountId, orgIdentifier } = useParams()
  const { data, refetch } = useGetOrganizationAggregateDTO({
    identifier: orgIdentifier,
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { openCollaboratorModal } = useCollaboratorModal()

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
              {data?.data?.organizationResponse.organization.name}
            </Text>
            <Text font="small" lineClamp={2}>
              {data?.data?.organizationResponse.organization.description}
            </Text>
            <Layout.Horizontal padding={{ top: 'small' }}>
              <TagsRenderer tags={data?.data?.organizationResponse.organization.tags || {}}></TagsRenderer>
            </Layout.Horizontal>
          </Layout.Vertical>
        }
        content={
          <Layout.Vertical spacing="xsmall">
            <Layout.Horizontal flex={{ align: 'center-center' }} spacing="medium">
              <Icon name="nav-project-selected" size={30}></Icon>
              <Text font="medium">{data?.data?.projectsCount}</Text>
            </Layout.Horizontal>
            <Link to={`${routes.toProjects({ accountId })}?orgId=${orgIdentifier}`}>
              <Text>{i18n.viewProjects}</Text>
            </Link>
          </Layout.Vertical>
        }
        toolbar={
          <Layout.Horizontal padding="xxlarge">
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall" flex>
              <AvatarGroup
                avatars={data?.data?.admins?.length ? data.data.admins : [{}]}
                onAdd={event => {
                  event.stopPropagation()
                  openCollaboratorModal({ orgIdentifier })
                }}
              />
              <Text font="xsmall">{i18n.admin}</Text>
            </Layout.Vertical>
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall" flex>
              <AvatarGroup
                avatars={data?.data?.collaborators?.length ? data.data.collaborators : [{}]}
                onAdd={event => {
                  event.stopPropagation()
                  openCollaboratorModal({ orgIdentifier })
                }}
              />
              <Text font="xsmall">{i18n.collaborators}</Text>
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
