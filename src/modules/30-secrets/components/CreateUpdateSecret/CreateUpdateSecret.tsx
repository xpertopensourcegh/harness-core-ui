import React, { useEffect, useState } from 'react'
import {
  Formik,
  FormikForm,
  FormInput,
  Button,
  SelectOption,
  Text,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uicore'
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
  ConnectorInfoDTO,
  ConnectorResponse,
  ResponsePageConnectorResponse,
  VaultConnectorDTO
} from 'services/cd-ng'
import type { SecretTextSpecDTO, SecretFileSpecDTO } from 'services/cd-ng'
import { useToaster } from '@common/exports'
import { illegalIdentifiers } from '@common/utils/StringUtils'
import type { UseGetMockData } from '@common/utils/testUtils'
import i18n from './CreateUpdateSecret.i18n'
import VaultFormFields from './views/VaultFormFields'
import LocalFormFields from './views/LocalFormFields'

export type SecretFormData = Omit<SecretDTOV2, 'spec'> & SecretTextSpecDTO & SecretFileSpecDTO

interface CreateUpdateSecretProps {
  secret?: SecretResponseWrapper
  type?: SecretResponseWrapper['secret']['type']
  onChange?: (data: SecretDTOV2) => void
  onSuccess?: (data: SecretFormData) => void
  connectorListMockData?: UseGetMockData<ResponsePageConnectorResponse>
}

const CreateUpdateSecret: React.FC<CreateUpdateSecretProps> = props => {
  const { onSuccess } = props
  const secret = props.secret?.secret
  let { type = 'SecretText' } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  const { data: secretManagersApiResponse, loading: loadingSecretsManagers } = useGetConnectorList({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier, category: 'SECRET_MANAGER' },
    mock: props.connectorListMockData
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
    const file = (data as any)?.['file']?.[0]
    file && formData.set('file', file)
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
    secretManagersApiResponse?.data?.content?.map((item: ConnectorResponse) => {
      return {
        label: item.connector?.name || '',
        value: item.connector?.identifier || ''
      }
    }) || []
  const defaultSecretManagerId = secretManagersApiResponse?.data?.content?.filter(
    item => item.connector?.spec?.default
  )[0]?.connector?.identifier

  const [selectedSecretManager, setSelectedSecretManager] = useState<ConnectorInfoDTO | undefined>()
  const [readOnlySecretManager, setReadOnlySecretManager] = useState<boolean>()

  useEffect(() => {
    const selectedSM = secretManagersApiResponse?.data?.content?.filter(
      itemValue => itemValue.connector?.identifier === defaultSecretManagerId
    )?.[0]?.connector
    setSelectedSecretManager(selectedSM)
    setReadOnlySecretManager((selectedSM?.spec as VaultConnectorDTO)?.readOnly)
  }, [defaultSecretManagerId])

  return (
    <>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Formik<SecretFormData>
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: {},
          valueType: readOnlySecretManager ? 'Reference' : 'Inline',
          type: type || 'SecretText',
          secretManagerIdentifier: selectedSecretManager?.identifier || defaultSecretManagerId || '',
          orgIdentifier,
          projectIdentifier,
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
          const typeOfSelectedSecretManager = secretManagersApiResponse?.data?.content?.filter(
            itemValue => itemValue.connector?.identifier === formikProps.values['secretManagerIdentifier']
          )?.[0]?.connector?.type
          typeOfSelectedSecretManager === 'Vault' &&
            setReadOnlySecretManager((selectedSecretManager?.spec as VaultConnectorDTO)?.readOnly)

          return (
            <FormikForm>
              <FormInput.Select
                name="secretManagerIdentifier"
                label={i18n.labelSecretsManager}
                items={secretManagersOptions}
                disabled={editing || loadingSecretsManagers}
                onChange={item => {
                  setSelectedSecretManager(
                    secretManagersApiResponse?.data?.content?.filter(
                      itemValue => itemValue.connector?.identifier === item.value
                    )?.[0]?.connector
                  )
                }}
              />
              <FormInput.InputWithIdentifier
                inputName="name"
                inputLabel={i18n.labelSecretName}
                idName="identifier"
                isIdentifierEditable={!editing}
              />
              {!typeOfSelectedSecretManager ? <Text>{i18n.messageSelectSM}</Text> : null}
              {typeOfSelectedSecretManager === 'Local' || typeOfSelectedSecretManager === 'GcpKms' ? (
                <LocalFormFields formik={formikProps} type={type} editing={editing} />
              ) : null}
              {typeOfSelectedSecretManager === 'Vault' ? (
                <VaultFormFields formik={formikProps} type={type} editing={editing} readonly={readOnlySecretManager} />
              ) : null}
              <Button
                intent="primary"
                type="submit"
                text={loading ? i18n.btnSaving : i18n.btnSave}
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
