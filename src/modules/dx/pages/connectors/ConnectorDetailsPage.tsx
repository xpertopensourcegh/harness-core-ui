import React from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import cx from 'classnames'
import { useParams } from 'react-router'
import { Page } from 'modules/common/exports'
import { routeResources } from 'modules/common/routes'
import { routeParams } from 'framework/exports'
import { useGetConnector, ConnectorResponse, useUpdateConnector } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import ReferencedBy from './ReferencedBy/ReferencedBy'
import ConfigureConnector from './ConfigureConnector'
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
  const {
    params: { connectorId }
  } = routeParams()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { loading, data, refetch } = useGetConnector({
    identifier: connectorId as string,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgIdentifier,
      projectIdentifier: projectIdentifier
    }
  })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const renderTitle = () => {
    return (
      <Layout.Vertical>
        <Layout.Horizontal spacing="xsmall">
          <Link className={css.breadCrumb} href={routeResources.url()}>
            {i18n.Resources}
          </Link>
          <span>/</span>
          <Link className={css.breadCrumb} href={routeResources.url()}>
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
          !loading && data ? (
            <ConfigureConnector
              type={data.data?.connector?.type || ''}
              updateConnector={updateConnector}
              response={data.data || ({} as ConnectorResponse)}
              refetchConnector={refetch}
              isCreationThroughYamlBuilder={connectorId === 'undefined'}
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
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
