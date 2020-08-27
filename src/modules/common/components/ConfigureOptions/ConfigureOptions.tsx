import React from 'react'
import { Button, useModalHook, Formik, Text, FormInput, SelectOption, MultiSelectOption } from '@wings-software/uikit'
import { Dialog, Classes, FormGroup } from '@blueprintjs/core'
import * as Yup from 'yup'
import cx from 'classnames'
import i18n from './ConfigureOptions.i18n'
import { useToaster } from '../Toaster/useToaster'
import css from './ConfigureOptions.module.scss'

export interface ConfigureOptionsProps {
  value: string
  variableName: string
  type: string | JSX.Element
  onChange?: (value: string) => void
  showDefaultValue?: boolean
  isRequiredDisabled?: boolean
  showAdvanced?: boolean
  fetchValues?: (done: (response: SelectOption[] | MultiSelectOption[]) => void) => void
}

export enum Validation {
  None = 'None',
  AllowedValues = 'AllowedValues',
  Regex = 'Regex'
}

export const RuntimeInputExpression = '{input}'
export const AllowedExpression = 'allowedValues'
export const RegexExpression = 'regex'
export const RequiredExpression = 'isRequired()'
export const DefaultValueExpression = 'default'
export const RegExInputExpression = /^\{input\}.?(?:allowedValues\((.*?)\)|regex\((.*?)\))?(?:.isRequired\(\)|.default\((.*?)\)){0,}$/
const RegExpression = /\${.+?}/
const IS_REQUIRED = 'isRequired()'

export function ConfigureOptions(props: ConfigureOptionsProps): JSX.Element {
  const {
    value,
    onChange,
    showDefaultValue = true,
    variableName,
    type,
    isRequiredDisabled = false,
    showAdvanced = false,
    fetchValues
  } = props
  const [input, setInput] = React.useState(value)
  const { showError } = useToaster()
  const [options, setOptions] = React.useState<SelectOption[] | MultiSelectOption[]>([])

  const [showModal, hideModal] = useModalHook(() => {
    if (!RegExInputExpression.test(input)) {
      showError(i18n.notValidExpression)
      return null
    }
    const isRequired = input.indexOf(IS_REQUIRED) > -1
    const response = input.match(RegExInputExpression)
    const allowedValues = response?.[1] || ''
    const regExValues = response?.[2] || ''
    const isAdvanced = RegExpression.test(input)
    fetchValues?.(data => {
      setOptions(data)
    })
    const inputValues = {
      isRequired,
      defaultValues: response?.[3] || '',
      allowedValues,
      regExValues,
      isAdvanced,
      validation:
        allowedValues.length > 0
          ? Validation.AllowedValues
          : regExValues.length > 0
          ? Validation.Regex
          : Validation.None
    }
    return (
      <Dialog
        isOpen={true}
        title={i18n.configureOptions}
        className={cx(css.dialog, Classes.DIALOG)}
        onClose={() => closeModal()}
      >
        <Formik
          initialValues={inputValues}
          validationSchema={Yup.object()}
          onSubmit={data => {
            let inputStr = RuntimeInputExpression
            if (data.validation === Validation.AllowedValues && data.allowedValues?.length > 0) {
              inputStr += `.${AllowedExpression}(${data.allowedValues})`
            } else if (data.validation === Validation.Regex && data.regExValues?.length > 0) {
              inputStr += `.${RegexExpression}(${data.regExValues})`
            }

            if (data.isRequired) {
              inputStr += `.${RequiredExpression}`
            }

            if (data.defaultValues?.length > 0) {
              inputStr += `.${DefaultValueExpression}(${data.defaultValues})`
            }
            setInput(inputStr)
            closeModal(inputStr)
          }}
        >
          {({ submitForm, values }) => (
            <>
              <div className={Classes.DIALOG_BODY}>
                <FormGroup className={css.label} label={i18n.variable} inline>
                  <Text>{variableName}</Text>
                </FormGroup>
                <FormGroup className={css.label} label={i18n.type} inline>
                  {typeof type === 'string' ? <Text>{type}</Text> : type}
                </FormGroup>
                {showDefaultValue &&
                  (fetchValues ? (
                    <FormInput.Select items={options} label={i18n.defaultValue} name="defaultValues" />
                  ) : (
                    <FormInput.Text label={i18n.defaultValue} name="defaultValues" />
                  ))}
                <FormInput.CheckBox
                  className={css.checkbox}
                  label={i18n.requiredDuringExecution}
                  name="isRequired"
                  disabled={isRequiredDisabled}
                />
                <div className={css.split}>
                  <FormInput.RadioGroup
                    name="validation"
                    label={i18n.validation}
                    items={[
                      { label: i18n.none, value: Validation.None },
                      { label: i18n.allowedValues, value: Validation.AllowedValues },
                      { label: i18n.regex, value: Validation.Regex }
                    ]}
                  />
                  <div className={css.line} />
                  {values.validation === Validation.AllowedValues && !fetchValues && (
                    <FormInput.TextArea
                      className={css.secondColumn}
                      label={i18n.allowedValuesHelp}
                      name="allowedValues"
                    />
                  )}
                  {values.validation === Validation.AllowedValues && fetchValues && (
                    <FormInput.MultiSelect
                      className={css.secondColumn}
                      items={options}
                      label={i18n.values}
                      name="allowedValues"
                    />
                  )}
                  {values.validation === Validation.Regex && (
                    <FormInput.TextArea className={css.secondColumn} label={i18n.regex} name="regExValues" />
                  )}
                </div>
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <Button intent="primary" text={i18n.submit} onClick={submitForm} /> &nbsp; &nbsp;
                <Button text={i18n.cancel} onClick={() => closeModal()} />
              </div>
            </>
          )}
        </Formik>
      </Dialog>
    )
  }, [value, showDefaultValue, variableName, type, isRequiredDisabled, showAdvanced, fetchValues])

  React.useEffect(() => {
    setInput(value)
  }, [value])

  const closeModal = React.useCallback(
    (str?: string) => {
      hideModal()
      onChange?.(str ?? input)
    },
    [hideModal, onChange, input]
  )

  return (
    <Button
      style={{ color: 'var(--grey-400)' }}
      minimal
      text={i18n.configureOptions}
      rightIcon="cog"
      onClick={showModal}
    />
  )
}
