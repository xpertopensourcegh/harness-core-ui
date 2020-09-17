import React, { useState } from 'react'
import {
  SelectOption,
  StepProps,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  Button,
  Text,
  Color,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import { IOptionProps, Popover, PopoverPosition, MenuItem, Classes } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { noop } from 'lodash-es'
import * as Yup from 'yup'
import { Select } from '@blueprintjs/select'

import {
  SecretTextSpecDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHPasswordCredentialDTO,
  usePostSecret
} from 'services/cd-ng'
import type { SecretDTOV2, KerberosConfigDTO, SSHConfigDTO, SSHKeySpecDTO } from 'services/cd-ng'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import { FormikSecretTextInput, SecretInfo } from 'modules/dx/components/SecretInput/SecretTextInput'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import type { InlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import type { SecretRef } from 'modules/dx/components/SecretReference/SecretReference'
import { getIdentifierFromName } from 'modules/common/utils/StringUtils'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import type { SSHCredSharedObj } from '../useCreateSSHCredModal'

import i18n from '../CreateSSHCredModal.i18n'
import css from '../useCreateSSHCredModal.module.scss'

const CustomSelect = Select.ofType<SelectOption>()

export interface SSHConfigFormData {
  authScheme: SSHKeySpecDTO['authScheme']
  credentialType: SSHConfigDTO['credentialType']
  tgtGenerationMethod: KerberosConfigDTO['tgtGenerationMethod']
  userName: string
  port: number
  key?: SecretRef
  principal: string
  realm: string
  keyPath: string
  encryptedPassphraseText?: SecretInfo
  encryptedPassphraseSecret?: InlineSecret
  passwordText?: SecretInfo
  passwordSecret?: InlineSecret
}

interface StepAuthenticationProps {
  onSuccess?: () => void
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

const validationSchema = Yup.object().shape({
  port: Yup.number().required(i18n.validatePort),
  userName: Yup.string().when('authScheme', {
    is: 'SSH',
    then: Yup.string().trim().required(i18n.validateUsername)
  }),
  keyPath: Yup.string().when(['authScheme', 'credentialType', 'tgtGenerationMethod'], {
    is: (authScheme, credentialType, tgtGenerationMethod) =>
      (authScheme === 'SSH' && credentialType == 'KeyPath') ||
      (authScheme === 'Kerberos' && tgtGenerationMethod == 'KeyTabFilePath'),
    then: Yup.string().trim().required(i18n.validateKeypath)
  }),
  key: Yup.object().when(['authScheme', 'credentialType'], {
    is: (authScheme, credentialType) => authScheme === 'SSH' && credentialType == 'KeyReference',
    then: Yup.object().required(i18n.validateSshKey)
  }),
  principal: Yup.string().when('authScheme', {
    is: 'Kerberos',
    then: Yup.string().trim().required(i18n.validatePrincipal)
  }),
  realm: Yup.string().when('authScheme', {
    is: 'Kerberos',
    then: Yup.string().trim().required(i18n.validateRealm)
  })
})

type SSHCredentialType = SSHKeyPathCredentialDTO | SSHKeyReferenceCredentialDTO | SSHPasswordCredentialDTO

const getReference = (scope?: Scope, identifier?: string): string | undefined => {
  switch (scope) {
    case Scope.PROJECT:
      return identifier
    case Scope.ORG:
      return `org.${identifier}`
    case Scope.ACCOUNT:
      return `acc.${identifier}`
  }
}

const StepAuthentication: React.FC<StepProps<SSHCredSharedObj> & StepAuthenticationProps> = ({
  prevStepData,
  nextStep,
  onSuccess
}) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [showCreateSecretTextModal, setShowCreateSecretTextModal] = useState(false)
  const [showCreateSecretFileModal, setShowCreateSecretFileModal] = useState(false)
  const { mutate: createSecret, loading } = usePostSecret({ queryParams: { accountIdentifier: accountId } })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  async function buildSSHCredentials(data: SSHConfigFormData): Promise<SSHCredentialType | undefined> {
    switch (data.credentialType) {
      case 'KeyReference':
        if (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) {
          await createSecret({
            type: 'SecretText',
            name: data.encryptedPassphraseSecret?.secretName as string,
            identifier: data.encryptedPassphraseSecret?.secretId as string,
            orgIdentifier,
            projectIdentifier,
            tags: {},
            spec: {
              secretManagerIdentifier: data.encryptedPassphraseSecret?.secretManager?.value as string,
              value: data.encryptedPassphraseText.value,
              valueType: 'Inline'
            } as SecretTextSpecDTO
          })
        }
        return {
          userName: data.userName,
          keyPath: getReference(data.key?.scope, data.key?.identifier),
          encryptedPassphrase: getReference(
            data.encryptedPassphraseSecret?.scope,
            data.encryptedPassphraseSecret?.secretId
          )
        } as SSHKeyReferenceCredentialDTO
      case 'KeyPath':
        if (data.encryptedPassphraseText?.isReference === false && data.encryptedPassphraseText?.value) {
          await createSecret({
            type: 'SecretText',
            name: data.encryptedPassphraseSecret?.secretName as string,
            identifier: data.encryptedPassphraseSecret?.secretId as string,
            orgIdentifier,
            projectIdentifier,
            tags: {},
            spec: {
              secretManagerIdentifier: data.encryptedPassphraseSecret?.secretManager?.value as string,
              value: data.encryptedPassphraseText.value,
              valueType: 'Inline'
            } as SecretTextSpecDTO
          })
        }
        return {
          userName: data.userName,
          keyPath: data.keyPath,
          encryptedPassphrase: getReference(
            data.encryptedPassphraseSecret?.scope,
            data.encryptedPassphraseSecret?.secretId
          )
        } as SSHKeyPathCredentialDTO
      case 'Password':
        if (data.passwordText?.isReference === false && data.passwordText?.value) {
          await createSecret({
            type: 'SecretText',
            name: data.passwordSecret?.secretName as string,
            identifier: data.passwordSecret?.secretId as string,
            orgIdentifier,
            projectIdentifier,
            tags: {},
            spec: {
              secretManagerIdentifier: data.passwordSecret?.secretManager?.value as string,
              value: data.passwordText.value,
              valueType: 'Inline'
            } as SecretTextSpecDTO
          })
        }
        return {
          userName: data.userName,
          password: getReference(data.passwordSecret?.scope, data.passwordSecret?.secretId)
        } as SSHPasswordCredentialDTO
    }
  }

  async function buildKerberosConfig(data: SSHConfigFormData): Promise<KerberosConfigDTO | undefined> {
    switch (data.tgtGenerationMethod) {
      case 'KeyTabFilePath':
        return {
          principal: data.principal,
          realm: data.realm,
          tgtGenerationMethod: data.tgtGenerationMethod,
          keyPath: data.keyPath,
          password: ''
        }
      case 'Password':
        if (data.passwordText?.isReference === false && data.passwordText?.value) {
          await createSecret({
            type: 'SecretText',
            name: data.passwordSecret?.secretName as string,
            identifier: data.passwordSecret?.secretId as string,
            orgIdentifier,
            projectIdentifier,
            tags: {},
            spec: {
              secretManagerIdentifier: data.passwordSecret?.secretManager?.value as string,
              value: data.passwordText.value,
              valueType: 'Inline'
            } as SecretTextSpecDTO
          })
        }
        return {
          principal: data.principal,
          realm: data.realm,
          tgtGenerationMethod: data.tgtGenerationMethod,
          password: getReference(data.passwordSecret?.scope, data.passwordSecret?.secretId)
        }
      case 'None':
        return {
          principal: data.principal,
          realm: data.realm,
          tgtGenerationMethod: data.tgtGenerationMethod,
          password: ''
        }
    }
  }

  async function buildAuthConfig(data: SSHConfigFormData): Promise<SSHConfigDTO | KerberosConfigDTO | undefined> {
    let credentials
    switch (data.authScheme) {
      case 'SSH':
        credentials = await buildSSHCredentials(data)
        return {
          credentialType: data.credentialType,
          spec: credentials
        } as SSHConfigDTO
      case 'Kerberos':
        return buildKerberosConfig(data)
    }
  }

  const handleSubmit = async (formData: SSHConfigFormData): Promise<void> => {
    try {
      // this will create secrets if needed
      const authConfig = await buildAuthConfig(formData)

      // build final data to submit
      const dataToSubmit: SecretDTOV2 = {
        type: 'SSHKey',
        name: prevStepData?.detailsData?.name as string,
        identifier: prevStepData?.detailsData?.identifier as string,
        description: prevStepData?.detailsData?.description,
        tags: {},
        spec: {
          authScheme: formData.authScheme,
          port: formData.port,
          spec: authConfig
        } as SSHKeySpecDTO
      }

      // finally create the connector
      await createSecret(dataToSubmit)
      onSuccess?.()
      nextStep?.({ ...prevStepData, authData: formData })
    } catch (err) {
      modalErrorHandler?.show(err.data)
    }
  }

  return (
    <>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Container padding="small" width={350} style={{ minHeight: '500px' }}>
        <Text margin={{ bottom: 'xlarge' }} font={{ size: 'medium' }} color={Color.BLACK}>
          {i18n.titleAuth}
        </Text>
        <Formik<SSHConfigFormData>
          onSubmit={formData => {
            modalErrorHandler?.hide()
            handleSubmit(formData)
          }}
          validationSchema={validationSchema}
          initialValues={{
            authScheme: 'SSH',
            credentialType: 'KeyReference',
            tgtGenerationMethod: 'None',
            userName: '',
            principal: '',
            realm: '',
            keyPath: '',
            port: 22,
            ...prevStepData?.authData
          }}
        >
          {formik => {
            return (
              <FormikForm>
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
                            credentialTypeOptions.filter(opt => opt.value === formik.values.credentialType)?.[0]
                              ?.label || 'Select...'
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
                                    onClick={() => setShowCreateSecretFileModal(true)}
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
                          defaultSecretName={getIdentifierFromName(prevStepData?.detailsData?.name + '_passphrase')}
                          defaultSecretId={getIdentifierFromName(prevStepData?.detailsData?.name + '_passphrase')}
                          onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
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
                          defaultSecretName={getIdentifierFromName(prevStepData?.detailsData?.name + '_passphrase')}
                          defaultSecretId={getIdentifierFromName(prevStepData?.detailsData?.name + '_passphrase')}
                          onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
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
                        defaultSecretName={getIdentifierFromName(prevStepData?.detailsData?.name + '_password')}
                        defaultSecretId={getIdentifierFromName(prevStepData?.detailsData?.name + '_password')}
                        onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
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
                        defaultSecretName={getIdentifierFromName(prevStepData?.detailsData?.name + '_password')}
                        defaultSecretId={getIdentifierFromName(prevStepData?.detailsData?.name + '_password')}
                        onClickCreateSecret={() => setShowCreateSecretTextModal(true)}
                        onEditSecret={noop}
                      />
                    ) : null}
                  </>
                ) : null}

                <Layout.Horizontal>
                  <Button type="submit" text={i18n.btnSave} disabled={loading} />
                </Layout.Horizontal>
              </FormikForm>
            )
          }}
        </Formik>
        {showCreateSecretTextModal ? (
          <CreateSecretOverlay setShowCreateSecretModal={setShowCreateSecretTextModal} type="SecretText" />
        ) : null}
        {showCreateSecretFileModal ? (
          <CreateSecretOverlay setShowCreateSecretModal={setShowCreateSecretFileModal} type="SecretFile" />
        ) : null}
      </Container>
    </>
  )
}

export default StepAuthentication
