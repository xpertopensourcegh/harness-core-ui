import React from 'react'
import { useParams } from 'react-router-dom'
import { Text, Formik, FormikForm, FormInput, Button, SelectOption } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useCreateSecretText } from 'services/cd-ng'
import type { SecretTextDTO, SecretManagerConfig } from 'services/cd-ng'

import i18n from '../CreateSecretModal.i18n'

interface CreateTextSecretProps {
  secretsManagers: SecretManagerConfig[]
  onSuccess: (data: SecretTextDTO) => void
}

const CreateTextSecret: React.FC<CreateTextSecretProps> = props => {
  const { accountId } = useParams()
  const { mutate: createSecret } = useCreateSecretText({ queryParams: { accountId: accountId } })

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
      label: item.name || '',
      value: item.uuid || ''
    }
  })
  const defaultSecretManagerId = props.secretsManagers.filter(item => item.default)[0]?.uuid
  const defaultSecretManagerOption = secretManagersOptions.filter(item => item.value === defaultSecretManagerId)[0]

  return (
    <>
      <Text font={{ size: 'medium' }} margin={{ bottom: 'large' }}>
        {i18n.titleCreateText}
      </Text>
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validationName),
          value: Yup.string().trim().required(i18n.validationValue),
          kmsId: Yup.string().trim().required(i18n.validationKms)
        })}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.InputWithIdentifier inputName="name" inputLabel={i18n.labelSecretName} idName="identifier" />
            <FormInput.Text
              name="value"
              label={i18n.labelSecretValue}
              placeholder={i18n.placeholderSecretValue}
              inputGroup={{ type: 'password' }}
            />
            <FormInput.Select
              name="kmsId"
              label={i18n.labelSecretsManager}
              items={secretManagersOptions}
              selectProps={{ defaultSelectedItem: defaultSecretManagerOption }}
            />
            <Button intent="primary" type="submit" text="Submit" margin={{ top: 'large' }} />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default CreateTextSecret
