import React from 'react'
import { useParams } from 'react-router-dom'
import { Select as BPSelect, ItemRenderer, ItemListRenderer } from '@blueprintjs/select'
import { Button, Menu, Spinner } from '@blueprintjs/core'

import { useGetPipelineList, NGPipelineSummaryResponse } from 'services/cd-ng'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { String } from 'framework/exports'

import css from './PipelineSelect.module.scss'

export interface PipelineSelectProps {
  selectedPipeline?: string
  onPipelineSelect(id: string): void
}

const Select = BPSelect.ofType<NGPipelineSummaryResponse>()

const itemRenderer: ItemRenderer<NGPipelineSummaryResponse> = (item, props) => (
  <Menu.Item key={item.identifier} text={item.name} active={props.modifiers.active} onClick={props.handleClick} />
)

export default function PipelineSelect(props: PipelineSelectProps): React.ReactElement {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<AccountPathProps & ProjectPathProps>()
  const [query, setQuery] = React.useState('')
  const { data, loading } = useGetPipelineList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      searchTerm: query
    },
    debounce: 300
  })
  const selectedValue = props.selectedPipeline
    ? (data?.data?.content || []).find(item => item.identifier === props.selectedPipeline)
    : null

  function clearSelection(): void {
    props.onPipelineSelect('')
  }

  const itemListRender: ItemListRenderer<NGPipelineSummaryResponse> = itemListProps => (
    <Menu>
      {loading ? (
        <Spinner size={20} />
      ) : itemListProps.items.length > 0 ? (
        <React.Fragment>
          {selectedValue ? <Menu.Item text="Clear Selection" icon="cross" onClick={clearSelection} /> : null}
          {itemListProps.items.map((item, i) => itemListProps.renderItem(item, i))}
        </React.Fragment>
      ) : (
        <Menu.Item text="No Results" disabled />
      )}
    </Menu>
  )

  function handleSelect(item: NGPipelineSummaryResponse): void {
    props.onPipelineSelect(item.identifier || '')
  }

  return (
    <Select
      items={data?.data?.content || []}
      itemRenderer={itemRenderer}
      onItemSelect={handleSelect}
      popoverProps={{ minimal: true, wrapperTagName: 'div', targetTagName: 'div' }}
      activeItem={selectedValue}
      resetOnQuery={false}
      query={query}
      onQueryChange={setQuery}
      itemListRenderer={itemListRender}
    >
      <Button className={css.main} rightIcon="chevron-down" data-testid="pipeline-select">
        {selectedValue ? selectedValue?.name : <String stringID="all" />}
      </Button>
    </Select>
  )
}
