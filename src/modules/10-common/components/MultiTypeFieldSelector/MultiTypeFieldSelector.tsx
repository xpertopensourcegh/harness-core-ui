import React from 'react'
import { MultiTypeInputType, Button, IconName, Icon, Color, getMultiTypeFromValue } from '@wings-software/uikit'
import { Popover, Menu, IFormGroupProps, Intent, FormGroup } from '@blueprintjs/core'
import cx from 'classnames'
import { FormikContext, connect } from 'formik'
import { get } from 'lodash-es'

import { String } from 'framework/exports'
import { errorCheck, RUNTIME_INPUT_VALUE } from '@common/utils/formikHelpers'

import css from './MultiTypeFieldSelctor.module.scss'

export interface MultiTypeFieldSelectorProps extends Omit<IFormGroupProps, 'label' | 'placeholder'> {
  children: Exclude<React.ReactNode, null | undefined>
  name: string
  label: string
  formik?: FormikContext<any>
  defaultValueToReset?: unknown
}

const TypeIcon: Record<MultiTypeInputType, IconName> = {
  FIXED: 'fixed-input',
  RUNTIME: 'runtime-input',
  EXPRESSION: 'expression-input'
}

const TypeColor: Record<MultiTypeInputType, string> = {
  FIXED: Color.BLUE_500,
  RUNTIME: Color.PURPLE_500,
  EXPRESSION: Color.YELLOW_500
}

function TypeSelector(props: {
  type: MultiTypeInputType
  onChange: (type: MultiTypeInputType) => void
}): React.ReactElement {
  const { type, onChange } = props
  return (
    <Popover
      position="bottom-right"
      interactionKind="click"
      minimal
      wrapperTagName="div"
      targetTagName="div"
      targetClassName={css.typeSelector}
    >
      <Button minimal className={css.btn}>
        <Icon className={cx(css.icon, (css as any)[type.toLowerCase()])} size={10} name={TypeIcon[type]} />
        <String className={css.btnText} stringID={`inputTypes.${type}`} />
      </Button>
      <Menu className={css.menu}>
        <Menu.Item
          labelElement={<Icon name={TypeIcon.FIXED} color={TypeColor.FIXED} />}
          text={<String stringID="inputTypes.FIXED" />}
          active={type === MultiTypeInputType.FIXED}
          intent="none"
          onClick={() => onChange(MultiTypeInputType.FIXED)}
        />
        <Menu.Item
          labelElement={<Icon name={TypeIcon.RUNTIME} color={TypeColor.RUNTIME} />}
          text={<String stringID="inputTypes.RUNTIME" />}
          active={type === MultiTypeInputType.RUNTIME}
          intent="none"
          onClick={() => onChange(MultiTypeInputType.RUNTIME)}
        />
      </Menu>
    </Popover>
  )
}

export function MultiTypeFieldSelector(props: MultiTypeFieldSelectorProps): React.ReactElement {
  const { formik, label, name, children, defaultValueToReset, ...restProps } = props
  const hasError = errorCheck(name, formik)

  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, name) : null,
    disabled,
    ...rest
  } = restProps

  const value: string = get(formik?.values, name, '')

  const [type, setType] = React.useState(getMultiTypeFromValue(value))

  function handleChange(newType: MultiTypeInputType): void {
    setType(newType)
    if (newType === type) return
    formik?.setFieldValue(
      name,
      newType === MultiTypeInputType.RUNTIME
        ? RUNTIME_INPUT_VALUE
        : defaultValueToReset
        ? defaultValueToReset
        : undefined
    )
  }

  return (
    <FormGroup
      {...rest}
      labelFor={name}
      helperText={helperText}
      intent={intent}
      disabled={disabled}
      label={
        <div className={css.formLabel}>
          {type === MultiTypeInputType.FIXED ? (
            label
          ) : (
            <span>
              {label} <b>{RUNTIME_INPUT_VALUE}</b>
            </span>
          )}
          <TypeSelector type={type} onChange={handleChange} />
        </div>
      }
    >
      {type === MultiTypeInputType.FIXED ? children : null}
    </FormGroup>
  )
}

export default connect(MultiTypeFieldSelector)
