import React from 'react'
import { Container } from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import { Page } from '@common/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'
import i18n from './CVDashboardPage.i18n'
import { CategoryRiskCardsWithApi } from './CategoryRiskCards/CategoryRiskCards'
import ActivityVerifications from './ActivityVerifications/ActivityVerifications'
import RecentActivityChanges from './RecentActivityChanges/RecentActivityChanges'
import css from './CVDashboardPage.module.scss'

export const CDDashboardPage: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const history = useHistory()
  return (
    <>
      <Page.Header title={i18n.pageTitleText} />
      <Page.Body>
        <Container className={css.main}>
          <CategoryRiskCardsWithApi
            onCardSelect={() =>
              history.push(
                routes.toCVServices({
                  accountId,
                  projectIdentifier,
                  orgIdentifier
                })
              )
            }
          />
          <ActivityVerifications />
          <RecentActivityChanges />
        </Container>
      </Page.Body>
    </>
  )
}

export default CDDashboardPage
