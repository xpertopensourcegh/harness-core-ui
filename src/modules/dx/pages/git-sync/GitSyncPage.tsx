import React from 'react'
import { Layout, Container, Text } from '@wings-software/uikit'
import { Route, Switch, useParams } from 'react-router'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { linkTo } from 'framework/exports'
import { Page } from 'modules/common/exports'
import GitSyncRepoTab from './views/repos/GitSyncRepoTab'
import { routeGitSync } from '../../../common/routes'
import i18n from './GitSyncPage.i18n'
import css from './GitSyncPage.module.scss'

interface Categories {
  [key: string]: string
}

const categories: Categories = {
  repos: i18n.repos,
  entities: i18n.entities,
  activities: i18n.activities,
  errors: i18n.errors
}

const categoriesMap = Object.keys(categories)

function ComponentToRender(): JSX.Element {
  const { category } = useParams()

  switch (category) {
    case 'repos':
      return <GitSyncRepoTab></GitSyncRepoTab>
    case 'entities':
    case 'activities':
    case 'errors':
      return <Text>{`To be implemented: ${category}`}</Text>
    default:
      return <GitSyncRepoTab></GitSyncRepoTab>
  }
}

const GitSyncPage: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              {categoriesMap.map((data, index) => {
                return (
                  <NavLink
                    className={css.tags}
                    activeClassName={css.activeTag}
                    key={data + index}
                    to={linkTo(routeGitSync, { category: categoriesMap[index] as string })}
                  >
                    {categories[data]}
                  </NavLink>
                )
              })}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>
        <Switch>
          <Route exact path={`${path}/category/:category`} component={ComponentToRender} />
        </Switch>
      </Page.Body>
    </>
  )
}

export default GitSyncPage
