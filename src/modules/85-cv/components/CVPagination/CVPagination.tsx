import React from 'react'
import { Pagination } from '@wings-software/uicore'
import type { PageTransactionMetricInfo } from 'services/cv'

export default function CVPagination({
  page,
  goToPage
}: {
  page?: PageTransactionMetricInfo
  goToPage?(p: number): void
}) {
  return (
    (!!page && (page?.pageIndex ?? -1) >= 0 && (
      <Pagination
        pageSize={page.pageSize as number}
        pageCount={page.totalPages as number}
        itemCount={page.totalItems as number}
        pageIndex={page.pageIndex}
        gotoPage={p => goToPage?.(p)}
      />
    )) ||
    null
  )
}
