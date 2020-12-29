import React from 'react'
import { Button, MultiTextInput } from '@wings-software/uikit'
import {
  FormGroup,
  HTMLInputProps,
  IFormGroupProps,
  IInputGroupProps,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Position
} from '@blueprintjs/core'
import { connect } from 'formik'
import { get } from 'lodash-es'
import { useStrings } from 'framework/exports'
import { errorCheck } from '@common/utils/formikHelpers'
// import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import css from './InstanceDropdownField.module.scss'

export enum InstanceTypes {
  Percentage = 'Percentage',
  Instances = 'Count'
}
export interface InstanceFieldValue {
  instanceType: InstanceTypes
  instance: number
}
interface InstanceDropdownFieldProps extends Omit<IFormGroupProps, 'label' | 'placeholder'> {
  onChange?: (value: InstanceFieldValue) => void
  value: InstanceFieldValue
  label: string
  name: string
  textProps?: Omit<IInputGroupProps & HTMLInputProps, 'onChange' | 'value' | 'type' | 'placeholder'>
}

export const InstanceDropdownField: React.FC<InstanceDropdownFieldProps> = ({
  value,
  label,
  name,
  onChange,
  textProps,
  ...restProps
}): JSX.Element => {
  const { getString } = useStrings()
  const selectedText =
    value.instanceType === InstanceTypes.Percentage
      ? getString('instanceFieldOptions.percentageText')
      : getString('instanceFieldOptions.instanceText')
  return (
    <FormGroup labelFor={name} label={label} className={css.formGroup} {...restProps}>
      <MultiTextInput
        width={380}
        name={name}
        textProps={{
          type: 'number',
          placeholder:
            value.instanceType === InstanceTypes.Percentage
              ? getString('instanceFieldOptions.percentagePlaceHolder')
              : getString('instanceFieldOptions.instanceHolder'),
          ...textProps
        }}
        onChange={val => {
          /* istanbul ignore next */ onChange?.({ ...value, instance: (val as unknown) as number })
        }}
        value={(value.instance as unknown) as string}
      />

      <Popover
        content={
          <Menu>
            <MenuItem
              text={getString('instanceFieldOptions.percentageText')}
              onClick={() => {
                onChange?.({ ...value, instanceType: InstanceTypes.Percentage })
              }}
              data-name="percentage"
            />
            <MenuItem
              text={getString('instanceFieldOptions.instanceText')}
              onClick={() => {
                onChange?.({ ...value, instanceType: InstanceTypes.Instances })
              }}
              data-name="instances"
            />
          </Menu>
        }
        position={Position.BOTTOM}
        className={css.instancePopover}
      >
        <Button rightIcon="caret-down" text={selectedText} minimal />
      </Popover>
    </FormGroup>
  )
}

export interface FormInstanceDropdownFieldProps extends Omit<InstanceDropdownFieldProps, 'value'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik?: any
  typeName: string
}

const FormInstanceDropdownField: React.FC<FormInstanceDropdownFieldProps> = (props): JSX.Element => {
  const { label, textProps, formik, typeName, name, onChange, ...restProps } = props
  const hasError = errorCheck(name, formik)

  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const value: number = get(formik?.values, name, 0)
  const typeValue: InstanceTypes = get(formik?.values, typeName, InstanceTypes.Percentage)

  return (
    <InstanceDropdownField
      label={label}
      name={name}
      textProps={{ ...textProps }}
      value={{ instance: value, instanceType: typeValue }}
      intent={intent}
      helperText={helperText}
      onChange={valueObj => {
        /* istanbul ignore next */
        formik.setFieldValue(name, valueObj.instance)
        formik.setFieldValue(typeName, valueObj.instanceType)
      }}
      {...rest}
    />
  )
}

export const FormInstanceDropdown = connect(FormInstanceDropdownField)
