import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'
import cx from 'classnames'
import { Page } from 'modules/common/exports'
import { Route, Switch } from 'react-router'
import { Link, useRouteMatch, Redirect } from 'react-router-dom'
import ConnectorsList from 'modules/dx/pages/connectors/ConnectorsList'
import SecretsList from 'modules/dx/pages/secrets/SecretsList'

interface Categories {
  [key: string]: string
}

const categories: Categories = {
  connectors: i18n.connectors,
  secrets: i18n.secrets,
  delegates: i18n.delegates,
  templates: i18n.templates,
  fileStore: i18n.fileStore
}

const ResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)
  const { path, url } = useRouteMatch()

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              {Object.keys(categories).map((data, index) => {
                return (
                  <Link
                    className={cx(css.tags, activeCategory === index && css.activeTag)}
                    onClick={() => setActiveCategory(index)}
                    key={data + index}
                    to={`${url}/${data}`}
                  >
                    {categories[data]}
                  </Link>
                )
              })}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>
        <Switch>
          <Redirect exact from={`${path}/`} to={`${path}/connectors`} />
          <Route path={`${path}/connectors`} component={ConnectorsList} />
          <Route path={`${path}/secrets`} component={SecretsList} />
        </Switch>
      </Page.Body>
    </>
  )
}

export default ResourcesPage
