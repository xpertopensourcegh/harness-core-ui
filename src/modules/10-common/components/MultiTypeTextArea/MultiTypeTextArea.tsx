import React from 'react'
import { FormGroup, IFormGroupProps, Intent, ITextAreaProps, TextArea } from '@blueprintjs/core'
import { ExpressionAndRuntimeType, ExpressionAndRuntimeTypeProps, MultiTypeInputValue } from '@wings-software/uikit'
import { connect, FormikContext, isObject } from 'formik'
import { get } from 'lodash-es'
import cx from 'classnames'
import css from './MultiTypeTextArea.module.scss'

const errorCheck = (name: string, formik?: FormikContext<any>): boolean | '' | 0 | undefined =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isObject(get(formik?.errors, name))

export interface MultiTypeTextAreaProps extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent'> {
  textAreaProps?: ITextAreaProps
}

export const MultiTypeTextArea: React.FC<MultiTypeTextAreaProps> = ({ textAreaProps, ...rest }) => {
  const { className = '', value = '', ...restProps } = textAreaProps || {}
  const fixedTypeComponent = React.useCallback(
    props => {
      const { onChange } = props
      return (
        <TextArea
          growVertically={false}
          className={cx(css.input, className)}
          {...restProps}
          value={value}
          name={rest.name}
          onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(event.target.value, MultiTypeInputValue.STRING)
          }}
        />
      )
    },
    [value]
  )
  return <ExpressionAndRuntimeType {...rest} fixedTypeComponent={fixedTypeComponent} />
}

export interface FormMultiTypeTextAreaProps extends Omit<IFormGroupProps, 'label' | 'palceholder'> {
  label: string
  name: string
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik?: any // TODO: Remove this but not sure why FormikContext<any> was not working
  multiTypeTextArea?: Omit<MultiTypeTextAreaProps, 'onChange'>
  onChange?: MultiTypeTextAreaProps['onChange']
}

export const FormMultiTypeTextArea: React.FC<FormMultiTypeTextAreaProps> = props => {
  const { label, multiTypeTextArea, placeholder, formik, name, onChange, ...restProps } = props
  const hasError = errorCheck(name, formik)

  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const value: string = get(formik?.values, name, '')
  const customProps: MultiTypeTextAreaProps = {
    ...multiTypeTextArea,
    name,
    textAreaProps: {
      ...multiTypeTextArea?.textAreaProps,
      value,
      placeholder,
      onBlur: () => formik?.setFieldTouched(name)
    }
  }

  return (
    <FormGroup {...rest} labelFor={name} helperText={helperText} intent={intent} disabled={disabled} label={label}>
      <MultiTypeTextArea
        value={value}
        {...customProps}
        onChange={(val, valueType) => {
          formik?.setFieldValue(name, val)
          onChange?.(val, valueType)
        }}
      />
    </FormGroup>
  )
}
export const FormMultiTypeTextAreaField = connect(FormMultiTypeTextArea)
