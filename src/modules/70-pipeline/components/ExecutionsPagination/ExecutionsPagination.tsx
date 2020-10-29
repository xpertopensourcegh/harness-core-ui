import React from 'react'
import { Container, Pagination, PaginationProps } from '@wings-software/uikit'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'
import css from './ExecutionsPagination.module.scss'

export interface ExecutionPaginationProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
  gotoPage: PaginationProps['gotoPage']
}

export const ExecutionPagination: React.FC<ExecutionPaginationProps> = ({ pipelineExecutionSummary, gotoPage }) => {
  return (
    <>
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
    </>
  )
}
