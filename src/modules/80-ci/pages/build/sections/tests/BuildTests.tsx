import { Layout } from '@wings-software/uicore'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { PageError } from '@common/components/Page/PageError'
import { useReportSummary, useGetToken } from 'services/ti-service'
import { PageSpinner } from '@common/components'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { BuildLoadingState } from './BuildLoadingState'
import { BuildZeroState } from './BuildZeroState'
import { TestsExecution } from './TestsExecution'
import { TestsOverview } from './TestsOverview'
import { isExecutionComplete } from './TestsUtils'
import css from './BuildTests.module.scss'

const BuildTests: React.FC = () => {
  const context = useExecutionContext()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { data: serviceToken, loading: serviceTokenLoading, error: serviceTokenError } = useGetToken({
    queryParams: { accountId }
  })

  const queryParams = useMemo(
    () => ({
      accountId,
      orgId: orgIdentifier,
      projectId: projectIdentifier,
      pipelineId: context?.pipelineExecutionDetail?.pipelineExecutionSummary?.pipelineIdentifier || '',
      buildId: String(context?.pipelineExecutionDetail?.pipelineExecutionSummary?.runSequence || ''),
      report: 'junit' as 'junit'
    }),
    [
      accountId,
      orgIdentifier,
      projectIdentifier,
      context?.pipelineExecutionDetail?.pipelineExecutionSummary?.pipelineIdentifier,
      context?.pipelineExecutionDetail?.pipelineExecutionSummary?.runSequence
    ]
  )
  const {
    data: testOverviewData,
    error: overviewError,
    loading: overviewLoading,
    refetch: fetchOverview
  } = useReportSummary({
    queryParams,
    lazy: true,
    requestOptions: {
      headers: {
        'X-Harness-Token': serviceToken || ''
      }
    }
  })
  const status = (context?.pipelineExecutionDetail?.pipelineExecutionSummary?.status || '').toUpperCase()
  const isBuildComplete = isExecutionComplete(status)
  const buildHasZeroTest = testOverviewData?.total_tests === 0

  useEffect(() => {
    if (status && isBuildComplete && serviceToken) {
      if (!testOverviewData && !overviewError && !overviewLoading) {
        fetchOverview()
      }
    }
  }, [status, isBuildComplete, serviceToken, testOverviewData, overviewError, overviewLoading, fetchOverview])

  // When build/execution is not resolved from context, render nothing
  if (!status) {
    return null
  }

  if (overviewLoading || serviceTokenLoading) {
    return <PageSpinner />
  }

  const error = overviewError || serviceTokenError

  if (error) {
    return (
      <PageError
        message={get(error, 'data.error_msg', error?.message)}
        onClick={() => {
          fetchOverview()
        }}
      />
    )
  }

  return (
    <Layout.Horizontal spacing="medium" padding="medium" className={css.mainContainer}>
      {isBuildComplete && serviceToken && (
        <>
          {buildHasZeroTest && <BuildZeroState />}
          {!buildHasZeroTest && (
            <>
              <TestsOverview testOverviewData={testOverviewData} />
              <TestsExecution serviceToken={serviceToken} />
            </>
          )}
        </>
      )}
      {!isBuildComplete && <BuildLoadingState />}
    </Layout.Horizontal>
  )
}

export default BuildTests
