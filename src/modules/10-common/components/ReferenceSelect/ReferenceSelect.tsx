import React from 'react'
import {
  Popover,
  Button,
  ExpressionAndRuntimeTypeProps,
  ExpressionAndRuntimeType,
  MultiTypeInputValue,
  Layout,
  Text,
  Color,
  FixedTypeComponentProps,
  MultiTypeInputType
} from '@wings-software/uicore'
import { Position, Classes } from '@blueprintjs/core'
import type { Scope } from '@common/interfaces/SecretsInterface'
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
  disabled?: boolean
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
    disabled,
    ...referenceProps
  } = props
  return (
    <Popover position={Position.BOTTOM} minimal={true}>
      <Button
        minimal
        className={css.container}
        style={{ width }}
        rightIcon="caret-down"
        disabled={disabled}
        onClick={e => {
          if (disabled) e.preventDefault()
        }}
      >
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
export interface MultiTypeReferenceInputProps<T extends MinimalObject>
  extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent' | 'fixedTypeComponentProps'> {
  referenceSelectProps: Omit<ReferenceSelectProps<T>, 'onChange'>
}
function MultiTypeReferenceInputFixedTypeComponent<T extends MinimalObject>(
  props: FixedTypeComponentProps & MultiTypeReferenceInputProps<T>['referenceSelectProps']
): React.ReactElement {
  const { onChange, selected, width = 300, ...restProps } = props
  return (
    <ReferenceSelect
      {...restProps}
      selected={selected}
      width={width - 28}
      onChange={(record, scope) => {
        onChange?.({ record, scope } as any, MultiTypeInputValue.SELECT_OPTION, MultiTypeInputType.FIXED)
      }}
    />
  )
}
export function MultiTypeReferenceInput<T extends MinimalObject>(props: MultiTypeReferenceInputProps<T>): JSX.Element {
  const { referenceSelectProps, ...rest } = props
  return (
    <ExpressionAndRuntimeType<MultiTypeReferenceInputProps<T>['referenceSelectProps']>
      width={referenceSelectProps.width}
      {...rest}
      fixedTypeComponentProps={referenceSelectProps}
      fixedTypeComponent={MultiTypeReferenceInputFixedTypeComponent}
    />
  )
}
