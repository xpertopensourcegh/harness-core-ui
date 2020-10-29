import React, { useCallback, useEffect, useRef } from 'react'
import { ButtonProps, Container } from '@wings-software/uikit'
import { useLocation, useHistory } from 'react-router-dom'
import { useGetListOfExecutions } from 'services/cd-ng'
import { useRouteParams } from 'framework/exports'
import { Page } from '@common/exports'
import { ExecutionsList } from '../ExecutionsList/ExecutionsList'
import { ExecutionFilter } from '../ExecutionsFilter/ExecutionsFilter'
import { ExecutionPagination } from '../ExecutionsPagination/ExecutionsPagination'
import i18n from './ExecutionsListingView.i18n'
import css from './ExecutionsListingView.module.scss'

const POLLING_INTERVAL = 15 * 1000 // Polling interval in ms

export interface ExecutionsListingViewProps {
  /** Click event handler when there's no data */
  onNoDataButtonClick: ButtonProps['onClick']

  /** Optional pipeline identifier. If provided, ExecutionsListingView renders only
   * executions for this particular pipeline. */
  pipelineIdentifier?: string

  /** Optional className */
  className?: string

  /** Optional polling interval */
  pollingIntervalInMilliseconds?: number
}

export const ExecutionsListingView: React.FC<ExecutionsListingViewProps> = React.memo(
  ({ className, onNoDataButtonClick, pipelineIdentifier, pollingIntervalInMilliseconds = POLLING_INTERVAL }) => {
    const {
      params: { accountId, projectIdentifier, orgIdentifier },
      query: { page = 1 }
    } = useRouteParams()
    const { pathname } = useLocation()
    const history = useHistory()
    const timeoutRef = useRef(0)
    const { loading, data: pipelineExecutionSummary, error, refetch } = useGetListOfExecutions({
      queryParams: {
        accountIdentifier: accountId,
        projectIdentifier: projectIdentifier as string,
        orgIdentifier: orgIdentifier as string,
        pipelineIdentifiers: [pipelineIdentifier as string],
        page: Number(page) - 1
      },
      queryParamStringifyOptions: {
        arrayFormat: 'repeat'
      }
    })
    const gotoPage = useCallback(
      index => {
        history.push({
          pathname,
          search: `?page=${index + 1}`
        })
      },
      [history, pathname]
    )

    // Polling logic:
    //  - At any moment of time, only one polling is done
    //  - Only do polling on first page
    //  - When component is loading, wait until loading is done
    //  - When polling call (API) is being processed, wait until it's done then re-schedule
    useEffect(() => {
      const schedulePolling = (): void => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(async () => {
          if (page == 1 && refetch && !loading) {
            await refetch()
          }
          schedulePolling()
        }, pollingIntervalInMilliseconds)
      }

      schedulePolling()

      return () => {
        clearTimeout(timeoutRef.current)
      }
    }, [page, refetch, loading, pollingIntervalInMilliseconds])

    return (
      <Page.Body
        className={className}
        loading={loading}
        error={error?.message}
        retryOnError={() => refetch?.()}
        noData={{
          when: () => !pipelineExecutionSummary?.data?.content?.length,
          icon: 'cd-hover',
          message: i18n.noDeployment,
          buttonText: i18n.runPipeline,
          onClick: onNoDataButtonClick
        }}
      >
        <Container flex className={css.header}>
          <ExecutionFilter />
        </Container>
        <Container className={css.content}>
          <ExecutionsList pipelineExecutionSummary={pipelineExecutionSummary} />
        </Container>
        <ExecutionPagination pipelineExecutionSummary={pipelineExecutionSummary} gotoPage={gotoPage} />
      </Page.Body>
    )
  }
)
