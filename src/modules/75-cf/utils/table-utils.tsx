import React from 'react'
import type { CellProps } from 'react-table'

export function withTableData<Data extends Record<any, any>, T>(
  mapDataToProps: (data: CellProps<Data>) => T
): (Comp: React.FC<T>) => React.FC<CellProps<Data>> {
  return (Comp: React.FC<T>) => (cellProps: CellProps<Data>) => <Comp {...mapDataToProps(cellProps)} />
}
