import React from 'react'
import { Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'
import {
  usePutSecret,
  usePutSecretFileV2,
  usePostSecretFileV2,
  usePostSecret,
  useGetConnectorList,
  SecretDTOV2
} from 'services/cd-ng'
import type { SecretTextSpecDTO, SecretFileSpecDTO } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'

import i18n from './CreateUpdateSecret.i18n'

export type SecretFormData = Omit<SecretDTOV2, 'spec'> & SecretTextSpecDTO & SecretFileSpecDTO

interface CreateSecretTextProps {
  secret?: SecretDTOV2
  type: SecretDTOV2['type']
  onChange?: (data: SecretFormData) => void
  onSuccess?: (data: SecretFormData) => void
}

const CreateUpdateSecret: React.FC<CreateSecretTextProps> = props => {
  const { secret, onSuccess, type } = props
  const editing = !!secret?.identifier
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
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

  const createFormData = (data: SecretFormData): FormData => {
    const formData = new FormData()
    formData.set(
      'spec',
      JSON.stringify({
        type,
        ...pick(data, ['name', 'identifier', 'description', 'tags']),
        orgIdentifier,
        projectIdentifier,
        spec: {
          ...pick(data, ['secretManagerIdentifier'])
        } as SecretFileSpecDTO
      } as SecretDTOV2)
    )
    formData.set('file', (data as any)?.['file']?.[0])
    return formData
  }

  const createSecretTextData = (data: SecretFormData): SecretDTOV2 => {
    return {
      type,
      ...pick(data, ['name', 'identifier', 'description', 'tags']),
      orgIdentifier,
      projectIdentifier,
      spec: {
        ...pick(data, ['secretManagerIdentifier', 'value', 'valueType'])
      } as SecretTextSpecDTO
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
                {formikProps.values['valueType'] === 'Inline' ? (
                  <FormInput.Text
                    name="value"
                    label={i18n.labelSecretValue}
                    placeholder={editing ? i18n.valueEncrypted : i18n.placeholderSecretValue}
                    inputGroup={{ type: 'password' }}
                  />
                ) : null}
                {formikProps.values['valueType'] === 'Reference' ? (
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
            {/* <FormInput.TagInput
              name="tags"
              label={i18n.labelSecretTags}
              items={[]}
              labelFor={name => name as string}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                showClearAllButton: true,
                allowNewTag: true
              }}
            /> */}
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
