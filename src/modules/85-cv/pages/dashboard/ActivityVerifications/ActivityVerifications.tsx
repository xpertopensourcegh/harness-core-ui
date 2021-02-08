import React from 'react'
import { Container, Text, Button } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { useGetRecentDeploymentActivityVerifications } from 'services/cv'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import i18n from './ActivityVerifications.i18n'
import VerificationItem from './VerificationItem'
import css from './ActivityVerifications.module.scss'

const RECENT_VERIFICATIONS_COLUMN_NAMES = Object.values(i18n.activityVerificationsColumns).map(columnName => (
  <Text
    width={columnName === i18n.activityVerificationsColumns.deployments ? 200 : 300}
    key={columnName}
    font={{ weight: 'bold', size: 'small' }}
    style={{ textTransform: 'uppercase' }}
  >
    {columnName}
  </Text>
))

export default function ActivityVerifications(): JSX.Element {
  const history = useHistory()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const { getString } = useStrings()
  const { data } = useGetRecentDeploymentActivityVerifications({
    queryParams: {
      accountId: accountId as string,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      size: 5
    } as any // Size not supported ?
  })

  return (
    <Container className={css.main}>
      <Text className={css.headerText}>{getString('cv.overviewPage.recentChangeVerifications')}</Text>
      <ul className={css.activityList}>
        <li className={css.headerRow}>{RECENT_VERIFICATIONS_COLUMN_NAMES}</li>
        {data?.resource?.map(item => {
          const { serviceName, tag } = item
          return (
            <VerificationItem
              key={`${tag}-${serviceName}`}
              item={item}
              onSelect={phase =>
                history.push(
                  routes.toCVDeploymentPage({
                    projectIdentifier: projectIdentifier as string,
                    orgIdentifier: orgIdentifier as string,
                    deploymentTag: encodeURIComponent(tag!),
                    serviceIdentifier: encodeURIComponent(serviceName!),
                    accountId
                  }) + (phase ? `?phase=${phase}` : '')
                )
              }
            />
          )
        })}
        <Button
          style={{
            margin: '0 auto',
            display: 'block',
            fontSize: 'var(--font-size-small)'
          }}
          minimal
          intent="primary"
          onClick={() =>
            history.push(
              routes.toCVActivityDashboard({
                accountId,
                projectIdentifier,
                orgIdentifier
              })
            )
          }
        >
          {i18n.viewAllActivities}
        </Button>
      </ul>
    </Container>
  )
}
