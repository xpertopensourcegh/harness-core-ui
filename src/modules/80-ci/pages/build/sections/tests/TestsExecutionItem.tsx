import React, { useEffect, useState, useCallback } from 'react'
import { Intent, ProgressBar } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { Button, Color, Icon, Container, Text, useIsMounted } from '@wings-software/uicore'
import cx from 'classnames'
import type { CellProps, Column, Renderer } from 'react-table'
import { TestSuite, useTestCaseSummary, TestCase, TestCaseSummaryQueryParams } from 'services/ti-service'
import { useStrings } from 'framework/exports'
import { Duration } from '@common/exports'
import Table from '@common/components/Table/Table'
import { renderFailureRate } from './TestsUtils'
import { TestsFailedPopover } from './TestsFailedPopover'
import css from './BuildTests.module.scss'

const scrollIntoItem = (): void => {
  const expandedElement = document.querySelector(`.${css.expanded}`)

  if (expandedElement && expandedElement.previousElementSibling?.classList.contains(css.testSuite)) {
    expandedElement.scrollIntoView?.({ behavior: 'smooth', block: 'start', inline: 'start' })
  }
}

const NOW = Date.now()
const PAGE_SIZE = 10

export interface TestExecutionEntryProps {
  buildIdentifier: string
  serviceToken: string
  executionSummary: TestSuite
  expanded?: boolean
  status?: 'failed'
  onExpand: () => void
}

export const TestsExecutionItem: React.FC<TestExecutionEntryProps> = ({
  buildIdentifier,
  serviceToken,
  executionSummary,
  expanded,
  status,
  onExpand
}) => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const [pageIndex, setPageIndex] = useState(0)
  const queryParams = ({
    accountId,
    orgId: orgIdentifier,
    projectId: projectIdentifier,
    buildId: buildIdentifier,
    pipelineId: pipelineIdentifier,
    report: 'junit' as 'junit',
    suite_name: executionSummary.name, // eslint-disable-line @typescript-eslint/camelcase
    status,
    sort: 'status',
    order: 'ASC',
    pageIndex,
    pageSize: PAGE_SIZE
  } as unknown) as TestCaseSummaryQueryParams
  const { data, error, loading, refetch } = useTestCaseSummary({
    queryParams,
    lazy: true,
    requestOptions: {
      headers: {
        'X-Harness-Token': serviceToken
      }
    }
  })
  const isMounted = useIsMounted()
  const refetchData = useCallback(
    (params: TestCaseSummaryQueryParams) => {
      setTimeout(() => {
        if (isMounted.current) {
          refetch({ queryParams: params })
        }
      }, 250)
    },
    [isMounted, refetch]
  )
  function renderColumn(col: keyof TestCase | 'order'): Renderer<CellProps<TestCase>> {
    return (({ row }) => {
      const failed = ['error', 'failed'].includes(row.original?.result?.status || '')
      const tooltip = failed && col === 'name' ? <TestsFailedPopover testCase={row.original} /> : undefined

      return (
        <Container width="90%" className={css.testCell}>
          <Text
            className={cx(css.text, tooltip && css.failed)}
            color={failed ? Color.RED_700 : Color.GREY_700}
            lineClamp={!tooltip ? 1 : undefined}
            tooltip={tooltip}
          >
            {col === 'order' ? (
              PAGE_SIZE * pageIndex + (row.index + 1)
            ) : col === 'result' ? (
              row.original[col]?.status
            ) : col === 'duration_ms' ? (
              <Duration
                icon={undefined}
                durationText=" "
                startTime={NOW}
                endTime={NOW + (row.original[col] || 0)}
                color={failed ? Color.RED_700 : undefined}
              />
            ) : (
              row.original[col]
            )}
          </Text>
        </Container>
      )
    }) as Renderer<CellProps<TestCase>>
  }
  const columns: Column<TestCase>[] = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'order' as 'name',
        width: '5%',
        Cell: renderColumn('order'),
        disableSortBy: true
      },
      {
        Header: getString('ci.testsReports.testCaseName'),
        accessor: 'name',
        width: '40%',
        Cell: renderColumn('name')
      },
      {
        Header: getString('ci.testsReports.className'),
        accessor: 'class_name',
        width: '35%',
        Cell: renderColumn('class_name')
      },
      {
        Header: getString('ci.testsReports.result'),
        accessor: 'result',
        width: '10%',
        Cell: renderColumn('result')
      },
      {
        Header: getString('ci.testsReports.duration').toUpperCase(),
        accessor: 'duration_ms',
        width: '10%',
        Cell: renderColumn('duration_ms')
      }
    ],
    [getString]
  )
  const failureRate = (executionSummary.failed_tests || 0) / (executionSummary.total_tests || 1)

  useEffect(() => {
    if (expanded) {
      if (!data) {
        refetchData(queryParams)
      }
    }
  }, [expanded, queryParams, refetchData, data])

  useEffect(() => {
    if (data) {
      scrollIntoItem()
    }
  }, [data])

  return (
    <Container className={cx(css.widget, css.testSuite, expanded && css.expanded)} padding="medium">
      <Container flex>
        <Text className={css.testSuiteHeading} color={Color.GREY_500}>
          <Button minimal large icon={expanded ? 'chevron-down' : 'chevron-right'} onClick={onExpand} />
          {getString('ci.testsReports.testSuite')}
          <Text inline className={css.testSuiteName} lineClamp={1}>
            {executionSummary.name}
          </Text>
        </Text>
        <Text className={css.testSuiteHeading} color={Color.GREY_500}>
          {getString('ci.testsReports.duration')}
          <Duration
            icon={undefined}
            durationText=" "
            startTime={NOW}
            endTime={NOW + (executionSummary.duration_ms || 0)}
            style={{ display: 'block' }}
          />
        </Text>
        <Text className={css.testSuiteHeading} color={Color.GREY_500}>
          {getString('ci.testsReports.totalTests')}
          <span>{executionSummary.total_tests}</span>
        </Text>
        <Text className={css.testSuiteHeading} color={Color.GREY_500}>
          {getString('ci.testsReports.failedTests')}
          <span>{executionSummary.failed_tests}</span>
        </Text>
        <Text className={css.testSuiteHeading} color={Color.GREY_500}>
          {getString('ci.testsReports.failureRate')}
          <span>{renderFailureRate(failureRate)}%</span>
        </Text>
        <ProgressBar
          className={css.progressBar}
          animate={false}
          intent={failureRate > 0 ? Intent.DANGER : Intent.SUCCESS}
          stripes={false}
          value={failureRate || 1}
        />
      </Container>
      {expanded && (
        <>
          {loading && (
            <Container flex={{ align: 'center-center' }} padding="xlarge">
              <Icon name="spinner" size={24} color="blue500" />
            </Container>
          )}
          {!loading && error && (
            <Container flex={{ align: 'center-center' }} padding="large">
              <Text icon="error" color={Color.RED_500} iconProps={{ size: 16, color: Color.RED_500 }}>
                {get(error, 'data.error_msg', error?.message)}
              </Text>
            </Container>
          )}
          {!loading && !error && (
            <Table<TestCase>
              className={css.testSuiteTable}
              columns={columns}
              data={data?.content || []}
              pagination={{
                itemCount: data?.data?.totalItems || 0,
                pageSize: data?.data?.pageSize || 0,
                pageCount: data?.data?.totalPages || 0,
                pageIndex,
                gotoPage: pageIdx => {
                  setPageIndex(pageIdx)
                  refetchData({
                    ...queryParams,
                    pageIndex: pageIdx
                  })
                }
              }}
            />
          )}
        </>
      )}
    </Container>
  )
}
