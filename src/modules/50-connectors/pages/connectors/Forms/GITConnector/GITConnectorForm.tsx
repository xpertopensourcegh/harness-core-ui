import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { omit } from 'lodash-es'
import * as Yup from 'yup'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  SelectV2,
  Button,
  SelectOption,
  Text,
  Icon
} from '@wings-software/uikit'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import UsernamePassword from '@connectors/components/ConnectorFormFields/UsernamePassword'
import useCreateUpdateSecretModal from '@secrets/modals/CreateSecretModal/useCreateUpdateSecretModal'
import type { InlineSecret } from '@secrets/components/CreateInlineSecret/CreateInlineSecret'
import { getSecretV2Promise, SecretTextSpecDTO, ResponseSecretResponseWrapper } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'
import {
  buildGITFormData,
  buildGITPayload,
  getSecretIdFromString,
  getScopeFromString
} from '../../utils/ConnectorUtils'
import { getLabelForAuthType, AuthTypes } from '../../utils/ConnectorHelper'
import { AuthTypeFields } from '../KubeFormHelper'

import i18n from './GITConnectorForm.i18n'
import css from './GITConnectorForm.module.scss'

interface GITConnectorFormProps {
  enableEdit?: boolean
  connector: ConnectorInfoDTO
  setConnector: (data: ConnectorInfoDTO) => void
  setConnectorForYaml: (val: ConnectorInfoDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorRequestBody) => void
}

const GITConnectorForm: React.FC<GITConnectorFormProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [connectType, setConnectType] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)
  const [authType, setAuthType] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)
  const { connector } = props
  const [secretData, setSecretData] = useState<ResponseSecretResponseWrapper>()

  const [passwordRefSecret, setPasswordRefSecret] = useState<InlineSecret>()
  const [sshKeyRefSecret, setSshkeyRefSecret] = useState<InlineSecret>()
  const { openCreateSecretModal } = useCreateUpdateSecretModal({})

  const getSecretForValue = async (value: string, setSecretField: (val: InlineSecret) => void): Promise<void> => {
    const secretId = getSecretIdFromString(value)
    const secretScope = getScopeFromString(value)
    const data = await getSecretV2Promise({
      identifier: secretId,
      queryParams: {
        accountIdentifier: accountId,
        orgIdentifier: secretScope === Scope.ORG || secretScope === Scope.PROJECT ? orgIdentifier : undefined,
        projectIdentifier: secretScope === Scope.PROJECT ? projectIdentifier : undefined
      }
    })
    setSecretData(data)
    const secretManagerIdentifier = (data.data?.secret?.spec as SecretTextSpecDTO)?.secretManagerIdentifier
    setSecretField({
      secretId,
      secretName: data.data?.secret?.name || '',
      secretManager: {
        label: secretManagerIdentifier,
        value: secretManagerIdentifier
      },
      scope: Scope.ACCOUNT
    })
  }

  useEffect(() => {
    if (connector) {
      const formData = buildGITFormData(connector)
      if (formData.passwordRef) {
        getSecretForValue(formData.passwordRef, setPasswordRefSecret)
      }
      if (formData.sshKeyRef) {
        getSecretForValue(formData.sshKeyRef, setSshkeyRefSecret)
      }
    }
  }, [])

  const gitFormData = omit(buildGITFormData(connector))
  return (
    <Formik
      initialValues={{
        ...gitFormData,
        passwordRefSecret,
        sshKeyRefSecret
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.validation.name),
        description: Yup.string(),
        connectionType: Yup.string().trim().required(i18n.validation.connectionType),
        url: Yup.string().trim().required(i18n.validation.url),
        username: Yup.string().trim().required(i18n.validation.username),
        passwordRef: Yup.string().when('authType', {
          is: AuthTypes.USER_PASSWORD,
          then: Yup.string().trim().required(i18n.validation.passwordRef)
        })
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        const connectorData = {
          ...formData,
          projectIdentifier: projectIdentifier,
          orgIdentifier: orgIdentifier
        }
        props.onSubmit(buildGITPayload(connectorData))
      }}
      validate={data => props.setConnectorForYaml(buildGITPayload(data).connector)}
    >
      {formikProps => (
        <Form>
          <div className={css.formCustomCss}>
            <FormInput.InputWithIdentifier isIdentifierEditable={false} />
            <FormInput.TextArea label={i18n.description} name="description" className={css.description} />
            <FormInput.TagInput
              name="tags"
              label={i18n.tags}
              items={connector?.tags || []}
              labelFor={name => (typeof name === 'string' ? name : '')}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                noInputBorder: true,
                openOnKeyDown: false,
                showAddTagButton: true,
                showClearAllButton: true,
                allowNewTag: true,
                placeholder: i18n.enterTags
              }}
            />
            <div className={css.formFields}>
              <FormInput.RadioGroup
                name="connectionType"
                label={i18n.CONFIGURE_TEXT}
                items={[
                  { label: i18n.gitAccount, value: 'Account' },
                  { label: i18n.gitRepo, value: 'Repo' }
                ]}
                className={css.radioGroup}
              />
              <Text className={css.connectByLabel}>{i18n.CONNECT_TEXT}</Text>
              <Layout.Horizontal className={css.connectWrp}>
                <SelectV2
                  items={[
                    { label: i18n.HTTP, value: 'Http' },
                    { label: i18n.SSH, value: 'Ssh' }
                  ]}
                  value={connectType}
                  filterable={false}
                  onChange={item => {
                    setConnectType(item)
                    formikProps.setFieldValue('connectType', item.value)
                  }}
                  className={css.selectConnectType}
                >
                  <Button text={connectType.label} rightIcon="chevron-down" minimal />
                </SelectV2>

                <FormInput.Text name="url" className={css.enterUrl} />
              </Layout.Horizontal>
              {connectType?.value === 'Ssh' ? (
                <div className={css.sshFields}>
                  <FormInput.Text
                    name="sshKeyReference"
                    label={i18n.SSH_ENCRYPTED_KEY}
                    inputGroup={{ type: 'password' }}
                  />
                  <FormInput.Text name="branchName" label={i18n.BRANCH_NAME} />
                </div>
              ) : null}
              {connectType?.value === 'Http' ? (
                <Layout.Vertical spacing="medium">
                  <Layout.Horizontal className={css.credWrapper}>
                    <div className={css.label}>
                      <Icon name="lock" size={14} className={css.lockIcon} />
                      {i18n.Authentication}
                    </div>

                    <SelectV2
                      items={[{ label: getLabelForAuthType(AuthTypes.USER_PASSWORD), value: AuthTypes.USER_PASSWORD }]}
                      value={authType}
                      filterable={false}
                      onChange={item => {
                        setAuthType(item)
                        formikProps.setFieldValue('authType', item.value)
                      }}
                      className={css.selectAuth}
                    >
                      <Button text={authType.label} rightIcon="chevron-down" minimal />
                    </SelectV2>
                  </Layout.Horizontal>
                  <UsernamePassword
                    formik={formikProps}
                    name={connector?.identifier}
                    isEditMode={true}
                    accountId={accountId}
                    orgIdentifier={orgIdentifier}
                    projectIdentifier={projectIdentifier}
                    passwordField={AuthTypeFields.passwordRef}
                    onClickCreateSecret={() => openCreateSecretModal('SecretText')}
                    onEditSecret={() => openCreateSecretModal('SecretText', secretData?.data)}
                  />
                  <FormInput.Text name="branchName" label={i18n.BranchName} />
                </Layout.Vertical>
              ) : null}
            </div>
          </div>

          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Button intent="primary" type="submit" text={'Submit'} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default GITConnectorForm
