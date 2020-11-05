import React from 'react'
import { Pagination } from '@wings-software/uikit'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'
import css from './ExecutionsPagination.module.scss'

export interface ExecutionPaginationProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
}

function gotoPage(): void {
  //
}

export default function ExecutionPagination({
  pipelineExecutionSummary
}: ExecutionPaginationProps): React.ReactElement {
  return (
    <div className={css.pagination}>
      <Pagination
        pageSize={pipelineExecutionSummary?.data?.pageSize || 0}
        pageIndex={pipelineExecutionSummary?.data?.pageIndex}
        pageCount={pipelineExecutionSummary?.data?.totalPages || 0}
        itemCount={pipelineExecutionSummary?.data?.totalItems || 0}
        gotoPage={gotoPage}
        nextPage={gotoPage}
      />
    </div>
  )
}
