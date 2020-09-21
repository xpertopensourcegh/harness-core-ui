import React from 'react'
import { Container, FormInput, Layout, Button, Text, Color, SelectOption } from '@wings-software/uikit'
import { IOptionProps, Popover, PopoverPosition, MenuItem, Classes } from '@blueprintjs/core'
import { noop } from 'lodash-es'
import { Select } from '@blueprintjs/select'
import type { FormikProps } from 'formik'
import { useParams } from 'react-router-dom'

import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import { FormikSecretTextInput } from 'modules/dx/components/SecretInput/SecretTextInput'
import { getIdentifierFromName } from 'modules/common/utils/StringUtils'
import type { SSHConfigFormData } from 'modules/dx/modals/CreateSSHCredModal/views/StepAuthentication'

import i18n from './SSHAuthFormFields.i18n'
import css from './SSHAuthFormFields.module.scss'

const CustomSelect = Select.ofType<SelectOption>()

interface SSHAuthFormFieldsProps {
  formik: FormikProps<SSHConfigFormData>
  secretName?: string
  editing?: boolean
}

const credentialTypeOptions: SelectOption[] = [
  {
    label: i18n.optionKey,
    value: 'KeyReference'
  },
  {
    label: i18n.optionKeypath,
    value: 'KeyPath'
  },
  {
    label: i18n.optionPassword,
    value: 'Password'
  }
]

const authSchemeOptions: IOptionProps[] = [
  {
    label: i18n.optionSSHKey,
    value: 'SSH'
  },
  {
    label: i18n.optionKerberos,
    value: 'Kerberos'
  }
]

const tgtGenerationMethodOptions: IOptionProps[] = [
  {
    label: i18n.optionKeyTab,
    value: 'KeyTabFilePath'
  },
  {
    label: i18n.optionKerbPass,
    value: 'Password'
  },
  {
    label: i18n.optionKerbNone,
    value: 'None'
  }
]

const SSHAuthFormFields: React.FC<SSHAuthFormFieldsProps> = props => {
  const { formik, secretName, editing } = props
  const { accountId, orgIdentifier, projectIdentifier } = useParams()

  return (
    <>
      <FormInput.RadioGroup
        name="authScheme"
        label={i18n.labelType}
        items={authSchemeOptions}
        radioGroup={{ inline: true }}
      />
      {formik.values.authScheme === 'SSH' ? (
        <>
          <Layout.Horizontal margin={{ bottom: 'medium' }}>
            <Text icon="lock" style={{ flex: 1 }}>
              {i18n.labelAuth}
            </Text>
            <CustomSelect
              items={credentialTypeOptions}
              filterable={false}
              itemRenderer={(item, { handleClick }) => (
                <MenuItem key={item.value as string} text={item.label} onClick={handleClick} />
              )}
              onItemSelect={item => {
                formik.setFieldValue('credentialType', item.value)
              }}
              popoverProps={{ minimal: true }}
            >
              <Button
                inline
                minimal
                rightIcon="chevron-down"
                font="small"
                text={
                  credentialTypeOptions.filter(opt => opt.value === formik.values.credentialType)?.[0]?.label ||
                  'Select...'
                }
              />
            </CustomSelect>
          </Layout.Horizontal>
          <FormInput.Text name="userName" label={i18n.labelUsername} />
          {formik.values.credentialType === 'KeyReference' ? (
            <>
              <FormInput.CustomRender
                name="key"
                className={css.customSelect}
                label={i18n.labelFile}
                render={() => {
                  return (
                    <Popover position={PopoverPosition.BOTTOM_LEFT} minimal>
                      <Button
                        rightIcon="chevron-down"
                        height={38}
                        text={formik.values.key?.name || i18n.labelSelectFile}
                      />
                      <Container>
                        <Text
                          style={{ cursor: 'pointer' }}
                          padding="large"
                          border={{ bottom: true }}
                          color={Color.DARK_600}
                          // onClick={() => setShowCreateSecretFileModal(true)}
                          className={Classes.POPOVER_DISMISS}
                        >
                          {i18n.btnCreateSecretFile}
                        </Text>
                        <SecretReference
                          accountIdentifier={accountId}
                          type="SecretFile"
                          onSelect={file => {
                            formik.setFieldValue('key', file)
                          }}
                        />
                      </Container>
                    </Popover>
                  )
                }}
              />
              <FormikSecretTextInput
                fieldName="encryptedPassphraseText"
                label={i18n.labelPassphrase}
                secretFieldName="encryptedPassphraseSecret"
                accountId={accountId}
                orgIdentifier={orgIdentifier}
                projectIdentifier={projectIdentifier}
                defaultSecretName={getIdentifierFromName(secretName + '_passphrase')}
                defaultSecretId={getIdentifierFromName(secretName + '_passphrase')}
                isEditMode={editing && !!formik.values['encryptedPassphraseSecret']}
                onClickCreateSecret={noop}
                // onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
                // onEditSecret={x => console.log(x)}
              />
            </>
          ) : null}
          {formik.values.credentialType === 'KeyPath' ? (
            <>
              <FormInput.Text name="keyPath" label={i18n.labelKeyFilePath} />
              <FormikSecretTextInput
                fieldName="encryptedPassphraseText"
                label={i18n.labelPassphrase}
                secretFieldName="encryptedPassphraseSecret"
                accountId={accountId}
                orgIdentifier={orgIdentifier}
                projectIdentifier={projectIdentifier}
                defaultSecretName={getIdentifierFromName(secretName + '_passphrase')}
                defaultSecretId={getIdentifierFromName(secretName + '_passphrase')}
                isEditMode={editing && !!formik.values['encryptedPassphraseSecret']}
                // onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
                onClickCreateSecret={noop}
                onEditSecret={noop}
              />
            </>
          ) : null}
          {formik.values.credentialType === 'Password' ? (
            <FormikSecretTextInput
              fieldName="passwordText"
              label={i18n.labelPassword}
              secretFieldName="passwordSecret"
              accountId={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              defaultSecretName={getIdentifierFromName(secretName + '_password')}
              defaultSecretId={getIdentifierFromName(secretName + '_password')}
              isEditMode={editing && !!formik.values['passwordSecret']}
              // onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
              onClickCreateSecret={noop}
              onEditSecret={noop}
            />
          ) : null}
          <FormInput.Text name="port" label={i18n.labelSSHPort} />
        </>
      ) : null}
      {formik.values.authScheme === 'Kerberos' ? (
        <>
          <FormInput.Text name="principal" label={i18n.labelPrincipal} />
          <FormInput.Text name="realm" label={i18n.labelRealm} />
          <FormInput.Text name="port" label={i18n.labelSSHPort} />
          <FormInput.RadioGroup
            name="tgtGenerationMethod"
            label={i18n.labelTGT}
            items={tgtGenerationMethodOptions}
            radioGroup={{ inline: true }}
          />
          {formik.values.tgtGenerationMethod === 'KeyTabFilePath' ? (
            <FormInput.Text name="keyPath" label={i18n.labelKeyTab} />
          ) : null}
          {formik.values.tgtGenerationMethod === 'Password' ? (
            <FormikSecretTextInput
              fieldName="passwordText"
              label={i18n.labelPassword}
              secretFieldName="passwordSecret"
              accountId={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              defaultSecretName={getIdentifierFromName(secretName + '_password')}
              defaultSecretId={getIdentifierFromName(secretName + '_password')}
              isEditMode={editing && !!formik.values['passwordSecret']}
              // onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
              onClickCreateSecret={noop}
              onEditSecret={noop}
            />
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default SSHAuthFormFields
