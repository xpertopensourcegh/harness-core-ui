import React from 'react'
import { FormGroup, Menu, Intent } from '@blueprintjs/core'
import { MultiSelect as BPMultiSelect, ItemRenderer } from '@blueprintjs/select'
import { connect, FormikContext } from 'formik'
import { get } from 'lodash-es'

import { errorCheck } from '@common/utils/formikHelpers'
import { useStrings } from 'framework/exports'

import { ErrorType } from './StrategySelection/StrategyConfig'
import css from './FailureStrategyPanel.module.scss'

interface Option {
  label: string
  value: string
}

const errorTypesOrder: ErrorType[] = [
  ErrorType.Authentication,
  ErrorType.Authorization,
  ErrorType.Connectivity,
  ErrorType.Timeout,
  ErrorType.Verification,
  ErrorType.DelegateProvisioning,
  ErrorType.AnyOther
]

const MultiSelect = BPMultiSelect.ofType<Option>()

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
  const { getString } = useStrings()

  const hasError = errorCheck(name, formik)
  const intent = hasError ? Intent.DANGER : Intent.NONE
  const helperText = hasError ? get(formik?.errors, name) : null
  const errorTypes: Option[] = React.useMemo(() => {
    return errorTypesOrder.map(e => ({ value: e, label: getString(`failureStrategies.errorTypeLabels.${e}`) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedItemsValue = new Set<ErrorType>(get(formik.values, name) || [])

  function handleItemSelect(item: Option): void {
    if (item.value === ErrorType.AnyOther) {
      formik.setFieldValue(name, [item.value])
      formik.setFieldTouched(name, true)
      return
    }
    formik.setFieldValue(name, [...selectedItemsValue, item.value])
    formik.setFieldTouched(name, true)
  }

  function itemListPredicate(query: string, items: Option[]): Option[] {
    if (selectedItemsValue.has(ErrorType.AnyOther)) {
      return []
    }

    return items.filter(item => {
      if (selectedItemsValue.has(item.value as ErrorType)) {
        return false
      }

      if (query) {
        return item.value.startsWith(query)
      }

      return true
    })
  }

  const selectedItems = [...selectedItemsValue].map((key: ErrorType) => errorTypes[errorTypesOrder.indexOf(key)])

  function onRemove(value: string): void {
    const items = selectedItems.filter(item => item.label !== value)
    formik.setFieldValue(name, items)
    formik.setFieldTouched(name, true)
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
