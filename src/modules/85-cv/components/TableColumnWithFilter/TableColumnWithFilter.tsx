import { Color, Container, ExpandingSearchInput, Text } from '@wings-software/uikit'
import React from 'react'

export interface TableColumnWithFilterProps {
  appliedFilter?: string
  onFilter: (filterValue: string) => void
  columnName: string
  className?: string
}

export function TableColumnWithFilter(props: TableColumnWithFilterProps): JSX.Element {
  const { appliedFilter: filteredNamespace, onFilter, columnName, className } = props
  return (
    <Container flex className={className}>
      <Text color={Color.BLACK}>{columnName}</Text>
      <ExpandingSearchInput
        throttle={750}
        defaultValue={filteredNamespace}
        onChange={namespaceSubstring => onFilter(namespaceSubstring)}
      />
    </Container>
  )
}
