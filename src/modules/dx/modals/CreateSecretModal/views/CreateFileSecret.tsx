import React from 'react'
import { Text, Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useCreateSecretText } from 'services/cd-ng'
import type { SecretTextDTO, NGSecretManagerConfigDTO } from 'services/cd-ng'

import i18n from '../CreateSecretModal.i18n'

interface CreateTextSecretProps {
  secretsManagers: NGSecretManagerConfigDTO[]
  onSuccess: (data: SecretTextDTO) => void
}

const CreateTextSecret: React.FC<CreateTextSecretProps> = props => {
  const { mutate: createSecret } = useCreateSecretText({})

  const handleSubmit = async (data: SecretTextDTO): Promise<void> => {
    try {
      await createSecret(data)
      props.onSuccess(data)
    } catch (e) {
      // handle error
    }
  }

  const secretManagersOptions: SelectOption[] = props.secretsManagers.map(item => {
    return {
      label: item.identifier || '',
      value: item.uuid || ''
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
          // value: Yup.string().trim().required(),
          kmsId: Yup.string().trim().required(i18n.validationKms)
        })}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.InputWithIdentifier inputName="name" inputLabel={i18n.labelSecretName} idName="identifier" />
            <input type="file" name="file" style={{ marginBottom: '15px' }} />
            <FormInput.Select name="kmsId" label={i18n.labelSecretsManager} items={secretManagersOptions} />
            <Button intent="primary" type="submit" text="Submit" margin={{ top: 'large' }} />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default CreateTextSecret
