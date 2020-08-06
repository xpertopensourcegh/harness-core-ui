import React from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { Text, Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import { SecretTextCreateDTO, SecretManagerConfigDTO, useCreateSecretFile } from 'services/cd-ng'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'
import { useToaster } from 'modules/common/exports'

import i18n from '../CreateSecretModal.i18n'

interface SecretFileCreateDTO extends Omit<SecretTextCreateDTO, 'value' | 'path'> {
  file?: File
}

interface CreateSecretFileProps {
  secretsManagers: SecretManagerConfigDTO[]
  onSuccess: (data: SecretFileCreateDTO) => void
}

const CreateSecretFile: React.FC<CreateSecretFileProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const { mutate: createFile, loading } = useCreateSecretFile({})
  const handleSubmit = async (data: SecretFileCreateDTO): Promise<void> => {
    const dataToSubmit = new FormData()
    dataToSubmit.set('accountIdentifier', accountId)
    if (projectIdentifier) dataToSubmit.set('projectIdentifier', projectIdentifier)
    if (orgIdentifier) dataToSubmit.set('orgIdentifier', orgIdentifier)

    Object.entries(data).forEach(([key, value]) => {
      dataToSubmit.set(key, key === 'file' ? value[0] : value)
    })

    try {
      await createFile(dataToSubmit as any)
      showSuccess(`Secret '${data.name}' created successfully`)
      props.onSuccess(data)
    } catch (e) {
      showError(e.message)
    }
  }

  const secretManagersOptions: SelectOption[] = props.secretsManagers.map(item => {
    return {
      label: item.name || '',
      value: item.identifier || ''
    }
  })
  const defaultSecretManagerId = props.secretsManagers.filter(item => item.default)[0]?.identifier

  return (
    <>
      <Text font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
        {i18n.titleCreateFile}
      </Text>
      <Formik<SecretFileCreateDTO>
        initialValues={{
          name: '',
          secretManagerIdentifier: defaultSecretManagerId
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .trim()
            .required(i18n.validationName)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validationIdentifierChars),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .required(i18n.validationIdentifier)
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validationIdentifierChars)
              .notOneOf(illegalIdentifiers)
          }),
          file: Yup.mixed().required(),
          secretManagerIdentifier: Yup.string().trim().required(i18n.validationKms)
        })}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.Select
              name="secretManagerIdentifier"
              label={i18n.labelSecretsManager}
              items={secretManagersOptions}
            />
            <FormInput.InputWithIdentifier inputName="name" inputLabel={i18n.labelSecretName} idName="identifier" />
            <FormInput.FileInput name="file" multiple />
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
            <Button intent="primary" type="submit" text="Submit" margin={{ top: 'large' }} disabled={loading} />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default CreateSecretFile
