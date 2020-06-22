import React from 'react'
import { Layout, Container, Link } from '@wings-software/uikit'
import { Tag } from '@blueprintjs/core'
import i18n from './ConnectorDetailsPage.i18n'
import css from './ConnectorDetailsPage.module.scss'
import ConfigureConnector from './ConfigureConnector'
import { Page } from 'modules/common/exports'
import cx from 'classnames'
import { connector } from './ConnectorMockData'
import { routeResources } from 'modules/common/routes'

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
        <Link className={css.breadCrumb} href={routeResources.url({ accountId: 'kmpySmUISimoRrJL6NL73w' })}>
          Resources
        </Link>
        <span>/</span>
        <Link className={css.breadCrumb} href={routeResources.url({ accountId: 'kmpySmUISimoRrJL6NL73w' })}>
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

const ConnectorDetailsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const [connectordetail, setConnector] = React.useState(connector)
  const state: any = {
    activeCategory,
    setActiveCategory,
    connectordetail,
    setConnector
  }

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
        <ConfigureConnector
          connector={connector}
          enableCreate={editMode}
          setInitialConnector={data => setInitialConnector(data, state)}
        />
      </Page.Body>
    </>
  )
}

export default ConnectorDetailsPage
