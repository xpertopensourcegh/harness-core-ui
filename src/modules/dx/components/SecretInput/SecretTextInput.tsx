import React, { useState, useEffect } from 'react'
import { get, isPlainObject } from 'lodash-es'
import { Position, Classes, FormGroup, Intent, IFormGroupProps } from '@blueprintjs/core'
import { Layout, Text, Button, Color, Icon, Popover, FormInput } from '@wings-software/uikit'
import { connect, FormikContext } from 'formik'
import cx from 'classnames'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import type { SecretTextSpecDTO, SecretDTOV2 } from 'services/cd-ng'
import i18n from './SecretTextInput.i18n'
import css from './SecretTextInput.module.scss'

export interface SecretInfo {
  value: string
  isReference: boolean
}

interface FormikSecretTextInput extends SecretTextInputProps {
  formik: FormikContext<any>
}

interface SecretTextInputProps extends IFormGroupProps {
  fieldName: string
  secretFieldName: string
  label: string
  defaultSecretName: string
  defaultSecretId: string
  accountId: string
  projectIdentifier?: string
  orgIdentifier?: string
  onClickCreateSecret: () => void
  onEditSecret?: (val: SecretDTOV2) => void
  isEditMode?: boolean
  onChange?: (values: SecretInfo) => void
}

const errorCheck = (name: string, formik?: FormikContext<any>) =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isPlainObject(get(formik?.errors, name))

const SecretTextField: React.FC<FormikSecretTextInput> = props => {
  const { accountId, isEditMode = false } = props
  const [showCreateInlineSecret, setShowCreateInlineSecret] = useState<boolean>(false)
  const [isReference, setIsReference] = useState<boolean>()
  const [secretRefrence, setSecretRefrence] = useState({ name: '', identifier: '', secretManager: '' })

  useEffect(() => {
    if (props.formik.values[`pass${props.fieldName}`]?.length === 1) {
      setShowCreateInlineSecret(true)
    }
  }, [props.formik.values[`pass${props.fieldName}`]])

  return (
    <div className={css.secretFieldWrapper}>
      <Layout.Horizontal flex={{ distribution: 'space-between' }} margin={{ bottom: 'xsmall' }}>
        <Text color={Color.GREY_400} font={{ size: 'small' }}>
          {props.label}
        </Text>
        <Popover position={Position.BOTTOM}>
          <div className={css.secretPop}>
            <Icon name="key-main" size={24} height={12} width={24} /> <Icon name="chevron-down" size={14} />
          </div>
          <>
            {isEditMode || isReference ? (
              <Layout.Horizontal
                border={{ bottom: true }}
                padding={{ top: 'large', right: 'large', left: 'large', bottom: 'xsmall' }}
                flex={{ distribution: 'space-between' }}
              >
                <Layout.Vertical>
                  <Text font={{ size: 'xsmall' }} color={Color.DARK_400}>
                    {i18n.savedSecretText}
                  </Text>
                  <Text font={{ size: 'small' }} color={Color.BLUE_500}>
                    {isEditMode
                      ? props.formik?.values[props.secretFieldName]?.secretName
                      : props.formik?.values[props.fieldName]?.value}
                  </Text>
                </Layout.Vertical>
                <Button
                  icon="edit"
                  minimal
                  onClick={() =>
                    props.onEditSecret?.({
                      type: 'SecretText',
                      orgIdentifier: props.orgIdentifier,
                      projectIdentifier: props.projectIdentifier,
                      identifier: props.formik?.values[props.secretFieldName]?.secretId,
                      name: props.formik?.values[props.secretFieldName]?.secretName,
                      tags: {},
                      spec: {
                        value: props.formik?.values[props.fieldName]?.value,
                        valueType: 'Inline',
                        secretManagerIdentifier: props.formik?.values[props.secretFieldName]?.secretManager?.value
                      }
                    } as SecretDTOV2)
                  }
                  className={Classes.POPOVER_DISMISS}
                />
              </Layout.Horizontal>
            ) : null}
            <Text
              style={{ cursor: 'pointer' }}
              height={'40px'}
              padding={{ top: 'small', bottom: 'small', right: 'large', left: 'large' }}
              border={{ bottom: true }}
              color={Color.DARK_600}
              onClick={() => {
                props.onClickCreateSecret()
              }}
              className={Classes.POPOVER_DISMISS}
            >
              {i18n.createSecretText}
            </Text>
            <SecretReference
              accountIdentifier={props.accountId}
              projectIdentifier={props.projectIdentifier}
              orgIdentifier={props.orgIdentifier}
              onSelect={secret => {
                setShowCreateInlineSecret(false)
                props.onChange?.({ value: secret.name as string, isReference: true })
                setIsReference(true)
                setSecretRefrence({
                  name: secret?.name as string,
                  identifier: secret?.identifier as string,
                  secretManager: (secret?.spec as SecretTextSpecDTO).secretManagerIdentifier as string
                })
                props.formik?.setFieldValue(props.secretFieldName, {
                  secretName: secret?.name,
                  scope: secret?.scope,
                  secretId: secret?.identifier,
                  secretManager: {
                    value: (secret?.spec as SecretTextSpecDTO).secretManagerIdentifier,
                    label: (secret?.spec as SecretTextSpecDTO).secretManagerIdentifier
                  }
                })
              }}
            />
          </>
        </Popover>
      </Layout.Horizontal>

      <FormInput.Text
        name={`pass${props.fieldName}`}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          props.onChange?.({ value: event.currentTarget?.value, isReference: false })
        }}
        inputGroup={{ type: isReference || isEditMode ? 'text' : 'password', readOnly: isReference || isEditMode }}
        className={cx({
          [css.secretFieldHide]: isReference || isEditMode,
          [css.secretField]: !(isReference || isEditMode)
        })}
      />
      {isReference || isEditMode ? (
        <Layout.Vertical>
          <Layout.Horizontal height={'36px'} background={Color.GREY_200} border={{ radius: 6 }} padding={'xsmall'}>
            <Text tooltip={i18n.ENCRYPTED_TEXT} tooltipProps={{ isDark: true }} className={css.secretName}>
              {props.isEditMode ? props.formik?.values[props.secretFieldName]?.secretName : secretRefrence.name}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal padding={{ top: 'xsmall' }} font={'small'}>
            <Text margin={{ right: 'xsmall' }} color={Color.GREY_400} font={'small'}>
              {i18n.ID}
            </Text>
            <Text font={'small'} margin={{ right: 'xsmall' }}>
              {props.isEditMode ? props.formik?.values[props.secretFieldName]?.secretId : secretRefrence.identifier}
            </Text>
            <Icon name={'full-circle'} size={2} className={css.dotIcon} />
            <Text margin={{ right: 'xsmall' }} color={Color.GREY_400} font={'small'}>
              {i18n.SECRET_MANAGER}
            </Text>
            <Text font={'small'}>
              {props.isEditMode
                ? props.formik?.values[props.secretFieldName]?.secretManager?.label
                : secretRefrence.secretManager}
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
      ) : null}
      {isReference || isEditMode ? null : (
        <Layout.Horizontal flex={{ distribution: 'space-between' }} height={'14px'} margin={{ top: 'xsmall' }}>
          <Text font={{ size: 'xsmall', weight: 'bold' }} color={Color.GREY_800}>
            {i18n.SECRET_INFO_TEXT}
          </Text>
          <Button
            text="View"
            rightIcon={showCreateInlineSecret ? 'chevron-up' : 'chevron-down'}
            intent="primary"
            minimal
            font={'small'}
            iconProps={{ size: 12 }}
            className={css.viewBtn}
            onClick={() => setShowCreateInlineSecret(!showCreateInlineSecret)}
          />
        </Layout.Horizontal>
      )}
      {showCreateInlineSecret && !isEditMode ? (
        <FormikCreateInlineSecret
          name={props.secretFieldName as string}
          defaultSecretName={props.defaultSecretName}
          defaultSecretId={props.defaultSecretId}
          accountIdentifier={accountId}
          projectIdentifier={props.projectIdentifier}
          orgIdentifier={props.orgIdentifier}
        />
      ) : null}
    </div>
  )
}

const FormikSecretTextInputInternal: React.FC<FormikSecretTextInput> = props => {
  const { formik, fieldName, ...rest } = props
  const hasError = errorCheck(fieldName, formik)
  const {
    intent = hasError ? Intent.DANGER : Intent.NONE,
    helperText = hasError ? get(formik?.errors, fieldName) : null
  } = rest
  return (
    <FormGroup helperText={helperText} intent={intent}>
      <SecretTextField
        {...rest}
        formik={formik}
        fieldName={fieldName}
        onChange={values => {
          if (values?.value === '') {
            formik.setFieldValue(fieldName, undefined)
          } else {
            formik?.setFieldValue(fieldName, values)
          }
        }}
      />
    </FormGroup>
  )
}

export const FormikSecretTextInput = connect<Omit<FormikSecretTextInput, 'formik'>>(FormikSecretTextInputInternal)

export default SecretTextField
