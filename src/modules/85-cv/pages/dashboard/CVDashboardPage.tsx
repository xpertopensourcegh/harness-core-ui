import React from 'react'
import { Container } from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import { Page } from '@common/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/exports'
import { CategoryRiskCardsWithApi } from './CategoryRiskCards/CategoryRiskCards'
import ActivityVerifications from './ActivityVerifications/ActivityVerifications'
import RecentActivityChanges from './RecentActivityChanges/RecentActivityChanges'
import css from './CVDashboardPage.module.scss'

export const CVDashboardPage: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const history = useHistory()
  const { getString } = useStrings()
  return (
    <>
      <Page.Header title={getString('overview').toLocaleUpperCase()} />
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

export default CVDashboardPage
