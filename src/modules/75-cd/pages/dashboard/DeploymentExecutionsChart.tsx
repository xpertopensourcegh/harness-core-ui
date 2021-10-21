import React, { useMemo } from 'react'
import { Container, Text, Color } from '@wings-software/uicore'

import { useParams } from 'react-router-dom'
import { defaultTo } from 'lodash-es'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetDeploymentExecution } from 'services/cd-ng'
import NoDeployments from '@pipeline/components/Dashboards/images/NoDeployments.svg'

import { useErrorHandler } from '@pipeline/components/Dashboards/shared'
import { OverviewChartsWithToggle } from '@common/components/OverviewChartsWithToggle/OverviewChartsWithToggle'
import { getTooltip } from '@pipeline/components/LandingDashboardDeploymentsWidget/LandingDashboardDeploymentsWidget'
import styles from './CDDashboardPage.module.scss'

export default function DeploymentExecutionsChart(props: any) {
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { range, title } = props

  const { data, error } = useGetDeploymentExecution({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      startTime: range[0],
      endTime: range[1]
    }
  })

  useErrorHandler(error)
  const chartData = useMemo(() => {
    if (data?.data?.executionDeploymentList?.length) {
      const successData: number[] = []
      const failureData: number[] = []
      const custom: any = []
      data.data.executionDeploymentList.forEach(val => {
        successData.push(defaultTo(val.deployments?.success, 0))
        failureData.push(defaultTo(val.deployments?.failure, 0))
        custom.push(val)
      })
      return [
        {
          name: 'Failed',
          data: failureData,
          color: '#EE5F54',
          custom
        },
        {
          name: 'Success',
          data: successData,
          color: '#5FB34E',
          custom
        }
      ]
    }
  }, [data])
  const { getString } = useStrings()

  const failedData = chartData?.find(item => item.name === 'Failed') as any
  const allFailedCount = failedData?.data?.every((item: any) => item === 0)

  const chartSuccessData = chartData?.find(item => item.name === 'Success') as any
  const allSuccessCount = chartSuccessData?.data?.every((item: any) => item === 0)

  return (
    <>
      <Text className={styles.healthCardTitle}>{title}</Text>

      {allFailedCount && allSuccessCount ? (
        <Container className={styles.emptyView}>
          <Container className={styles.emptyViewCard}>
            <img src={NoDeployments} />
            <Text>{getString('pipeline.dashboards.noDeployments')}</Text>
          </Container>
        </Container>
      ) : (
        <div className={styles.chartContainer}>
          <OverviewChartsWithToggle
            data={defaultTo(chartData, [])}
            customChartOptions={{
              tooltip: {
                useHTML: true,
                formatter: function () {
                  return getTooltip(this)
                },
                backgroundColor: Color.BLACK,
                outside: true,
                borderColor: 'black'
              }
            }}
          />
        </div>
      )}
    </>
  )
}
