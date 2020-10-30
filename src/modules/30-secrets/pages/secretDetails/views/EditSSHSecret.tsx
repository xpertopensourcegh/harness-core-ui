import React, { useEffect, useState } from 'react'
import { Button, Color, Container, Formik, FormikForm, Layout } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import { useParams } from 'react-router-dom'

import SSHAuthFormFields from '@secrets/components/SSHAuthFormFields/SSHAuthFormFields'
import SSHDetailsFormFields from '@secrets/components/SSHDetailsFormFields/SSHDetailsFormFields'
import type { SSHConfigFormData } from '@secrets/modals/CreateSSHCredModal/views/StepAuthentication'
import {
  getSecretV2Promise,
  KerberosConfigDTO,
  SecretDTOV2,
  SecretRequestWrapper,
  SecretResponseWrapper,
  SecretTextSpecDTO,
  SSHConfigDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHKeySpecDTO,
  SSHPasswordCredentialDTO,
  usePutSecret,
  ConnectorConnectivityDetails,
  ResponseSecretResponseWrapper
} from 'services/cd-ng'
import type { DetailsForm } from '@secrets/modals/CreateSSHCredModal/views/StepDetails'
import type { InlineSecret } from '@secrets/components/CreateInlineSecret/CreateInlineSecret'
import { Scope } from '@common/interfaces/SecretsInterface'
import { buildAuthConfig, getSSHDTOFromFormData } from '@secrets/utils/SSHAuthUtils'
import { useToaster } from '@common/exports'
import VerifyConnection from '@secrets/modals/CreateSSHCredModal/views/VerifyConnection'
import useCreateUpdateSecretModal from '@secrets/modals/CreateSecretModal/useCreateUpdateSecretModal'
import type { SecretRef } from '@secrets/components/SecretReference/SecretReference'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import ConnectorStats from '@dx/pages/connectors/ConnectorStats'

import css from './EditSSHSecret.module.scss'

interface EditSSHSecretProps {
  secret: SecretResponseWrapper
  onChange?: (data: SecretDTOV2) => void
  mockKey?: ResponseSecretResponseWrapper
  mockPassword?: ResponseSecretResponseWrapper
  mockPassphrase?: ResponseSecretResponseWrapper
}

const EditSSHSecret: React.FC<EditSSHSecretProps> = props => {
  const {
    secret: { secret },
    onChange
  } = props
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { openCreateSecretModal } = useCreateUpdateSecretModal({})
  const [saving, setSaving] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { mutate: updateSecret } = usePutSecret({
    identifier: secret.identifier,
    queryParams: { accountIdentifier: accountId }
  })
  const [keySecret, setKeySecret] = useState<SecretRef>()
  const [passwordSecret, setPasswordSecret] = useState<InlineSecret>()
  const [encryptedPassphraseSecret, setEncryptedPassphraseSecret] = useState<InlineSecret>()

  const getSecrets = async (): Promise<void> => {
    let password, encryptedPassphrase
    const secretSpec = secret.spec as SSHKeySpecDTO
    const authScheme = secretSpec.auth.type
    if (authScheme === 'SSH') {
      const sshConfig = secretSpec.auth.spec as SSHConfigDTO
      const credentialType = sshConfig.credentialType
      if (credentialType === 'Password') {
        const passwordSpec = sshConfig.spec as SSHPasswordCredentialDTO
        password = passwordSpec.password
      } else if (credentialType === 'KeyPath') {
        const keyPathSpec = sshConfig.spec as SSHKeyPathCredentialDTO
        encryptedPassphrase = keyPathSpec.encryptedPassphrase
      } else if (credentialType === 'KeyReference') {
        const keyRefSpec = sshConfig.spec as SSHKeyReferenceCredentialDTO
        encryptedPassphrase = keyRefSpec.encryptedPassphrase

        if (keyRefSpec.key) {
          const data = await getSecretV2Promise({
            identifier: keyRefSpec.key.indexOf('.') < 0 ? keyRefSpec.key : keyRefSpec.key.split('.')[1],
            queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
            mock: props.mockKey
          })
          const keySecretData = data.data?.secret
          if (keySecretData) {
            setKeySecret({
              scope: getScopeFromDTO(keySecretData),
              ...data.data?.secret
            } as SecretRef)
          }
        }
      }
    } else if (authScheme === 'Kerberos') {
      const kerberosConfig = secretSpec.auth.spec as KerberosConfigDTO
      if (kerberosConfig.tgtGenerationMethod === 'Password') {
        password = kerberosConfig.password
      }
    }

    if (password) {
      const secretId = password.indexOf('.') < 0 ? password : password.split('.')[1]
      const data = await getSecretV2Promise({
        identifier: secretId,
        queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
        mock: props.mockPassword
      })
      const secretManagerIdentifier = (data.data?.secret.spec as SecretTextSpecDTO)?.secretManagerIdentifier
      setPasswordSecret({
        secretId,
        secretName: data.data?.secret.name || '',
        secretManager: {
          label: secretManagerIdentifier,
          value: secretManagerIdentifier
        },
        scope: Scope.ACCOUNT
      })
    }

    if (encryptedPassphrase) {
      const secretId = encryptedPassphrase.indexOf('.') < 0 ? encryptedPassphrase : encryptedPassphrase.split('.')[1]
      const data = await getSecretV2Promise({
        identifier: secretId,
        queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier },
        mock: props.mockPassphrase
      })
      const secretManagerIdentifier = (data.data?.secret.spec as SecretTextSpecDTO)?.secretManagerIdentifier
      setEncryptedPassphraseSecret({
        secretId,
        secretName: data.data?.secret.name || '',
        secretManager: {
          label: secretManagerIdentifier,
          value: secretManagerIdentifier
        },
        scope: Scope.ACCOUNT
      })
    }
  }

  useEffect(() => {
    getSecrets()
  }, [])

  const handleSubmit = async (formData: DetailsForm & SSHConfigFormData): Promise<void> => {
    setSaving(true)
    try {
      // this will create secrets if needed
      const authConfig = await buildAuthConfig(formData, { accountId, orgIdentifier, projectIdentifier })

      // build final data to submit
      const dataToSubmit: SecretRequestWrapper = {
        secret: {
          type: 'SSHKey',
          name: formData?.name as string,
          identifier: formData?.identifier as string,
          description: formData?.description,
          projectIdentifier,
          orgIdentifier,
          tags: {},
          spec: {
            auth: {
              type: formData.authScheme,
              spec: authConfig
            },
            port: formData.port
          } as SSHKeySpecDTO
        }
      }

      // finally update the secret
      await updateSecret(dataToSubmit)
      setSaving(false)
      showSuccess('saved')
    } catch (err) {
      setSaving(false)
      showError(err.data.message)
    }
  }

  return (
    <Layout.Horizontal>
      <Container width="50%" border={{ right: true, color: Color.GREY_250 }}>
        <Container width={400}>
          <Formik<DetailsForm & SSHConfigFormData>
            initialValues={{
              ...pick(secret, 'name', 'description', 'tags', 'identifier'),
              authScheme: (secret.spec as SSHKeySpecDTO)?.auth.type,
              credentialType: ((secret.spec as SSHKeySpecDTO)?.auth.spec as SSHConfigDTO)?.credentialType,
              tgtGenerationMethod:
                ((secret.spec as SSHKeySpecDTO)?.auth.spec as KerberosConfigDTO).tgtGenerationMethod || 'None',
              userName: (((secret.spec as SSHKeySpecDTO)?.auth.spec as SSHConfigDTO)
                ?.spec as SSHKeyReferenceCredentialDTO)?.userName,
              principal: ((secret.spec as SSHKeySpecDTO)?.auth.spec as KerberosConfigDTO)?.principal,
              realm: ((secret.spec as SSHKeySpecDTO)?.auth.spec as KerberosConfigDTO)?.realm,
              keyPath:
                ((secret.spec as SSHKeySpecDTO)?.auth.spec as KerberosConfigDTO)?.keyPath ||
                (((secret.spec as SSHKeySpecDTO)?.auth.spec as SSHConfigDTO)?.spec as SSHKeyPathCredentialDTO)?.keyPath,
              port: (secret.spec as SSHKeySpecDTO)?.port || 22,
              key: keySecret,
              passwordSecret,
              encryptedPassphraseSecret
            }}
            enableReinitialize={true}
            validate={formData => {
              onChange?.(getSSHDTOFromFormData(formData))
            }}
            onSubmit={formData => {
              handleSubmit(formData)
            }}
          >
            {formik => {
              return (
                <FormikForm>
                  <SSHDetailsFormFields editing={true} />
                  <SSHAuthFormFields
                    formik={formik}
                    secretName={formik.values?.name}
                    editing={true}
                    showCreateSecretModal={openCreateSecretModal}
                  />
                  <Button intent="primary" type="submit" text="Save" disabled={saving} />
                </FormikForm>
              )
            }}
          </Formik>
        </Container>
      </Container>
      <Layout.Vertical width="50%" spacing="xxxlarge">
        <ConnectorStats
          createdAt={props.secret.createdAt as number}
          lastUpdated={props.secret.updatedAt}
          status={'' as ConnectorConnectivityDetails['status']}
          className={css.stats}
        />
        <VerifyConnection identifier={secret.identifier} />
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

export default EditSSHSecret
