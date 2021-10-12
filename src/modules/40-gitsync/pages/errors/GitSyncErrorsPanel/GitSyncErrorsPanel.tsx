import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Pagination, PaginationProps } from '@wings-software/uicore'
import { GitSyncErrorState } from '@gitsync/pages/errors/GitSyncErrorContext'
import {
  ListGitToHarnessErrorsCommitsQueryParams,
  useListGitToHarnessErrorsCommits,
  GitSyncErrorAggregateByCommitDTO
} from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import type { GitSyncErrorMessageProps } from '@gitsync/components/GitSyncErrorMessage/GitSyncErrorMessageItem'
import { GitSyncErrorMessage } from '@gitsync/components/GitSyncErrorMessage/GitSyncErrorMessage'
import styles from '@gitsync/pages/errors/GitSyncErrorsPanel/GitSyncErrorsPanel.module.scss'

const parseDataForCommitView = (data: GitSyncErrorAggregateByCommitDTO[] = []): GitSyncErrorMessageProps[] => {
  return data.map(item => ({
    title: item.commitMessage || '',
    count: item.failedCount,
    repo: item.repoId,
    branch: item.branchName,
    commitId: item.gitCommitId,
    timestamp: 0,
    items: (item.errorsForSummaryView || []).map(error => ({
      title: error.completeFilePath,
      reason: error.failureReason || '',
      showDetails: () => {
        /**/
      }
    }))
  }))
}

export const GitSyncErrorsPanel: React.FC = () => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { /* selectedTab */ searchTerm, branch, repoIdentifier } = useContext(GitSyncErrorState)

  const [pageIndex, setPageIndex] = useState(0)

  const queryParams: ListGitToHarnessErrorsCommitsQueryParams = {
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier,
    searchTerm,
    branch,
    repoIdentifier,
    pageIndex,
    pageSize: 10
  }

  const { data, loading, error, refetch } = useListGitToHarnessErrorsCommits({ queryParams })

  const paginationProps: PaginationProps = {
    itemCount: data?.data?.totalItems || 0,
    pageSize: data?.data?.pageSize || 0,
    pageCount: data?.data?.totalPages || 0,
    pageIndex: data?.data?.pageIndex || 0,
    gotoPage: pageNumber => setPageIndex(pageNumber)
  }

  const Component = (): React.ReactElement => {
    if (loading) {
      return <PageSpinner />
    }
    if (error) {
      return <PageError onClick={() => refetch()} />
    }
    const parsedData = parseDataForCommitView(data?.data?.content)
    return (
      <Layout.Vertical height="100%">
        <Layout.Vertical className={styles.gitSyncErrorsPanel}>
          {parsedData.map(item => (
            <GitSyncErrorMessage key={item.commitId} {...item} />
          ))}
        </Layout.Vertical>
        <Pagination {...paginationProps} />
      </Layout.Vertical>
    )
  }

  return <Layout.Vertical padding={{ left: 'large', right: 'large' }}>{<Component />}</Layout.Vertical>
}
