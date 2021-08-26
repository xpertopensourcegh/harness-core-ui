import React from 'react'
import { FormInput } from '@wings-software/uicore'
import type { IOptionProps } from '@blueprintjs/core'
import type { FormikContext } from 'formik'
import { useStrings } from 'framework/strings'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import type { VaultConfigFormData } from '@connectors/interfaces/ConnectorInterface'

const accessTypeOptions: IOptionProps[] = [
  {
    label: 'App Role',
    value: 'APP_ROLE'
  },
  {
    label: 'Token',
    value: 'TOKEN'
  }
]

interface VaultConnectorFormFieldsProps {
  formik: FormikContext<VaultConfigFormData>
}

const VaultConnectorFormFields: React.FC<VaultConnectorFormFieldsProps> = ({ formik }) => {
  const { getString } = useStrings()

  return (
    <>
      <FormInput.Text name="vaultUrl" label={getString('connectors.hashiCorpVault.vaultUrl')} />
      <FormInput.Text name="basePath" label={getString('connectors.hashiCorpVault.baseSecretPath')} />
      <FormInput.RadioGroup
        name="accessType"
        label={getString('authentication')}
        radioGroup={{ inline: true }}
        items={accessTypeOptions}
      />
      {formik?.values['accessType'] === 'APP_ROLE' ? (
        <>
          <FormInput.Text name="appRoleId" label={getString('connectors.hashiCorpVault.appRoleId')} />
          <SecretInput
            name="secretId"
            label={getString('connectors.hashiCorpVault.secretId')}
            connectorTypeContext={'Vault'}
          />
        </>
      ) : (
        <SecretInput name="authToken" label={getString('token')} connectorTypeContext={'Vault'} />
      )}
      <FormInput.Text name="renewalIntervalMinutes" label={getString('connectors.hashiCorpVault.renewal')} />
      <FormInput.CheckBox
        name="readOnly"
        label={getString('connectors.hashiCorpVault.readOnlyVault')}
        padding={{ left: 'xxlarge' }}
      />
      <FormInput.CheckBox
        name="default"
        label={getString('connectors.hashiCorpVault.defaultVault')}
        padding={{ left: 'xxlarge' }}
      />
    </>
  )
}

export default VaultConnectorFormFields
