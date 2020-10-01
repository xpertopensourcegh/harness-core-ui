import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Container, Button, Layout, Select, Pagination } from '@wings-software/uikit'
import cx from 'classnames'
import { useLocation, useHistory } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { useGetListOfExecutions } from 'services/cd-ng'
import { useRouteParams } from 'framework/exports'
import i18n from './CDDeploymentsPage.i18n'
import { ExecutionsListView } from './views/ExecutionsListView'
import css from './CDDeploymentsPage.module.scss'

const POLLING_INTERVAL = 15 * 1000 // Polling interval in ms

const CDDeploymentsPage: React.FC = () => {
  const {
    params: { accountId, projectIdentifier, orgIdentifier },
    query
  } = useRouteParams()
  const { pathname, search } = useLocation()
  const [page, setPage] = useState(Number(query.page || 1))
  const history = useHistory()
  const timeoutRef = useRef(0)
  const { loading, data: pipelineExecutionSummary, error, refetch } = useGetListOfExecutions({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      page: page - 1
    }
  })
  const gotoPage = useCallback(
    index => {
      setPage(index + 1)
      history.push({
        pathname,
        search: `?page=${index + 1}`
      })
    },
    [history, pathname]
  )

  useEffect(() => {
    // Temporary solution to support navigating between pages using browser back/forward buttons
    if (!search.includes(`page=${page}`)) {
      const match = search.match(/(page=)(\d+)/)
      if (match && match[2] && Number(match[2]) > 0) {
        setPage(Number(match[2]))
      }
    }
  }, [search, page])

  // Polling logic:
  //  - At any moment of time, only one polling is done
  //  - Only do polling on first page
  //  - When component is loading, wait until loading is done
  //  - When polling call (API) is being processed, wait until it's done then re-schedule
  useEffect(() => {
    const schedulePolling = (): void => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(async () => {
        if (page === 1 && refetch && !loading) {
          await refetch()
        }
        schedulePolling()
      }, POLLING_INTERVAL)
    }

    schedulePolling()

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [page, refetch, loading])

  const runPipeline = useCallback(() => {
    alert('To be implemented')
  }, [])

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button intent="primary" text={i18n.runPipeline} onClick={runPipeline} />
          </Container>
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => !pipelineExecutionSummary?.data?.content?.length,
          icon: 'cd-hover',
          message: i18n.noDeployment,
          buttonText: i18n.runPipeline,
          onClick: runPipeline
        }}
      >
        <Container flex className={css.header}>
          <Layout.Horizontal spacing="small">
            <Button
              className={cx(css.roundedButton, css.selected)}
              text={i18n.myDeployments}
              onClick={() => alert('To be implemented')}
            />
            <Button className={css.roundedButton} text={i18n.running} onClick={() => alert('To be implemented')} />
            <Button className={css.roundedButton} text={i18n.failed} onClick={() => alert('To be implemented')} />
          </Layout.Horizontal>

          <Layout.Horizontal spacing="large">
            <Select
              inputProps={{ placeholder: i18n.selectSavedFilter }}
              items={[
                { label: 'Running Only', value: 'running-only' },
                { label: 'Failed Only', value: 'service-elk' }
              ]}
              onChange={item => alert('To be implemented ' + item.label)}
            />

            <Layout.Horizontal inline spacing="small">
              <Button minimal icon="search" onClick={() => alert('To be implemented')} />
              <Button minimal icon="settings" onClick={() => alert('To be implemented')} />
            </Layout.Horizontal>
          </Layout.Horizontal>
        </Container>
        <Container className={css.content}>
          <ExecutionsListView pipelineExecutionSummary={pipelineExecutionSummary} />
        </Container>
        {pipelineExecutionSummary?.data?.content && (
          <Container className={css.pagination}>
            <Pagination
              pageSize={pipelineExecutionSummary?.data?.pageSize || 0}
              pageIndex={pipelineExecutionSummary?.data?.pageIndex}
              pageCount={pipelineExecutionSummary?.data?.totalPages || 0}
              itemCount={pipelineExecutionSummary?.data?.totalItems || 0}
              gotoPage={gotoPage}
              nextPage={gotoPage}
            />
          </Container>
        )}
      </Page.Body>
    </>
  )
}

export default CDDeploymentsPage
