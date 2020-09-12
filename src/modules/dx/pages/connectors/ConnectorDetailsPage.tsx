import React from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import cx from 'classnames'
import { useParams } from 'react-router'
import { Page } from 'modules/common/exports'
import { routeResources } from 'modules/common/routes'
import { routeParams } from 'framework/exports'
import { useGetConnector, ConnectorDTO, useUpdateConnector } from 'services/cd-ng'
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
  const { loading, data: connector, refetch } = useGetConnector({
    accountIdentifier: accountId,
    connectorIdentifier: connectorId as string
  })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: accountId })

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
        <span className={css.kubHeading}>{connector?.data?.name}</span>
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
              {Object.keys(categories).map((data, index) => {
                return (
                  <Tag
                    className={cx(css.tags, { [css.activeTag]: activeCategory === index })}
                    onClick={() => setActiveCategory(index)}
                    key={data + index}
                  >
                    {categories[data]}
                  </Tag>
                )
              })}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>
        {activeCategory === 0 ? (
          !loading && connector ? (
            <ConfigureConnector
              accountId={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              type={connector.data?.type || ''}
              updateConnector={updateConnector}
              connector={connector.data || ({} as ConnectorDTO)}
              refetchConnector={refetch}
              isCreationThroughYamlBuilder={connectorId === 'undefined'}
            />
          ) : (
            <PageSpinner />
          )
        ) : null}
        {activeCategory === 1 ? (
          !loading && connector ? (
            <ReferencedBy accountId={accountId} entityIdentifier={connector.data?.identifier} />
          ) : (
            <PageSpinner />
          )
        ) : null}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
