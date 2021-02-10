import React from 'react'
import { Color, Icon, Layout, Text } from '@wings-software/uicore'

import { useParams } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { useGetRole } from 'services/rbac'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import css from './RoleDetails.module.scss'

const RoleDetails: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, roleIdentifier } = useParams()
  const { getString } = useStrings()
  const { data, loading, error, refetch } = useGetRole({
    identifier: roleIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
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
    </>
  )
}

export default RoleDetails
