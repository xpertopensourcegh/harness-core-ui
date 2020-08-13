import React, { useState } from 'react'
import type { FormikProps } from 'formik'
import { Position, Classes } from '@blueprintjs/core'
import { FormInput, Layout, Text, Button, Color, Icon, Popover } from '@wings-software/uikit'
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
          <Layout.Horizontal flex={{ distribution: 'space-between' }}>
            <Text>{props.label}</Text>
            <Popover position={Position.BOTTOM}>
              <div className={css.secretPop}>
                <Icon name="key-main" size={24} height={12} width={24} /> <Icon name="chevron-down" size={14} />
              </div>
              <>
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
                      {/* Replace with real value when behaviour is decided */}
                      Secret name
                    </Text>
                  </Layout.Vertical>
                  <Button icon="edit" minimal />
                </Layout.Horizontal>
                <Text
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
                    props.formikProps.setFieldValue(fieldName, secret?.name)
                  }}
                />
              </>
            </Popover>
          </Layout.Horizontal>
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
