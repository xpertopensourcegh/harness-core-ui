import { Layout } from '@wings-software/uikit'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageError } from '@common/components/Page/PageError'
import { useReportSummary } from 'services/ti-service'
import { PageSpinner } from '@common/components'
// import ReportsSummaryMock from './__test__/mock/reports-summary.json'
import { BuildPageContext } from '../../context/BuildPageContext'
import { BuildLoadingState } from './BuildLoadingState'
import { BuildZeroState } from './BuildZeroState'
import { TestsExecution } from './TestsExecution'
import { TestsOverview } from './TestsOverview'
import css from './BuildTests.module.scss'

const BuildTests: React.FC = () => {
  const { accountId, buildIdentifier, orgIdentifier, projectIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    buildIdentifier: string
  }>()
  const queryParams = {
    accountId,
    orgId: orgIdentifier,
    projectId: projectIdentifier,
    buildId: buildIdentifier,
    report: 'junit' as 'junit'
  }
  const {
    data: testOverviewData,
    error: overviewError,
    loading: overviewLoading,
    refetch: fetchOverview
  } = useReportSummary({
    queryParams,
    lazy: true
  })
  const { buildData } = React.useContext(BuildPageContext)
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
              <TestsOverview
                testOverviewData={/* ((ReportsSummaryMock as unknown) as TestReportSummary) || */ testOverviewData}
              />
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
