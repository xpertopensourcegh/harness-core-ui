import React, { useState } from 'react'
import {
  Formik,
  FormikForm,
  FormInput,
  Button,
  SelectOption,
  Text,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'
import {
  usePutSecret,
  usePutSecretFileV2,
  usePostSecretFileV2,
  usePostSecret,
  useGetConnectorList,
  SecretDTOV2,
  SecretResponseWrapper,
  SecretRequestWrapper,
  ConnectorSummaryDTO
} from 'services/cd-ng'
import type { SecretTextSpecDTO, SecretFileSpecDTO } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'

import i18n from './CreateUpdateSecret.i18n'
import VaultFormFields from './views/VaultFormFields'
import LocalFormFields from './views/LocalFormFields'

export type SecretFormData = Omit<SecretDTOV2, 'spec'> & SecretTextSpecDTO & SecretFileSpecDTO

interface CreateSecretTextProps {
  secret?: SecretResponseWrapper
  type?: SecretResponseWrapper['secret']['type']
  onChange?: (data: SecretDTOV2) => void
  onSuccess?: (data: SecretFormData) => void
}

const CreateUpdateSecret: React.FC<CreateSecretTextProps> = props => {
  const { onSuccess } = props
  const secret = props.secret?.secret
  let { type = 'SecretText' } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const { data: secretManagersApiResponse, loading: loadingSecretsManagers } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: { orgIdentifier, projectIdentifier, category: 'SECRET_MANAGER' }
  })
  const { mutate: createSecretText, loading: loadingCreateText } = usePostSecret({
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: createSecretFile, loading: loadingCreateFile } = usePostSecretFileV2({
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateSecretText, loading: loadingUpdateText } = usePutSecret({
    identifier: secret?.identifier as string,
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateSecretFile, loading: loadingUpdateFile } = usePutSecretFileV2({
    identifier: secret?.identifier as string,
    queryParams: { accountIdentifier: accountId }
  })

  const loading = loadingCreateText || loadingUpdateText || loadingCreateFile || loadingUpdateFile
  const editing = !!secret?.identifier
  if (secret && secret.type) type = secret?.type

  const createFormData = (data: SecretFormData): FormData => {
    const formData = new FormData()
    formData.set(
      'spec',
      JSON.stringify({
        secret: {
          type,
          ...pick(data, ['name', 'identifier', 'description', 'tags']),
          orgIdentifier,
          projectIdentifier,
          spec: {
            ...pick(data, ['secretManagerIdentifier'])
          } as SecretFileSpecDTO
        } as SecretDTOV2
      })
    )
    formData.set('file', (data as any)?.['file']?.[0])
    return formData
  }

  const createSecretTextData = (data: SecretFormData): SecretRequestWrapper => {
    return {
      secret: {
        type,
        ...pick(data, ['name', 'identifier', 'description', 'tags']),
        orgIdentifier,
        projectIdentifier,
        spec: {
          ...pick(data, ['secretManagerIdentifier', 'value', 'valueType'])
        } as SecretTextSpecDTO
      }
    }
  }

  const handleSubmit = async (data: SecretFormData): Promise<void> => {
    try {
      if (editing) {
        if (type === 'SecretText') {
          await updateSecretText(createSecretTextData(data))
        }
        if (type === 'SecretFile') {
          await updateSecretFile(createFormData(data) as any)
        }
        showSuccess(`Secret '${data.name}' updated successfully`)
      } else {
        if (type === 'SecretText') {
          await createSecretText(createSecretTextData(data))
        }
        if (type === 'SecretFile') {
          await createSecretFile(createFormData(data) as any)
        }
        showSuccess(`Secret '${data.name}' created successfully`)
      }

      onSuccess?.(data)
    } catch (error) {
      modalErrorHandler?.showDanger(error.data.message)
    }
  }

  const secretManagersOptions: SelectOption[] =
    secretManagersApiResponse?.data?.content?.map(item => {
      return {
        label: item.name || '',
        value: item.identifier || ''
      }
    }) || []
  const defaultSecretManagerId = secretManagersApiResponse?.data?.content?.filter(
    item => item.connectorDetails?.default
  )[0]?.identifier

  return (
    <>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Formik<SecretFormData>
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: {},
          valueType: 'Inline',
          type: type || 'SecretText',
          secretManagerIdentifier: defaultSecretManagerId || '',
          ...pick(secret, ['name', 'identifier', 'description', 'tags']),
          ...pick(secret?.spec, ['valueType', 'secretManagerIdentifier'])
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validationName),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .required(i18n.validationIdentifier)
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validationIdentifierChars)
              .notOneOf(illegalIdentifiers)
          }),
          value: editing || type === 'SecretFile' ? Yup.string() : Yup.string().trim().required(i18n.validationValue),
          secretManagerIdentifier: Yup.string().required(i18n.validationKms)
        })}
        validate={formData => {
          props.onChange?.({
            type: formData.type,
            ...pick(formData, ['name', 'description', 'identifier']),
            tags: {},
            spec: pick(formData, ['value', 'valueType', 'secretManagerIdentifier']) as SecretTextSpecDTO
          })
        }}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {formikProps => {
          const typeOfSelectedSecretManager: ConnectorSummaryDTO['type'] = secretManagersApiResponse?.data?.content?.filter(
            item => item.identifier === formikProps.values['secretManagerIdentifier']
          )?.[0]?.type
          return (
            <FormikForm>
              <FormInput.Select
                name="secretManagerIdentifier"
                label={i18n.labelSecretsManager}
                items={secretManagersOptions}
                disabled={editing || loadingSecretsManagers}
              />
              <FormInput.InputWithIdentifier
                inputName="name"
                inputLabel={i18n.labelSecretName}
                idName="identifier"
                isIdentifierEditable={!editing}
              />
              {!typeOfSelectedSecretManager ? <Text>{i18n.messageSelectSM}</Text> : null}
              {typeOfSelectedSecretManager === 'Local' || typeOfSelectedSecretManager === 'GcpKms' ? (
                <LocalFormFields formik={formikProps} editing={editing} />
              ) : null}
              {typeOfSelectedSecretManager === 'Vault' ? (
                <VaultFormFields formik={formikProps} type={type} editing={editing} />
              ) : null}
              <Button
                intent="primary"
                type="submit"
                text={loading ? 'Saving' : 'Submit'}
                margin={{ top: 'large' }}
                disabled={loading || !typeOfSelectedSecretManager}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </>
  )
}

export default CreateUpdateSecret
