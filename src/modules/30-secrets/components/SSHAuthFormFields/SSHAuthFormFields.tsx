import React from 'react'
import { FormInput, Layout, Button, Text, SelectOption } from '@wings-software/uicore'
import { IOptionProps, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import type { FormikProps } from 'formik'
import { useStrings } from 'framework/strings'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import type { SSHConfigFormData } from '@secrets/modals/CreateSSHCredModal/views/StepAuthentication'

const CustomSelect = Select.ofType<SelectOption>()
interface SSHAuthFormFieldsProps {
  formik: FormikProps<SSHConfigFormData>
  secretName?: string
  editing?: boolean
}

const SSHAuthFormFields: React.FC<SSHAuthFormFieldsProps> = props => {
  const { getString } = useStrings()
  const { formik } = props
  const credentialTypeOptions: SelectOption[] = [
    {
      label: getString('secrets.sshAuthFormFields.optionKey'),
      value: 'KeyReference'
    },
    {
      label: getString('secrets.sshAuthFormFields.optionKeypath'),
      value: 'KeyPath'
    },
    {
      label: getString('secrets.sshAuthFormFields.optionPassword'),
      value: 'Password'
    }
  ]

  const authSchemeOptions: IOptionProps[] = [
    {
      label: getString('SSH_KEY'),
      value: 'SSH'
    },
    {
      label: getString('kerberos'),
      value: 'Kerberos'
    }
  ]

  const tgtGenerationMethodOptions: IOptionProps[] = [
    {
      label: getString('secrets.sshAuthFormFields.labelKeyTab'),
      value: 'KeyTabFilePath'
    },
    {
      label: getString('password'),
      value: 'Password'
    },
    {
      label: getString('secrets.sshAuthFormFields.optionKerbNone'),
      value: 'None'
    }
  ]

  return (
    <>
      <FormInput.RadioGroup
        name="authScheme"
        label={getString('secrets.sshAuthFormFields.labelType')}
        items={authSchemeOptions}
        radioGroup={{ inline: true }}
      />
      {formik.values.authScheme === 'SSH' ? (
        <>
          <Layout.Horizontal margin={{ bottom: 'medium' }}>
            <Text icon="lock" style={{ flex: 1 }}>
              {getString('authentication')}
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
          <FormInput.Text name="userName" label={getString('username')} />
          {formik.values.credentialType === 'KeyReference' ? (
            <>
              <SecretInput name="key" label={getString('secrets.sshAuthFormFields.labelFile')} type="SecretFile" />
              <SecretInput
                name={'encryptedPassphrase'}
                label={getString('secrets.sshAuthFormFields.labelPassphrase')}
              />
            </>
          ) : null}
          {formik.values.credentialType === 'KeyPath' ? (
            <>
              <FormInput.Text name="keyPath" label={getString('secrets.sshAuthFormFields.labelKeyFilePath')} />
              <SecretInput
                name={'encryptedPassphrase'}
                label={getString('secrets.sshAuthFormFields.labelPassphrase')}
              />
            </>
          ) : null}
          {formik.values.credentialType === 'Password' ? (
            <SecretInput name={'password'} label={getString('password')} />
          ) : null}
          <FormInput.Text name="port" label={getString('secrets.sshAuthFormFields.labelSSHPort')} />
        </>
      ) : null}
      {formik.values.authScheme === 'Kerberos' ? (
        <>
          <FormInput.Text name="principal" label={getString('secrets.sshAuthFormFields.labelPrincipal')} />
          <FormInput.Text name="realm" label={getString('secrets.sshAuthFormFields.labelRealm')} />
          <FormInput.Text name="port" label={getString('secrets.sshAuthFormFields.labelSSHPort')} />
          <FormInput.RadioGroup
            name="tgtGenerationMethod"
            label={getString('secrets.sshAuthFormFields.labelTGT')}
            items={tgtGenerationMethodOptions}
            radioGroup={{ inline: true }}
          />
          {formik.values.tgtGenerationMethod === 'KeyTabFilePath' ? (
            <FormInput.Text name="keyPath" label={getString('secrets.sshAuthFormFields.labelKeyTab')} />
          ) : null}
          {formik.values.tgtGenerationMethod === 'Password' ? (
            <SecretInput name={'password'} label={getString('password')} />
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default SSHAuthFormFields
