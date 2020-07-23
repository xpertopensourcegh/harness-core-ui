import React from 'react'
import { Layout, Formik, FormikForm, FormInput, Button } from '@wings-software/uikit'
import * as Yup from 'yup'

import i18n from '../SecretDetails.i18n'
import { EncryptedDataDTO, useUpdateSecretText } from 'services/cd-ng'
import { useParams } from 'react-router-dom'

interface EditVisualSecretProps {
  secret: EncryptedDataDTO
}

const EditVisualSecret: React.FC<EditVisualSecretProps> = ({ secret }) => {
  const { accountId } = useParams()
  const { mutate } = useUpdateSecretText({ queryParams: { accountIdentifier: accountId } })

  const handleSubmit = async (data: EncryptedDataDTO): Promise<void> => {
    try {
      await mutate(data)
    } catch (e) {
      // handle error
    }
  }

  return (
    <Layout.Vertical width={500} margin={{ top: 'large' }}>
      <Formik
        initialValues={{
          name: secret.name,
          value: secret.encryptedValue,
          kmsId: secret.kmsId,
          identifier: secret.uuid
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          value: Yup.string().trim().required(),
          kmsId: Yup.string().trim().required()
        })}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.InputWithIdentifier inputName="name" inputLabel={i18n.labelName} idName="identifier" />
            <FormInput.Text name="value" label={i18n.labelValue} inputGroup={{ type: 'password' }} />
            <FormInput.Select
              name="kmsId"
              label={i18n.labelSecretManager}
              items={[]}
              // selectProps={{ defaultSelectedItem: defaultSecretManagerOption }}
            />
            <Button intent="primary" type="submit" text={i18n.buttonSubmit} margin={{ top: 'large' }} />
          </FormikForm>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default EditVisualSecret
