import React from 'react'
import { Button, useModalHook, Formik, Text, FormInput, SelectOption, MultiSelectOption } from '@wings-software/uikit'
import { Dialog, Classes, FormGroup, Position } from '@blueprintjs/core'
import * as Yup from 'yup'
import cx from 'classnames'
import i18n from './ConfigureOptions.i18n'
import { useToaster } from '../../../10-common/components/Toaster/useToaster'
import css from './ConfigureOptions.module.scss'

export interface ConfigureOptionsProps {
  value: string
  isRequired?: boolean
  defaultValue?: string
  variableName: string
  type: string | JSX.Element
  onChange?: (value: string, defaultValue?: string, isRequired?: boolean) => void
  showDefaultField?: boolean
  showRequiredField?: boolean
  showAdvanced?: boolean
  fetchValues?: (done: (response: SelectOption[] | MultiSelectOption[]) => void) => void
}

export enum Validation {
  None = 'None',
  AllowedValues = 'AllowedValues',
  Regex = 'Regex'
}

export const RuntimeInputExpression = '${input}'
export const AllowedExpression = 'allowedValues'
export const RegexExpression = 'regex'
export const RegExInputExpression = /^\$\{input\}.?(?:allowedValues\((.*?)\)|regex\((.*?)\))?$/
const RegExpression = /jexl\((.*?)\)/
const JEXL = 'jexl'

export function ConfigureOptions(props: ConfigureOptionsProps): JSX.Element {
  const {
    value,
    isRequired,
    defaultValue,
    onChange,
    showDefaultField = true,
    variableName,
    type,
    showRequiredField = false,
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
    const response = input.match(RegExInputExpression)
    const allowedValueStr = response?.[1] || ''
    let allowedValues: string[] = []
    const regExValues = response?.[2] || ''
    const isAdvanced = RegExpression.test(input)
    let advancedValue = ''
    if (isAdvanced) {
      advancedValue = allowedValueStr.match(RegExpression)?.[1] || /* istanbul ignore next */ ''
    } else if (allowedValueStr.length > 0) {
      allowedValues = allowedValueStr.split(',')
    }
    fetchValues?.(data => {
      setOptions(data)
    })
    const inputValues = {
      isRequired,
      defaultValue,
      allowedValues,
      regExValues,
      isAdvanced,
      advancedValue,
      validation:
        allowedValues.length > 0 || isAdvanced
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
            if (
              data.validation === Validation.AllowedValues &&
              (data.allowedValues?.length > 0 || data.advancedValue.length > 0)
            ) {
              if (data.isAdvanced) {
                inputStr += `.${AllowedExpression}(${JEXL}(${data.advancedValue}))`
              } else {
                inputStr += `.${AllowedExpression}(${data.allowedValues.join(',')})`
              }
            } /* istanbul ignore else */ else if (
              data.validation === Validation.Regex &&
              data.regExValues?.length > 0
            ) {
              inputStr += `.${RegexExpression}(${data.regExValues})`
            }
            setInput(inputStr)
            closeModal(inputStr, data.defaultValue, data.isRequired)
          }}
        >
          {({ submitForm, values, setFieldValue }) => (
            <>
              <div className={Classes.DIALOG_BODY}>
                <FormGroup className={css.label} label={i18n.variable} inline>
                  <Text>{variableName}</Text>
                </FormGroup>
                <FormGroup className={css.label} label={i18n.type} inline>
                  {typeof type === 'string' ? <Text>{type}</Text> : type}
                </FormGroup>
                {showDefaultField &&
                  (fetchValues ? (
                    <FormInput.Select items={options} label={i18n.defaultValue} name="defaultValue" />
                  ) : (
                    <FormInput.Text label={i18n.defaultValue} name="defaultValue" />
                  ))}
                {showRequiredField && (
                  <FormInput.CheckBox className={css.checkbox} label={i18n.requiredDuringExecution} name="isRequired" />
                )}
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
                  {values.validation !== Validation.None && <div className={css.line} />}
                  {values.validation === Validation.AllowedValues && (
                    <div className={css.allowedOptions}>
                      {showAdvanced ? (
                        <span className={css.advancedBtn}>
                          <Button
                            minimal
                            intent="primary"
                            tooltip={i18n.advancedHelp}
                            tooltipProps={{ position: Position.RIGHT }}
                            text={values.isAdvanced ? i18n.returnToBasic : i18n.advanced}
                            onClick={() => {
                              setFieldValue('isAdvanced', !values.isAdvanced)
                            }}
                          />
                        </span>
                      ) : /* istanbul ignore next */ null}
                      {values.isAdvanced ? (
                        <FormInput.TextArea
                          name="advancedValue"
                          className={css.secondColumn}
                          label={i18n.jexlLabel}
                          placeholder={i18n.jexlPlaceholder}
                        />
                      ) : (
                        <>
                          {!fetchValues ? (
                            <FormInput.TagInput
                              className={css.secondColumn}
                              label={i18n.allowedValuesHelp}
                              name="allowedValues"
                              items={[]}
                              labelFor={name => (typeof name === 'string' ? name : '')}
                              itemFromNewTag={newTag => newTag}
                              tagInputProps={{
                                noInputBorder: false,
                                openOnKeyDown: false,
                                showAddTagButton: false,
                                showClearAllButton: true,
                                allowNewTag: true,
                                placeholder: i18n.enterTags,
                                getTagProps: () => ({ intent: 'primary', minimal: true })
                              }}
                            />
                          ) : (
                            <FormInput.MultiSelect
                              className={css.secondColumn}
                              items={options}
                              label={i18n.values}
                              name="allowedValues"
                            />
                          )}
                        </>
                      )}
                    </div>
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
  }, [value, showDefaultField, variableName, type, showRequiredField, showAdvanced, fetchValues])

  React.useEffect(() => {
    setInput(value)
  }, [value])

  const closeModal = React.useCallback(
    (str?: string, defaultStr?: string, required?: boolean) => {
      hideModal()
      onChange?.(str ?? input, defaultStr, required)
    },
    [hideModal, onChange, input]
  )

  return (
    <Button style={{ color: 'var(--grey-400)' }} minimal rightIcon="cog" id="configureOptions" onClick={showModal} />
  )
}
