import React, { useState } from 'react'
import type { FormikProps } from 'formik'
import { Position, Classes } from '@blueprintjs/core'
import { Layout, Text, Button, Color, Icon, Popover } from '@wings-software/uikit'
import { connect } from 'formik'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import type { EncryptedDataDTO } from 'services/cd-ng'
import i18n from './SecretTextInput.i18n'
import css from './SecretTextInput.module.scss'

export interface SecretInfo {
  value: string
  isReference: boolean
}
interface SecretTextInputProps {
  fieldName: string
  secretFieldName: string
  label: string
  defaultSecretName: string
  defaultSecretId: string
  formikProps: FormikProps<any>
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  onClickCreateSecret: () => void
  onEditSecret?: (val: EncryptedDataDTO) => void

  isEditMode?: boolean
  onChange?: (values: SecretInfo) => void
}

const SecretTextField: React.FC<SecretTextInputProps> = props => {
  const { accountId, isEditMode = false } = props
  const [showCreateInlineSecret, setShowCreateInlineSecret] = useState<boolean>(false)
  const [isReference, setIsReference] = useState<boolean>()
  const [secretRefrence, setSecretRefrence] = useState({ name: '', identifier: '', secretManager: '' })

  return (
    <div className={css.secretFieldWrapper}>
      <Layout.Horizontal flex={{ distribution: 'space-between' }}>
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
                      ? props.formikProps.values[props.secretFieldName]?.secretName
                      : props.formikProps.values[props.fieldName]?.value}
                  </Text>
                </Layout.Vertical>
                <Button
                  icon="edit"
                  minimal
                  onClick={() =>
                    props.onEditSecret?.({
                      value: props.formikProps.values[props.fieldName]?.value,
                      identifier: props.formikProps.values[props.secretFieldName]?.secretId,
                      name: props.formikProps.values[props.secretFieldName]?.secretName,
                      secretManager: props.formikProps.values[props.secretFieldName]?.secretManager?.value,
                      secretManagerName: props.formikProps.values[props.secretFieldName]?.secretManager?.label,
                      account: props.accountId,
                      org: props.orgIdentifier,
                      project: props.projectIdentifier
                    })
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
                props.onChange?.({ value: secret.name as string, isReference: true })

                setIsReference(true)
                setSecretRefrence({
                  name: secret?.name as string,
                  identifier: secret?.identifier as string,
                  secretManager: secret?.secretManager as string
                })
                props.formikProps.setFieldValue(props.secretFieldName, {
                  secretName: secret?.name,
                  secretId: secret?.identifier,
                  secretManager: { value: secret?.secretManager, label: secret?.secretManagerName }
                })
              }}
            />
          </>
        </Popover>
      </Layout.Horizontal>

      <input
        name="password"
        onChange={value => {
          props.onChange?.({ value: value.target.value, isReference: false })
        }}
        type={isReference || isEditMode ? 'text' : 'password'}
        readOnly={isReference || isEditMode}
        className={css.secretField}
      />
      {isReference || isEditMode ? (
        <Layout.Vertical>
          <Layout.Horizontal
            height={'36px'}
            background={Color.GREY_200}
            border={{ radius: 6 }}
            padding={'xsmall'}
            margin={{ top: 'xsmall' }}
          >
            <Text tooltip={i18n.ENCRYPTED_TEXT} tooltipProps={{ isDark: true }} className={css.secretName}>
              {props.isEditMode ? props.formikProps.values[props.secretFieldName]?.secretName : secretRefrence.name}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal padding={{ top: 'xsmall' }} font={'small'}>
            <Text margin={{ right: 'xsmall' }} color={Color.GREY_400} font={'small'}>
              {i18n.ID}
            </Text>
            <Text font={'small'} margin={{ right: 'xsmall' }}>
              {props.isEditMode ? props.formikProps.values[props.secretFieldName]?.secretId : secretRefrence.identifier}
            </Text>
            <Icon name={'full-circle'} size={2} className={css.dotIcon} />
            <Text margin={{ right: 'xsmall' }} color={Color.GREY_400} font={'small'}>
              {i18n.SECRET_MANAGER}
            </Text>
            <Text font={'small'}>
              {props.isEditMode
                ? props.formikProps.values[props.secretFieldName]?.secretManager?.label
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
      {showCreateInlineSecret ? (
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

const FormikSecretTextInputInternal: React.FC<SecretTextInputProps> = props => {
  const { formikProps, fieldName, ...rest } = props
  return (
    <SecretTextField
      {...rest}
      formikProps={formikProps}
      fieldName={fieldName}
      onChange={values => {
        formikProps.setFieldValue(fieldName, values)
      }}
    />
  )
}

export const FormikSecretTextInput = connect<Omit<SecretTextInputProps, 'formik'>>(FormikSecretTextInputInternal)

export default SecretTextField
