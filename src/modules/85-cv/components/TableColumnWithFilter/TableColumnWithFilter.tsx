import { Color, Container, ExpandingSearchInput, Text } from '@wings-software/uikit'
import React from 'react'

export interface TableColumnWithFilterProps {
  appliedFilter?: string
  onFilter: (filterValue: string) => void
  columnName: string
}

export function TableColumnWithFilter(props: TableColumnWithFilterProps): JSX.Element {
  const { appliedFilter: filteredNamespace, onFilter, columnName } = props
  return (
    <Container flex>
      <Text color={Color.BLACK}>{columnName}</Text>
      <ExpandingSearchInput
        throttle={750}
        defaultValue={filteredNamespace}
        onChange={namespaceSubstring => onFilter(namespaceSubstring)}
      />
    </Container>
  )
}
