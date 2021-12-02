import React, { FC, useEffect, useState } from 'react'
import { Pagination, PaginationProps } from '@wings-software/uicore'
import { debounce } from 'lodash-es'

export interface ResponsivePaginationProps extends PaginationProps {
  breakAt?: number
}

export const DEFAULT_BREAK_POINT = 1660

const ResponsivePagination: FC<ResponsivePaginationProps> = ({ breakAt = DEFAULT_BREAK_POINT, ...props }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.outerWidth)

  useEffect(() => {
    const onResize = debounce(() => setWindowWidth(window.outerWidth), 200)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <Pagination hidePageNumbers={windowWidth < breakAt} {...props} />
}

export default ResponsivePagination
