import cx from 'classnames'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Container, Layout } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'

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

const CategoryIndex = new Map([
  ['connectors', 0],
  ['secrets', 1],
  ['delegates', 2],
  ['templates', 3],
  ['fileStore', 4]
])

const ResourcesPage: React.FC = ({ children }) => {
  const { url } = useRouteMatch()
  const pathId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  const [activeCategory, setActiveCategory] = React.useState(CategoryIndex.get(pathId))

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
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default ResourcesPage
