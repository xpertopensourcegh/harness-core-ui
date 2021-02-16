import React, { useState } from 'react'
import { Card, Color, Container, Icon, Layout, Text } from '@wings-software/uicore'

import { useParams } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { useGetRole } from 'services/rbac'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useGetResourceTypes } from 'services/cd-ng'
import PermissionCard from '@rbac/components/PermissionCard/PermissionCard'
import RbacFactory, { ResourceHandler } from '@rbac/factories/RbacFactory'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import css from './RoleDetails.module.scss'

const RoleDetails: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, roleIdentifier } = useParams()
  const [resource, setResource] = useState<[ResourceType, ResourceHandler]>()
  const { getString } = useStrings()
  const { data, loading, error, refetch } = useGetRole({
    identifier: roleIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  const { data: resourceGroups } = useGetResourceTypes({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier }
  })

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!data) return <></>
  return (
    <>
      <Page.Header
        size="xlarge"
        className={css.header}
        title={
          <Layout.Vertical>
            <Breadcrumbs links={[]} />
            <Layout.Horizontal flex spacing="medium">
              {/* TODO: REPLACE WITH ROLE ICON */}
              <Icon name="nav-project-selected" size={40} />
              <Layout.Vertical padding={{ left: 'medium' }} spacing="small">
                <Text color={Color.BLACK} font="medium">
                  {data.data?.role.name}
                </Text>
                <Text>{data.data?.role.description}</Text>
              </Layout.Vertical>
            </Layout.Horizontal>
          </Layout.Vertical>
        }
        toolbar={
          <Layout.Horizontal flex>
            <Layout.Vertical
              padding={{ right: 'small' }}
              border={{ right: true, color: Color.GREY_300 }}
              spacing="xsmall"
            >
              <Text>{getString('created')}</Text>
              <ReactTimeago date={data.data?.createdAt || ''} />
            </Layout.Vertical>
            <Layout.Vertical spacing="xsmall" padding={{ left: 'small' }}>
              <Text>{getString('lastUpdated')}</Text>
              <ReactTimeago date={data.data?.lastModifiedAt || ''} />
            </Layout.Vertical>
          </Layout.Horizontal>
        }
      />
      <Page.Body>
        <Layout.Horizontal className={css.body}>
          <Container className={css.resourceList} width="20%">
            <Layout.Vertical flex spacing="small">
              {resourceGroups?.data?.resourceTypes.map(resourceType => {
                const resourceHandler = RbacFactory.getResourceTypeHandler(resourceType)
                return (
                  resourceHandler && (
                    <Card
                      key={resourceType}
                      className={css.card}
                      onClick={() => {
                        setResource([resourceType, resourceHandler])
                      }}
                    >
                      <Layout.Horizontal flex spacing="small">
                        <Icon name={resourceHandler.icon} />
                        <Text color={Color.BLACK}>{resourceHandler.label} </Text>
                      </Layout.Horizontal>
                    </Card>
                  )
                )
              })}
            </Layout.Vertical>
          </Container>
          <Container padding="large" width="80%">
            {resource ? (
              <PermissionCard resourceType={resource[0]} resourceHandler={resource[1]} isDefault={data.data?.managed} />
            ) : (
              <Container flex={{ align: 'center-center' }} height="100%">
                <Text>{getString('selectResource')}</Text>
              </Container>
            )}
          </Container>
        </Layout.Horizontal>
      </Page.Body>
    </>
  )
}

export default RoleDetails
