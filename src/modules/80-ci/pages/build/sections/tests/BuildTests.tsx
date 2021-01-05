import { Layout } from '@wings-software/uicore'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PageError } from '@common/components/Page/PageError'
import { useReportSummary } from 'services/ti-service'
import { PageSpinner } from '@common/components'
import { BuildPageContext } from '../../context/BuildPageContext'
import { BuildLoadingState } from './BuildLoadingState'
import { BuildZeroState } from './BuildZeroState'
import { TestsExecution } from './TestsExecution'
import { TestsOverview } from './TestsOverview'
import css from './BuildTests.module.scss'

const BuildTests: React.FC = () => {
  const { buildData } = React.useContext(BuildPageContext)
  const { accountId, buildIdentifier, orgIdentifier, projectIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    buildIdentifier: string
  }>()
  const queryParams = useMemo(
    () => ({
      accountId,
      orgId: orgIdentifier,
      projectId: projectIdentifier,
      pipelineId: buildData?.response?.data?.pipeline?.id || '',
      buildId: buildIdentifier,
      report: 'junit' as 'junit'
    }),
    [accountId, orgIdentifier, projectIdentifier, buildIdentifier, buildData?.response?.data?.pipeline?.id]
  )
  const {
    data: testOverviewData,
    error: overviewError,
    loading: overviewLoading,
    refetch: fetchOverview
  } = useReportSummary({
    queryParams,
    lazy: true
  })
  const status = buildData?.response?.status
  const isBuildComplete = ['SUCCESS', 'FAILURE', 'ERROR'].includes(status || '')
  const buildHasZeroTest = testOverviewData?.total_tests === 0

  useEffect(() => {
    if (status && isBuildComplete) {
      if (!testOverviewData && !overviewError && !overviewLoading) {
        fetchOverview()
      }
    }
  }, [status, isBuildComplete, testOverviewData, overviewError, overviewLoading, fetchOverview])

  // When build/execution is not resolved from context, render nothing
  if (!status) {
    return null
  }

  if (overviewLoading) {
    return <PageSpinner />
  }

  if (overviewError) {
    return (
      <PageError
        message={overviewError?.message}
        onClick={() => {
          fetchOverview()
        }}
      />
    )
  }

  return (
    <Layout.Horizontal spacing="medium" padding="medium" className={css.mainContainer}>
      {isBuildComplete && (
        <>
          {buildHasZeroTest && <BuildZeroState />}
          {!buildHasZeroTest && (
            <>
              <TestsOverview testOverviewData={testOverviewData} />
              <TestsExecution />
            </>
          )}
        </>
      )}
      {!isBuildComplete && <BuildLoadingState />}
    </Layout.Horizontal>
  )
}

export default BuildTests
