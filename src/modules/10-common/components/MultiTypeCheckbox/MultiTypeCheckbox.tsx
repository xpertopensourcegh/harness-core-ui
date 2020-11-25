import React from 'react'
import { FormGroup, ICheckboxProps, IFormGroupProps, Intent } from '@blueprintjs/core'
import {
  Checkbox,
  ExpressionAndRuntimeType,
  ExpressionAndRuntimeTypeProps,
  getMultiTypeFromValue,
  MultiTypeInputType,
  MultiTypeInputValue
} from '@wings-software/uikit'
import cx from 'classnames'
import { get } from 'lodash-es'
import { connect, FormikContext, isObject } from 'formik'
import css from './MultiTypeCheckbox.module.scss'

const errorCheck = (name: string, formik?: FormikContext<any>): boolean | '' | 0 | undefined =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isObject(get(formik?.errors, name))

export interface MultiTypeCheckboxProps extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent'> {
  textboxProps?: Omit<ICheckboxProps, 'onChange'>
}

export const MultiTypeCheckbox: React.FC<MultiTypeCheckboxProps> = ({
  textboxProps,
  value = false,
  children,
  ...rest
}) => {
  const { className = '', ...restProps } = textboxProps || {}
  const fixedTypeComponent = React.useCallback(
    props => {
      const { onChange } = props
      return (
        <Checkbox
          className={cx(css.input, className)}
          {...restProps}
          checked={value as boolean}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            onChange?.(event.currentTarget.checked, MultiTypeInputValue.STRING)
          }}
        >
          {children}
        </Checkbox>
      )
    },
    [value]
  )
  return <ExpressionAndRuntimeType value={value as string} {...rest} fixedTypeComponent={fixedTypeComponent} />
}

export interface FormMultiTypeTextboxProps extends Omit<IFormGroupProps, 'label'> {
  label: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik?: any // TODO: Remove this but not sure why FormikContext<any> was not working
  multiTypeTextbox?: Omit<MultiTypeCheckboxProps, 'onChange'>
  onChange?: MultiTypeCheckboxProps['onChange']
}

export const FormMultiTypeCheckbox: React.FC<FormMultiTypeTextboxProps> = props => {
  const { label, multiTypeTextbox, formik, name, onChange, ...restProps } = props
  const hasError = errorCheck(name, formik)

  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const { textboxProps, ...restMultiProps } = multiTypeTextbox || {}
  const value: boolean = get(formik?.values, name, false)
  const isFixedValue = getMultiTypeFromValue(value) === MultiTypeInputType.FIXED
  return (
    <FormGroup
      {...rest}
      label={!isFixedValue ? label : undefined}
      labelFor={name}
      helperText={helperText}
      intent={intent}
      disabled={disabled}
    >
      <MultiTypeCheckbox
        textboxProps={{ name, label, ...textboxProps }}
        value={value}
        {...restMultiProps}
        onChange={(val, valueType) => {
          formik?.setFieldValue(name, val)
          onChange?.(val, valueType)
        }}
      />
    </FormGroup>
  )
}
export const FormMultiTypeCheckboxField = connect(FormMultiTypeCheckbox)
