import React, { useState } from 'react'
import type { FormikProps } from 'formik'
import { Position, Classes } from '@blueprintjs/core'
import { FormInput, Layout, Text, Button, Color, Icon, Popover } from '@wings-software/uikit'
import cx from 'classnames'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import i18n from './SecretTextInput.i18n'
import css from './SecretTextInput.module.scss'

interface SecretTextInputProps {
  fieldName: string
  secretFieldName: string
  label: string
  defaultSecretName: string
  defaultSecretId: string
  formikProps: FormikProps<unknown>
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  onClickCreateSecret: () => void
}

export const SecretTextInput: React.FC<SecretTextInputProps> = props => {
  const { fieldName, accountId } = props
  const [showCreateInlineSecret, setShowCreateInlineSecret] = useState<boolean>(false)
  return (
    <>
      <FormInput.Text
        name={fieldName}
        label={
          <div className={css.labelWrp}>
            <div className={css.passwordLabel}>{props.label}</div>
            <Popover position={Position.BOTTOM}>
              <div className={css.secretPop}>
                <Icon name="key-main" size={24} height={12} width={24} /> <Icon name="chevron-down" size={14} />
              </div>
              <>
                <Button
                  minimal
                  text={i18n.createSecretText}
                  height="40px"
                  onClick={() => {
                    props.onClickCreateSecret()
                  }}
                  className={cx(Classes.POPOVER_DISMISS, css.createSecretBtn)}
                />
                <hr />
                <SecretReference
                  accountIdentifier={props.accountId}
                  projectIdentifier={props.projectIdentifier}
                  orgIdentifier={props.orgIdentifier}
                  onSelect={secret => {
                    props.formikProps.setFieldValue(fieldName, secret?.name)
                  }}
                />
              </>
            </Popover>
          </div>
        }
        inputGroup={{ type: 'password' }}
      />
      <Layout.Horizontal
        flex={{ distribution: 'space-between' }}
        width={'64%'}
        height={'14px'}
        margin={{ top: 'xsmall' }}
      >
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
          padding="none"
          onClick={() => setShowCreateInlineSecret(!showCreateInlineSecret)}
        />
      </Layout.Horizontal>
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
    </>
  )
}

export default SecretTextInput
