import React from 'react'
import { FormGroup, Menu, Intent } from '@blueprintjs/core'
import { MultiSelect as BPMultiSelect, ItemRenderer } from '@blueprintjs/select'
import { connect, FormikContext } from 'formik'
import { get } from 'lodash-es'

import { errorCheck } from '@common/utils/formikHelpers'

import css from './FailureStrategyPanel.module.scss'

interface Option {
  label: string
  value: string
}

const MultiSelect = BPMultiSelect.ofType<Option>()

const errorTypes: Option[] = [
  {
    label: 'Permission Error',
    value: 'Permission'
  },
  {
    label: 'All Other',
    value: 'AllOther'
  }
]

const errorTypesMap: Record<string, Option> = errorTypes.reduce(
  (acc, option) => ({ ...acc, [option.value]: option }),
  {}
)

const itemRenderer: ItemRenderer<Option> = (item, itemProps) => {
  return <Menu.Item key={item.value} onClick={itemProps.handleClick} text={item.label} />
}

const tagRenderer = (item: Option): string => {
  return item.label
}

export interface FailureTypeMultiSelectProps {
  label: string
  name: string
}

export interface ConnectedFailureTypeMultiSelectProps extends FailureTypeMultiSelectProps {
  formik: FormikContext<{}>
}

export function FailureTypeMultiSelect(props: ConnectedFailureTypeMultiSelectProps): React.ReactElement {
  const { name, label, formik } = props

  const hasError = errorCheck(name, formik)
  const intent = hasError ? Intent.DANGER : Intent.NONE
  const helperText = hasError ? get(formik?.errors, name) : null

  const selectedItemsValue = new Set<string>(get(formik.values, name) || [])

  function handleItemSelect(item: Option): void {
    if (item.value === 'AllOther') {
      formik.setFieldValue(name, [item.value])
      return
    }
    formik.setFieldValue(name, [...selectedItemsValue, item.value])
  }

  function itemListPredicate(query: string, items: Option[]): Option[] {
    if (selectedItemsValue.has('AllOther')) {
      return []
    }

    return items.filter(item => {
      if (selectedItemsValue.has(item.value)) {
        return false
      }

      if (query) {
        return item.value.startsWith(query)
      }

      return true
    })
  }

  const selectedItems = [...selectedItemsValue].map((key: string) => errorTypesMap[key])

  function onRemove(value: string): void {
    const items = selectedItems.filter(item => item.label !== value)
    formik.setFieldValue(name, items)
  }

  return (
    <FormGroup label={label} labelFor={name} helperText={helperText} intent={intent}>
      <MultiSelect
        className={css.errorSelect}
        selectedItems={selectedItems}
        itemListPredicate={itemListPredicate}
        onItemSelect={handleItemSelect}
        items={errorTypes}
        fill
        popoverProps={{ minimal: true }}
        itemRenderer={itemRenderer}
        tagRenderer={tagRenderer}
        tagInputProps={{ onRemove, tagProps: { className: css.tag }, inputProps: { name } }}
        itemsEqual="value"
      />
    </FormGroup>
  )
}

export default connect<FailureTypeMultiSelectProps>(FailureTypeMultiSelect)
