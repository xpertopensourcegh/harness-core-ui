import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import { Formik, FormikForm as Form, FormInput, Layout, Button } from '@wings-software/uikit'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import UsernamePassword from 'modules/dx/components/connectors/ConnectorFormFields/UsernamePassword'
import useCreateUpdateSecretModal from 'modules/dx/modals/CreateSecretModal/useCreateUpdateSecretModal'
import { StringUtils } from 'modules/common/exports'

import { getSecretV2Promise, SecretTextSpecDTO, ResponseSecretResponseWrapper } from 'services/cd-ng'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import type { InlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import {
  buildDockerFormData,
  buildDockerPayload,
  getSecretIdFromString,
  getScopeFromString
} from '../../utils/ConnectorUtils'
import { AuthTypeFields } from '../KubeFormHelper'
import i18n from './DockerConnectorForm.i18n'
import css from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep.module.scss'

interface DockerConnectorFormProps {
  enableEdit?: boolean
  connector: ConnectorInfoDTO
  setConnector: (data: ConnectorInfoDTO) => void
  setConnectorForYaml: (data: ConnectorInfoDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorRequestBody) => void
}

const DockerConnectorForm: React.FC<DockerConnectorFormProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { connector } = props
  const [passwordRefSecret, setPasswordRefSecret] = useState<InlineSecret>()
  const [secretData, setSecretData] = useState<ResponseSecretResponseWrapper>()
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
    const secretManagerIdentifier = (data.data?.secret?.spec as SecretTextSpecDTO)?.secretManagerIdentifier
    setSecretData(data)
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
      const formData = buildDockerFormData(connector)
      if (formData.passwordRef) {
        getSecretForValue(formData.passwordRef, setPasswordRefSecret)
      }
    }
  }, [])

  const dockerFormData = buildDockerFormData(connector)
  delete dockerFormData.passwordRef

  return (
    <Formik
      initialValues={{
        ...dockerFormData,
        passwordRefSecret
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.validation.name),
        identifier: Yup.string().when('name', {
          is: val => val?.length,
          then: Yup.string()
            .trim()
            .required(i18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validation.validIdRegex)
            .notOneOf(StringUtils.illegalIdentifiers)
        }),
        dockerRegistryUrl: Yup.string().trim().required(i18n.validation.dockerUrl)
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        const connectorData = {
          ...formData,
          projectIdentifier: projectIdentifier,
          orgIdentifier: orgIdentifier
        }
        props.onSubmit(buildDockerPayload(connectorData))
      }}
      validate={data => props.setConnectorForYaml(buildDockerPayload(data).connector)}
    >
      {formikProps => (
        <Form>
          <Layout.Vertical width={370} spacing="small">
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
            <FormInput.Text name="dockerRegistryUrl" label={i18n.DockerRegistryURL} />
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
              isOptional={true}
            />
          </Layout.Vertical>
          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Button intent="primary" type="submit" text={i18n.SUBMIT} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default DockerConnectorForm
