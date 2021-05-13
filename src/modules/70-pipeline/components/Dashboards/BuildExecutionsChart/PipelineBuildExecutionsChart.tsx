import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import type { PipelineType, ExecutionPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { ExecutionsChart } from '@pipeline/components/Dashboards/BuildExecutionsChart/BuildExecutionsChart'
import { useGetPipelineExecution } from 'services/pipeline-ng'

export default function PipelineBuildExecutionsChart() {
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier, module } = useParams<
    PipelineType<ExecutionPathProps>
  >()
  const [range, setRange] = useState([Date.now() - 30 * 24 * 60 * 60000, Date.now()])

  const { data, loading } = useGetPipelineExecution({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      startInterval: moment(range[0]).format('YYYY-MM-DD'),
      endInterval: moment(range[1]).format('YYYY-MM-DD'),
      pipelineIdentifier,
      moduleInfo: module
    } as any
  })

  const chartData = useMemo(() => {
    if (data?.data?.pipelineExecutionInfoList?.length) {
      return data.data.pipelineExecutionInfoList.map(val => ({
        time: val.date,
        success: val.count!.success,
        failed: val.count!.failure
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
      yAxisTitle="# of builds"
    />
  )
}
