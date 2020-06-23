import React, { useEffect, ReactText } from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ConnectorDetailsPage.i18n'
import css from './ConnectorDetailsPage.module.scss'
import ConfigureConnector from './ConfigureConnector'
import { Page } from 'modules/common/exports'
import cx from 'classnames'
import { connector } from './ConnectorMockData'
import { routeResources } from 'modules/common/routes'
import { linkTo } from 'framework/exports'
import { routeParams } from 'framework/exports'
import { ConnectorService } from 'modules/dx/services'
import { buildKubFormData } from './utils/ConnectorUtils'

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
      <span className={css.kubHeading}>Kubernetes Connector</span>
    </Layout.Vertical>
  )
}

const setInitialConnector = (data: any, state: any) => {
  state.setConnector(data)
}

const fetchConnectorDetails = (connectorId: string | ReactText, state: any) => {
  state.setIsFetching(true)
  const connectorDetails = ConnectorService.getConnector({ connectorId })
  //  state.setConnectorType(connectorDetails.kind)
  const formData = buildKubFormData(connectorDetails)

  state.setConnector(formData)
  state.setIsFetching(false)
}

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const [connectordetail, setConnector] = React.useState()
  const [isFetching, setIsFetching] = React.useState()
  const [connectorType, setConnectorType] = React.useState('K8sCluster')
  const {
    params: { connectorId }
  } = routeParams()
  const state: any = {
    activeCategory,
    setActiveCategory,
    connectordetail,
    setConnector,
    isFetching,
    setIsFetching,
    connectorType,
    setConnectorType
  }
  useEffect(() => {
    if (connectorId) {
      fetchConnectorDetails(connectorId, state)
    }
  }, [])

  //Tempory edit mode to enable create
  const editMode = /edit=true/gi.test(location.href)
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
        {!isFetching ? (
          <ConfigureConnector
            type={connectorType}
            connector={connectordetail || connector}
            enableCreate={editMode}
            setInitialConnector={data => setInitialConnector(data, state)}
          />
        ) : null}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
