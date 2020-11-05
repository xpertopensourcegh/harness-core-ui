import React from 'react'
import { Container, FormInput, Layout, Button, Text, Color, SelectOption, IconName, Icon } from '@wings-software/uikit'
import { IOptionProps, Popover, PopoverPosition, MenuItem, Classes } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import type { FormikProps } from 'formik'
import { useParams } from 'react-router-dom'
import { omit } from 'lodash-es'

import SecretReference from '@secrets/components/SecretReference/SecretReference'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import type { SSHConfigFormData } from '@secrets/modals/CreateSSHCredModal/views/StepAuthentication'
import type { SecretResponseWrapper, ResponsePageSecretResponseWrapper } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'

import i18n from './SSHAuthFormFields.i18n'
import css from './SSHAuthFormFields.module.scss'

const CustomSelect = Select.ofType<SelectOption>()
type SecretType = SecretResponseWrapper['secret']['type']

interface SSHAuthFormFieldsProps {
  formik: FormikProps<SSHConfigFormData>
  secretName?: string
  editing?: boolean
  showCreateSecretModal: (type: SecretType, data?: SecretResponseWrapper) => void
  mockSecretReference?: ResponsePageSecretResponseWrapper
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

const getIconForScope = (scope: Scope): IconName => {
  switch (scope) {
    case Scope.ACCOUNT:
      return 'placeholder'
    case Scope.ORG:
      return 'placeholder'
    case Scope.PROJECT:
      return 'nav-project'
  }
}

const SSHAuthFormFields: React.FC<SSHAuthFormFieldsProps> = props => {
  const { formik, showCreateSecretModal } = props
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
                        text={
                          formik.values.key?.name ? (
                            <Layout.Horizontal spacing="xsmall">
                              <Text>{formik.values.key.name}</Text>
                              <Icon name={getIconForScope(formik.values.key.scope)} />
                            </Layout.Horizontal>
                          ) : (
                            i18n.labelSelectFile
                          )
                        }
                      />
                      <Container>
                        {formik.values.key ? (
                          <Layout.Horizontal
                            padding="medium"
                            border={{ bottom: true }}
                            flex={{ distribution: 'space-between' }}
                          >
                            <Layout.Vertical>
                              <Text font={{ size: 'small' }}>{i18n.labelSavedSecret}</Text>
                              <Text>{formik.values.key.name}</Text>
                            </Layout.Vertical>
                            <Button
                              icon="edit"
                              className={Classes.POPOVER_DISMISS}
                              onClick={() =>
                                showCreateSecretModal('SecretFile', {
                                  secret: omit(formik.values.key, 'scope')
                                })
                              }
                            />
                          </Layout.Horizontal>
                        ) : null}
                        <Text
                          style={{ cursor: 'pointer' }}
                          padding="large"
                          border={{ bottom: true }}
                          color={Color.DARK_600}
                          onClick={() => showCreateSecretModal('SecretFile')}
                          className={Classes.POPOVER_DISMISS}
                        >
                          {i18n.btnCreateSecretFile}
                        </Text>
                        <SecretReference
                          accountIdentifier={accountId}
                          orgIdentifier={orgIdentifier}
                          projectIdentifier={projectIdentifier}
                          type="SecretFile"
                          onSelect={file => {
                            formik.setFieldValue('key', file)
                          }}
                          mock={props.mockSecretReference}
                        />
                      </Container>
                    </Popover>
                  )
                }}
              />
              <SecretInput name={'encryptedPassphrase'} label={i18n.labelPassphrase} />
            </>
          ) : null}
          {formik.values.credentialType === 'KeyPath' ? (
            <>
              <FormInput.Text name="keyPath" label={i18n.labelKeyFilePath} />
              <SecretInput name={'encryptedPassphrase'} label={i18n.labelPassphrase} />
            </>
          ) : null}
          {formik.values.credentialType === 'Password' ? (
            <SecretInput name={'password'} label={i18n.labelPassword} />
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
            <SecretInput name={'password'} label={i18n.labelPassword} />
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default SSHAuthFormFields
