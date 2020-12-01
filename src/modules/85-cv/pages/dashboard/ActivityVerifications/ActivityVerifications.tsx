import React from 'react'
import { Container, Text, Color, Button } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { useGetRecentDeploymentActivityVerifications } from 'services/cv'
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
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { data } = useGetRecentDeploymentActivityVerifications({
    queryParams: {
      accountId: accountId as string,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string
    }
  })

  return (
    <Container className={css.main}>
      <Container className={css.header}>
        <Text className={css.headerText}>{i18n.activityVerificationHeaderText.title}</Text>
        <Text rightIcon="horizontal-bar-chart-asc" rightIconProps={{ intent: 'primary' }} color={Color.BLACK}>
          {i18n.viewAllActivities}
        </Text>
      </Container>
      <ul className={css.activityList}>
        <li className={css.headerRow}>{RECENT_VERIFICATIONS_COLUMN_NAMES}</li>
        {data?.resource?.map(item => {
          const { serviceName, tag } = item
          return (
            <VerificationItem
              key={`${tag}-${serviceName}`}
              item={item}
              onClick={() =>
                history.push(
                  routes.toCVDeploymentPage({
                    projectIdentifier: projectIdentifier as string,
                    orgIdentifier: orgIdentifier as string,
                    deploymentTag: encodeURIComponent(tag!),
                    serviceIdentifier: encodeURIComponent(serviceName!),
                    accountId
                  })
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
        >
          {i18n.viewAllActivities}
        </Button>
      </ul>
    </Container>
  )
}
