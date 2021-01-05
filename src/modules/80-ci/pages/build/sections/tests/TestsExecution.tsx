import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Text, Container, Layout, Heading, Select, Switch, Pagination, useIsMounted, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { PageError } from '@common/components/Page/PageError'
import { TestSuiteSummaryQueryParams, useTestSuiteSummary } from 'services/ti-service'
import { BuildPageContext } from '../../context/BuildPageContext'
import { TestsExecutionItem } from './TestsExecutionItem'
import { SortByKey } from './TestsUtils'
import css from './BuildTests.module.scss'

const PAGE_SIZE = 20

export const TestsExecution: React.FC = () => {
  const { getString } = useStrings()
  const { buildData } = React.useContext(BuildPageContext)
  const status = buildData?.response?.status
  const isBuildComplete = ['SUCCESS', 'FAILURE', 'ERROR'].includes(status || '')
  const [showFailedTestsOnly, setShowFailedTestsOnly] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(0)
  const { accountId, buildIdentifier, orgIdentifier, projectIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    buildIdentifier: string
  }>()
  const [sortBy, setSortBy] = useState<SortByKey>(SortByKey.FAILURE_RATE)
  const [pageIndex, setPageIndex] = useState(0)
  const queryParams = useMemo(
    () => ({
      accountId,
      orgId: orgIdentifier,
      projectId: projectIdentifier,
      pipelineId: buildData?.response?.data?.pipeline?.id || '',
      buildId: buildIdentifier,
      report: 'junit' as 'junit',
      pageIndex,
      status: showFailedTestsOnly ? ('failed' as 'failed') : undefined,
      sort: sortBy,
      pageSize: PAGE_SIZE,
      order: 'DESC' as 'DESC'
    }),
    [
      accountId,
      orgIdentifier,
      projectIdentifier,
      buildIdentifier,
      buildData?.response?.data?.pipeline?.id,
      pageIndex,
      showFailedTestsOnly,
      sortBy
    ]
  )
  const { data: executionSummary, error, loading, refetch: fetchExecutionSummary } = useTestSuiteSummary({
    queryParams,
    lazy: true
  })
  const sortByItems = useMemo(
    () => [
      { label: getString('ci.testsReports.failureRate'), value: SortByKey.FAILURE_RATE },
      { label: getString('ci.testsReports.failedTests'), value: SortByKey.FAILED_TESTS },
      { label: getString('ci.testsReports.duration'), value: SortByKey.DURATION_MS },
      { label: getString('ci.testsReports.totalTests'), value: SortByKey.TOTAL_TESTS }
    ],
    [getString]
  )
  const [sortBySelectedItem, setSortBySelectedItem] = useState({
    label: getString('ci.testsReports.failureRate'),
    value: SortByKey.FAILURE_RATE
  })
  const isMounted = useIsMounted()
  const refetchData = useCallback(
    (params: TestSuiteSummaryQueryParams) => {
      setTimeout(() => {
        if (isMounted.current) {
          fetchExecutionSummary({ queryParams: params })
        }
      }, 250)
    },
    [isMounted, fetchExecutionSummary]
  )

  useEffect(() => {
    if (status && isBuildComplete) {
      if (!executionSummary && !error && !loading) {
        refetchData(queryParams)
      }
    }
  }, [
    isMounted,
    status,
    isBuildComplete,
    executionSummary,
    error,
    loading,
    fetchExecutionSummary,
    queryParams,
    refetchData
  ])

  // When build/execution is not resolved from context, render nothing
  if (!status) {
    return null
  }

  return (
    <Container className={cx(css.rightContainer)}>
      <Container flex margin={{ bottom: 'medium' }}>
        <Heading level={2} font={{ weight: 'bold' }} className={css.testCasesHeader}>
          {getString('ci.testsReports.testCasesExecution')}
          {loading && <Icon name="steps-spinner" size={16} color="blue500" padding={{ left: 'xsmall' }} />}
        </Heading>
        <Layout.Horizontal spacing="small">
          <Switch
            label={getString('ci.testsReports.showOnlyFailedTests')}
            style={{ alignSelf: 'center', paddingRight: 'var(--spacing-xlarge)' }}
            checked={showFailedTestsOnly}
            onChange={e => {
              setShowFailedTestsOnly(e.currentTarget.checked)
              setPageIndex(0)
              refetchData({
                ...queryParams,
                sort: sortBy,
                pageIndex: 0,
                status: e.currentTarget.checked ? 'failed' : undefined
              })
            }}
          />
          <Text style={{ alignSelf: 'center' }}>{getString('ci.testsReports.sortBy')}</Text>
          <Select
            className={css.select}
            items={sortByItems}
            value={sortBySelectedItem}
            onChange={item => {
              setSortBySelectedItem(item as { label: string; value: SortByKey })
              setSortBy(item.value as SortByKey)
              setPageIndex(0)
              refetchData({
                ...queryParams,
                sort: item.value as SortByKey,
                pageIndex: 0,
                status: showFailedTestsOnly ? 'failed' : undefined
              })
            }}
          />
        </Layout.Horizontal>
      </Container>

      {error && (
        <Container height={200}>
          <PageError
            message={error?.message}
            onClick={() => {
              fetchExecutionSummary()
            }}
          />
        </Container>
      )}

      {!error &&
        executionSummary?.content?.map((summary, index) => (
          <TestsExecutionItem
            key={summary.name}
            executionSummary={summary}
            status={showFailedTestsOnly ? 'failed' : undefined}
            expanded={index === expandedIndex ? true : undefined}
            onExpand={() => {
              setExpandedIndex(index)
            }}
          />
        ))}

      {(executionSummary?.data?.totalItems || 0) > 20 && (
        <Pagination
          pageSize={executionSummary?.data?.pageSize || 0}
          pageIndex={pageIndex}
          pageCount={executionSummary?.data?.totalPages || 0}
          itemCount={executionSummary?.data?.totalItems || 0}
          gotoPage={pageIdx => {
            setPageIndex(pageIdx)
            refetchData({
              ...queryParams,
              sort: sortBy,
              pageIndex: pageIdx,
              status: showFailedTestsOnly ? 'failed' : undefined
            })
          }}
        />
      )}
    </Container>
  )
}
