import React, { useCallback } from 'react'
import {
  Popover,
  Button,
  ExpressionAndRuntimeTypeProps,
  ExpressionAndRuntimeType,
  MultiTypeInputValue
} from '@wings-software/uikit'
import { Position } from '@blueprintjs/core'
import { ReferenceProps, Scope, ReferenceSelector } from '../ReferenceSelector/ReferenceSelector'
import css from './ReferenceSelect.module.scss'

interface MinimalObject {
  identifier?: string
  name?: string
}

export interface ReferenceSelectProps<T extends MinimalObject> extends Omit<ReferenceProps<T>, 'onSelect'> {
  name: string
  placeholder: string
  selected?: {
    label: string
    value: string
    scope: Scope
  }
  width?: number
  onChange: (record: T, scope: Scope) => void
}

export function ReferenceSelect<T extends MinimalObject>(props: ReferenceSelectProps<T>): JSX.Element {
  const { name, placeholder, selected, onChange, width = 300, ...referenceProps } = props
  return (
    <Popover position={Position.BOTTOM} minimal={true}>
      <Button minimal className={css.container} style={{ width }} rightIcon="caret-down">
        {selected ? selected.label : <span className={css.placeholder}>{placeholder}</span>}
      </Button>
      <ReferenceSelector<T> {...referenceProps} onSelect={(record, scope) => onChange(record, scope)} />
    </Popover>
  )
}

interface MultiTypeReferenceInputProps<T extends MinimalObject>
  extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent'> {
  referenceSelectProps: Omit<ReferenceSelectProps<T>, 'onChange'>
  convertRecordAndScopeToString: (record: T, scope: Scope) => void
}

export function MultiTypeReferenceInput<T extends MinimalObject>(props: MultiTypeReferenceInputProps<T>): JSX.Element {
  const { referenceSelectProps, convertRecordAndScopeToString, ...rest } = props
  const { selected, width = 300, ...restProps } = referenceSelectProps || {}
  const fixedTypeComponent = useCallback(
    fixedProps => {
      const { onChange } = fixedProps
      return (
        <ReferenceSelect
          {...restProps}
          selected={selected}
          width={width - 28}
          onChange={(record, scope) => {
            onChange?.(
              {
                label: record.name,
                value: convertRecordAndScopeToString(record, scope),
                scope: scope
              },
              MultiTypeInputValue.SELECT_OPTION
            )
          }}
        />
      )
    },
    [selected, selected?.value]
  )
  return (
    <ExpressionAndRuntimeType width={referenceSelectProps.width} {...rest} fixedTypeComponent={fixedTypeComponent} />
  )
}
