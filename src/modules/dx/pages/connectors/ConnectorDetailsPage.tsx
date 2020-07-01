import React, { useEffect, ReactText } from 'react'
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
import { ConnectorService } from 'modules/dx/services'
import { buildKubFormData } from './utils/ConnectorUtils'
import { useParams } from 'react-router'

interface Categories {
  [key: string]: string
}

interface ConnectorDetailsPageState {
  activeCategory: number
  setActiveCategory: (val: number) => void
  connectordetail: any
  setConnector: (val: any) => void
  isFetching: boolean
  setIsFetching: (val: boolean) => void
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

const fetchConnectorDetails = async (
  accountId: string,
  connectorId: ReactText | string,
  state: ConnectorDetailsPageState
) => {
  state.setIsFetching(true)

  const { connectorDetails, error } = await ConnectorService.getConnector({ connectorId, accountId })
  if (!error) {
    const formData = buildKubFormData(connectorDetails)
    state.setConnector(formData)
    state.setConnectorJson(connectorDetails)
  }
  state.setIsFetching(false)
}

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const [connectordetail, setConnector] = React.useState()
  const [isFetching, setIsFetching] = React.useState(false)
  const [connectorType, setConnectorType] = React.useState('K8sCluster')
  const [connectorJson, setConnectorJson] = React.useState()
  const {
    params: { urlParams }
  } = routeParams()
  const [connectorId, type] = urlParams ? (urlParams as string).split('&') : []
  const { accountId } = useParams()
  const state: ConnectorDetailsPageState = {
    activeCategory,
    setActiveCategory,
    connectordetail,
    setConnector,
    isFetching,
    setIsFetching,
    connectorType,
    setConnectorType,
    connectorJson,
    setConnectorJson
  }
  useEffect(() => {
    if (connectorId && connectorId !== 'edit=true') {
      fetchConnectorDetails(accountId, connectorId, state)
    }
  }, [])

  //Tempory edit mode to enable create
  const editMode = /edit=true/gi.test(location.href)
  const isCreationThroughYamlBuilder = type ? type.split('=')?.[1] === 'yaml-builder' : false
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
            accountId={accountId}
            type={connectorType}
            connector={connectordetail}
            enableCreate={editMode}
            setInitialConnector={data => setInitialConnector(data, state)}
            isCreationThroughYamlBuilder={isCreationThroughYamlBuilder}
            connectorJson={connectorJson}
          />
        ) : null}
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
