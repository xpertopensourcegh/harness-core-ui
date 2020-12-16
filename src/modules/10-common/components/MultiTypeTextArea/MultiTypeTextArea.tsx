import React from 'react'
import { FormGroup, IFormGroupProps, Intent, ITextAreaProps, TextArea } from '@blueprintjs/core'
import {
  ExpressionAndRuntimeType,
  ExpressionAndRuntimeTypeProps,
  MultiTypeInputValue,
  FixedTypeComponentProps
} from '@wings-software/uikit'
import { connect } from 'formik'
import { get } from 'lodash-es'
import cx from 'classnames'

import { errorCheck } from '@common/utils/formikHelpers'

import css from './MultiTypeTextArea.module.scss'

function MultiTypeTextAreaFixedTypeComponent(
  props: FixedTypeComponentProps & MultiTypeTextAreaProps['textAreaProps']
): React.ReactElement {
  const { onChange, value, ...restProps } = props
  return (
    <TextArea
      growVertically={false}
      {...restProps}
      className={cx(css.input, restProps.className)}
      value={value as string}
      onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event.target.value, MultiTypeInputValue.STRING)
      }}
    />
  )
}

export interface MultiTypeTextAreaProps
  extends Omit<ExpressionAndRuntimeTypeProps, 'fixedTypeComponent' | 'fixedTypeComponentProps'> {
  textAreaProps?: Omit<ITextAreaProps, 'onChange' | 'value'>
}

export const MultiTypeTextArea: React.FC<MultiTypeTextAreaProps> = ({ textAreaProps, ...rest }) => {
  return (
    <ExpressionAndRuntimeType
      {...rest}
      fixedTypeComponentProps={textAreaProps}
      fixedTypeComponent={MultiTypeTextAreaFixedTypeComponent}
    />
  )
}

export interface FormMultiTypeTextAreaProps extends Omit<IFormGroupProps, 'label' | 'placeholder'> {
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
      name,
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
