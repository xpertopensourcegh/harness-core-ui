import React, { useCallback } from 'react'
import {
  Popover,
  Button,
  ExpressionAndRuntimeTypeProps,
  ExpressionAndRuntimeType,
  MultiTypeInputValue,
  Layout,
  Text,
  Color
} from '@wings-software/uikit'
import { Position, Classes } from '@blueprintjs/core'
import { Scope } from '@common/interfaces/SecretsInterface'
import { EntityReferenceProps, EntityReference } from '../EntityReference/EntityReference'
import css from './ReferenceSelect.module.scss'

export interface MinimalObject {
  identifier?: string
  name?: string
}

export interface Item {
  label: string
  value: string
  scope: Scope
}

export interface ReferenceSelectProps<T extends MinimalObject> extends Omit<EntityReferenceProps<T>, 'onSelect'> {
  name: string
  placeholder: string
  selected?: Item
  createNewLabel?: string
  createNewHandler?: () => void
  selectedRenderer?: JSX.Element
  editRenderer?: JSX.Element
  width?: number
  isNewConnectorLabelVisible?: boolean
  onChange: (record: T, scope: Scope) => void
}

export function ReferenceSelect<T extends MinimalObject>(props: ReferenceSelectProps<T>): JSX.Element {
  const {
    name,
    placeholder,
    selected,
    onChange,
    width = 300,
    createNewLabel,
    createNewHandler,
    isNewConnectorLabelVisible = true,
    editRenderer,
    selectedRenderer,
    ...referenceProps
  } = props
  return (
    <Popover position={Position.BOTTOM} minimal={true}>
      <Button minimal className={css.container} style={{ width }} rightIcon="caret-down">
        {selected ? selectedRenderer || selected.label : <span className={css.placeholder}>{placeholder}</span>}
      </Button>
      <div>
        {editRenderer && selected && selected.value && (
          <Layout.Horizontal
            padding="medium"
            style={{
              borderBottom: '1px solid var(--grey-250)'
            }}
          >
            {editRenderer}
          </Layout.Horizontal>
        )}
        {createNewLabel && createNewHandler && isNewConnectorLabelVisible && (
          <Layout.Horizontal
            padding="small"
            style={{
              borderBottom: '1px solid var(--grey-250)'
            }}
            className={Classes.POPOVER_DISMISS}
          >
            <Button
              minimal
              onClick={() => {
                createNewHandler?.()
              }}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <Text color={Color.BLUE_500}>+ {createNewLabel}</Text>
            </Button>
          </Layout.Horizontal>
        )}
        <EntityReference<T> {...referenceProps} onSelect={(record, scope) => onChange(record, scope)} />
      </div>
    </Popover>
  )
}

interface MultiTypeReferenceInputProps<T extends MinimalObject>
  extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent'> {
  referenceSelectProps: Omit<ReferenceSelectProps<T>, 'onChange'>
}

export function MultiTypeReferenceInput<T extends MinimalObject>(props: MultiTypeReferenceInputProps<T>): JSX.Element {
  const { referenceSelectProps, ...rest } = props
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
                value:
                  scope === Scope.ORG || scope === Scope.ACCOUNT ? `${scope}.${record.identifier}` : record.identifier,
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
