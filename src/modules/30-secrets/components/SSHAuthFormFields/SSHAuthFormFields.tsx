import React from 'react'
import { FormInput, Layout, Button, Text, SelectOption } from '@wings-software/uicore'
import { IOptionProps, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import type { FormikProps } from 'formik'

import SecretInput from '@secrets/components/SecretInput/SecretInput'
import type { SSHConfigFormData } from '@secrets/modals/CreateSSHCredModal/views/StepAuthentication'
import type { ResponsePageSecretResponseWrapper } from 'services/cd-ng'

import i18n from './SSHAuthFormFields.i18n'

const CustomSelect = Select.ofType<SelectOption>()

interface SSHAuthFormFieldsProps {
  formik: FormikProps<SSHConfigFormData>
  secretName?: string
  editing?: boolean
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

const SSHAuthFormFields: React.FC<SSHAuthFormFieldsProps> = props => {
  const { formik } = props

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
              <SecretInput name="key" label={i18n.labelFile} type="SecretFile" />
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
