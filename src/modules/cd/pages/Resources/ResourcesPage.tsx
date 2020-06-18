import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'
import cx from 'classnames'
import { Page } from 'modules/common/exports'
import { Route, Switch } from 'react-router'
import { Link, useRouteMatch, useParams } from 'react-router-dom'
import ConnectorsList from '../../../dx/pages/connectors/ConnectorsList'
import ServiceSpecifications from '../../common/ServiceSpecifications/ServiceSpecifications'

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
function ComponentToRender() {
  const { category } = useParams()
  if (category === 'connectors') return <ConnectorsList />
  else return <ServiceSpecifications />
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
          <Route exact path={`${path}/`} component={ConnectorsList} />
          <Route path={`${path}/:category`} component={ComponentToRender} />
        </Switch>
      </Page.Body>
    </>
  )
}

export default ResourcesPage
