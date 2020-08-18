import React, { useEffect } from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import cx from 'classnames'
import { useParams } from 'react-router'
import { Page } from 'modules/common/exports'
import { routeResources } from 'modules/common/routes'
import { linkTo } from 'framework/exports'
import { routeParams } from 'framework/exports'
import { useGetConnector, ConnectorDTO } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { buildKubFormData } from './utils/ConnectorUtils'
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

const renderTitle = () => {
  return (
    <Layout.Vertical>
      <Layout.Horizontal spacing="xsmall">
        <Link className={css.breadCrumb} href={linkTo(routeResources)}>
          Resources
        </Link>
        <span>/</span>
        <Link className={css.breadCrumb} href={linkTo(routeResources)}>
          Connectors
        </Link>
      </Layout.Horizontal>
      <span className={css.kubHeading}>Connector Details</span>
    </Layout.Vertical>
  )
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

  const [connectordetail, setConnectorDetails] = React.useState(connector?.data)
  useEffect(() => {
    setConnectorDetails(connector?.data)
  }, [connector?.data])

  const isCreationThroughYamlBuilder = false
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
          !loading ? (
            <ConfigureConnector
              accountId={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              type={connectordetail?.type || ''}
              connectorDetails={connectordetail as ConnectorDTO}
              connector={buildKubFormData(connectordetail)}
              refetchConnector={refetch}
              isCreationThroughYamlBuilder={isCreationThroughYamlBuilder}
              connectorJson={connectordetail}
            />
          ) : (
            <PageSpinner />
          )
        ) : (
          <></> // TODO: Reference By
        )}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
