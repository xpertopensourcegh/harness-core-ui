import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { ExecutionsChart } from '@pipeline/components/Dashboards/BuildExecutionsChart/BuildExecutionsChart'
import { useGetDeploymentExecution } from 'services/cd-ng'

export default function DeploymentExecutionsChart() {
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const [range, setRange] = useState([Date.now() - 30 * 24 * 60 * 60000, Date.now()])

  const { data, loading } = useGetDeploymentExecution({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      startInterval: moment(range[0]).format('YYYY-MM-DD'),
      endInterval: moment(range[1]).format('YYYY-MM-DD')
    }
  })

  const chartData = useMemo(() => {
    if (data?.data?.executionDeploymentList?.length) {
      return data.data.executionDeploymentList.map(val => ({
        time: val.time,
        success: val.deployments!.success,
        failed: val.deployments!.failure
      }))
    }
  }, [data])

  return (
    <ExecutionsChart
      titleText={getString('pipeline.dashboards.buildExecutions')}
      data={chartData}
      loading={loading}
      range={range}
      onRangeChange={setRange}
      yAxisTitle="# of Deployments"
      successColor="var(--ci-color-blue-400)"
    />
  )
}
