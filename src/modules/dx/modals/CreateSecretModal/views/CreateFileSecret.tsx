import React from 'react'
import { Text, Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useCreateSecretText } from 'services/cd-ng'
import type { SecretTextCreateDTO, SecretManagerConfigDTO } from 'services/cd-ng'

import i18n from '../CreateSecretModal.i18n'

interface CreateTextSecretProps {
  secretsManagers: SecretManagerConfigDTO[]
  onSuccess: (data: SecretTextCreateDTO) => void
}

const CreateTextSecret: React.FC<CreateTextSecretProps> = props => {
  const { mutate: createSecret } = useCreateSecretText({})

  const handleSubmit = async (data: SecretTextCreateDTO): Promise<void> => {
    try {
      await createSecret(data)
      props.onSuccess(data)
    } catch (e) {
      // handle error
    }
  }

  const secretManagersOptions: SelectOption[] = props.secretsManagers.map(item => {
    return {
      label: item.name || '',
      value: item.identifier || ''
    }
  })

  return (
    <>
      <Text font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
        {i18n.titleCreateFile}
      </Text>
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validationName),
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
            <FormInput.FileInput name="file" />
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
            <Button intent="primary" type="submit" text="Submit" margin={{ top: 'large' }} />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default CreateTextSecret
