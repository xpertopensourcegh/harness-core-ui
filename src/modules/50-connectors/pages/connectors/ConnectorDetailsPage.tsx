import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import cx from 'classnames'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Page } from 'modules/10-common/exports'
import { PageSpinner } from 'modules/10-common/components/Page/PageSpinner'
import { useGetConnector, ConnectorResponse, useUpdateConnector } from 'services/cd-ng'

import ActivityHistory from '@connectors/components/activityHistory/ActivityHistory/ActivityHistory'

import ReferencedBy from './ReferencedBy/ReferencedBy'
import ConnectorView from './ConnectorView'
import i18n from './ConnectorDetailsPage.i18n'
import css from './ConnectorDetailsPage.module.scss'

interface Categories {
  [key: string]: string
}

const categories: Categories = {
  connection: i18n.connection,
  refrencedBy: i18n.refrencedBy,
  activityHistory: i18n.activityHistory
}

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const { connectorId, accountId, orgIdentifier, projectIdentifier } = useParams()
  const { pathname } = useLocation()
  const { loading, data, refetch } = useGetConnector({
    identifier: connectorId as string,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const renderTitle = () => {
    return (
      <Layout.Vertical>
        <Layout.Horizontal spacing="xsmall">
          <Link className={css.breadCrumb} to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>
            {i18n.Resources}
          </Link>
          <span>/</span>
          <Link className={css.breadCrumb} to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>
            {i18n.Connectors}
          </Link>
        </Layout.Horizontal>
        <span className={css.kubHeading}>{data?.data?.connector?.name}</span>
      </Layout.Vertical>
    )
  }
  return (
    <>
      <Page.Header
        title={renderTitle()}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              {Object.keys(categories).map((item, index) => {
                return (
                  <Tag
                    className={cx(css.tags, { [css.activeTag]: activeCategory === index })}
                    onClick={() => setActiveCategory(index)}
                    key={item + index}
                  >
                    {categories[item]}
                  </Tag>
                )
              })}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>
        {activeCategory === 0 ? (
          !loading && data?.data?.connector?.type ? (
            <ConnectorView
              type={data.data.connector.type}
              updateConnector={updateConnector}
              response={data.data || ({} as ConnectorResponse)}
              refetchConnector={refetch}
            />
          ) : (
            <PageSpinner />
          )
        ) : null}
        {activeCategory === 1 ? (
          !loading && data ? (
            <ReferencedBy accountId={accountId} entityIdentifier={data.data?.connector?.identifier} />
          ) : (
            <PageSpinner />
          )
        ) : null}
        {activeCategory === 2 ? (
          !loading && data ? (
            <ActivityHistory entityIdentifier={data.data?.connector?.identifier || ''} />
          ) : (
            <PageSpinner />
          )
        ) : null}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
