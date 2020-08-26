import React from 'react'
import { Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import {
  EncryptedDataDTO,
  usePutSecretText,
  usePutSecretFile,
  usePostSecretFile,
  usePostSecretText,
  useGetConnectorList,
  SecretFileDTO
} from 'services/cd-ng'
import type { SecretTextDTO } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'

import i18n from './CreateUpdateSecret.i18n'

interface CreateSecretTextProps {
  secret?: EncryptedDataDTO
  type: EncryptedDataDTO['type']
  onChange?: (data: SecretTextDTO | SecretFileDTO) => void
  onSuccess?: (data: SecretTextDTO | SecretFileDTO) => void
}

const createFormDataFromJson = (data: SecretFileDTO, accountId: string, project?: string, org?: string): FormData => {
  const dataToSubmit = new FormData()

  dataToSubmit.set('account', accountId)
  if (project) dataToSubmit.set('project', project)
  if (org) dataToSubmit.set('org', org)
  delete (data as SecretTextDTO).valueType

  Object.entries(data).forEach(([key, value]) => {
    dataToSubmit.set(key, key === 'file' ? value[0] : value)
  })
  return dataToSubmit
}

const CreateUpdateSecret: React.FC<CreateSecretTextProps> = props => {
  const { secret, onSuccess, type } = props
  const editing = !!secret
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const { data: secretManagersApiResponse, loading: loadingSecretsManagers } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: { orgIdentifier, projectIdentifier, categories: ['SECRET_MANAGER'] }
  })
  const { mutate: createSecretText, loading: loadingCreateText } = usePostSecretText({})
  const { mutate: createSecretFile, loading: loadingCreateFile } = usePostSecretFile({})
  const { mutate: updateSecretText, loading: loadingUpdateText } = usePutSecretText({
    identifier: secret?.identifier as string
  })
  const { mutate: updateSecretFile, loading: loadingUpdateFile } = usePutSecretFile({
    identifier: secret?.identifier as string
  })

  const loading = loadingCreateText || loadingCreateFile || loadingUpdateText || loadingUpdateFile

  const handleSubmit = async (data: SecretTextDTO | SecretFileDTO): Promise<void> => {
    try {
      if (editing) {
        if (type === 'SecretText') {
          await updateSecretText(data as SecretTextDTO)
        }
        if (type === 'SecretFile') {
          const formData = createFormDataFromJson(data as SecretFileDTO, accountId, projectIdentifier, orgIdentifier)
          await updateSecretFile(formData as any)
        }
      } else {
        data.account = accountId
        if (projectIdentifier) data.project = projectIdentifier
        if (orgIdentifier) data.org = orgIdentifier

        if (type === 'SecretText') {
          await createSecretText(data as SecretTextDTO)
        }
        if (type === 'SecretFile') {
          const formData = createFormDataFromJson(data as SecretFileDTO, accountId, projectIdentifier, orgIdentifier)
          await createSecretFile(formData as any)
        }
        showSuccess(`Secret '${data.name}' created successfully`)
      }

      onSuccess?.(data)
    } catch (e) {
      showError(e?.data?.message || 'Something went wrong')
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
      <Formik<SecretTextDTO | SecretFileDTO>
        initialValues={{
          valueType: 'Inline',
          type: type || 'SecretText',
          secretManager: defaultSecretManagerId,
          ...secret
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
          secretManager: Yup.string().required(i18n.validationKms)
        })}
        validate={data => {
          props.onChange?.(data)
        }}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {formikProps => (
          <FormikForm>
            <FormInput.Select
              name="secretManager"
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
            {type === 'SecretText' ? (
              <>
                <FormInput.RadioGroup
                  name="valueType"
                  radioGroup={{ inline: true }}
                  items={[
                    { label: 'Inline Secret Value', value: 'Inline' },
                    { label: 'Reference Secret', value: 'Reference' }
                  ]}
                />
                {(formikProps as FormikProps<SecretTextDTO>).values['valueType'] === 'Inline' ? (
                  <FormInput.Text
                    name="value"
                    label={i18n.labelSecretValue}
                    placeholder={editing ? i18n.valueEncrypted : i18n.placeholderSecretValue}
                    inputGroup={{ type: 'password' }}
                  />
                ) : null}
                {(formikProps as FormikProps<SecretTextDTO>).values['valueType'] === 'Reference' ? (
                  <FormInput.Text
                    name="value"
                    label={i18n.labelSecretReference}
                    placeholder={i18n.placeholderSecretReference}
                  />
                ) : null}
              </>
            ) : null}
            {type === 'SecretFile' ? <FormInput.FileInput name="file" multiple /> : null}
            <FormInput.TextArea name="description" label={i18n.labelSecretDescription} />
            <FormInput.TagInput
              name="tags"
              label={i18n.labelSecretTags}
              items={[]}
              labelFor={name => name as string}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                showClearAllButton: true,
                allowNewTag: true
              }}
            />
            <Button
              intent="primary"
              type="submit"
              text={loading ? 'Saving' : 'Submit'}
              margin={{ top: 'large' }}
              disabled={loading}
            />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default CreateUpdateSecret
