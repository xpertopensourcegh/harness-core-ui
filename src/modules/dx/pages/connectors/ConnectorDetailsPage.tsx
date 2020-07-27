import React from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ConnectorDetailsPage.i18n'
import css from './ConnectorDetailsPage.module.scss'
import ConfigureConnector from './ConfigureConnector'
import { Page } from 'modules/common/exports'
import cx from 'classnames'
import { routeResources } from 'modules/common/routes'
import { linkTo } from 'framework/exports'
import { routeParams } from 'framework/exports'
import { useParams } from 'react-router'
import { useGetConnector } from 'services/cd-ng'
import { buildKubFormData } from './utils/ConnectorUtils'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'

interface Categories {
  [key: string]: string
}

interface ConnectorDetailsPageState {
  activeCategory: number
  setActiveCategory: (val: number) => void
  connectordetail: any
  setConnector: (val: any) => void
  connectorType: string
  setConnectorType: (type: string) => void
  connectorJson: any
  setConnectorJson: (connectorJson: any) => void
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
      <span className={css.kubHeading}>Kubernetes Connector</span>
    </Layout.Vertical>
  )
}

const setInitialConnector = (data: any, state: ConnectorDetailsPageState) => {
  state.setConnector(data)
}

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const [connectordetail, setConnector] = React.useState()
  const [connectorType, setConnectorType] = React.useState('K8sCluster')
  const [connectorJson, setConnectorJson] = React.useState()
  const {
    params: { connectorId }
  } = routeParams()
  const { accountId } = useParams()
  const state: ConnectorDetailsPageState = {
    activeCategory,
    setActiveCategory,
    connectordetail,
    setConnector,
    connectorType,
    setConnectorType,
    connectorJson,
    setConnectorJson
  }

  const { loading, data: connector } = useGetConnector({
    accountIdentifier: accountId,
    connectorIdentifier: connectorId as string
  })

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
        {!loading ? (
          <ConfigureConnector
            accountId={accountId}
            type={connectorType}
            connector={buildKubFormData(connector?.data)}
            setInitialConnector={data => setInitialConnector(data, state)}
            isCreationThroughYamlBuilder={isCreationThroughYamlBuilder}
            connectorJson={connector?.data}
          />
        ) : (
          <PageSpinner />
        )}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
