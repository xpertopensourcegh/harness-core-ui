import React from 'react'
import { Select as BPSelect, ItemRenderer, ItemListRenderer } from '@blueprintjs/select'
import { Button, Menu } from '@blueprintjs/core'

import { EXECUTION_STATUS } from '@pipeline/utils/statusHelpers'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { String } from 'framework/exports'

import css from './StatusSelect.module.scss'

const Select = BPSelect.ofType<ExecutionStatus>()

const itemRenderer: ItemRenderer<ExecutionStatus> = (item, props) => (
  <Menu.Item key={item} text={item} active={props.modifiers.active} onClick={props.handleClick} />
)

export interface StatusSelectProps {
  value?: ExecutionStatus | null
  onSelect(status: ExecutionStatus | null): void
}

export default function StatusSelect(props: StatusSelectProps): React.ReactElement {
  function clearSelection(): void {
    props.onSelect(null)
  }

  const itemListRender: ItemListRenderer<ExecutionStatus> = itemListProps => (
    <Menu>
      <React.Fragment>
        {props.value ? <Menu.Item text="Clear Selection" icon="cross" onClick={clearSelection} /> : null}
        {itemListProps.items.map((item, i) => itemListProps.renderItem(item, i))}
      </React.Fragment>
    </Menu>
  )

  return (
    <Select
      itemRenderer={itemRenderer}
      itemListRenderer={itemListRender}
      items={EXECUTION_STATUS.slice(0)}
      onItemSelect={props.onSelect}
      activeItem={props.value}
      resetOnQuery={false}
      filterable={false}
      popoverProps={{ minimal: true, wrapperTagName: 'div', targetTagName: 'div' }}
    >
      <Button className={css.main} rightIcon="chevron-down" data-testid="status-select">
        {props.value ? props.value : <String stringID="all" />}
      </Button>
    </Select>
  )
}
