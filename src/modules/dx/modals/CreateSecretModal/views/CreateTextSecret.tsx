import React from 'react'
import { Text, Formik, FormikForm, FormInput, Button, SelectOption, Color } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import { omit } from 'lodash-es'
import { useCreateSecretText } from 'services/cd-ng'
import type { SecretTextCreateDTO, SecretManagerConfigDTO } from 'services/cd-ng'

import i18n from '../CreateSecretModal.i18n'

interface CreateTextSecretProps {
  secretsManagers: SecretManagerConfigDTO[]
  onSuccess: (data: SecretTextCreateDTO) => void
}

interface CreateTextSecretForm extends SecretTextCreateDTO {
  valueOrReference: 'inline' | 'reference'
}

const CreateTextSecret: React.FC<CreateTextSecretProps> = props => {
  const { accountId } = useParams()
  const { mutate: createSecret, loading } = useCreateSecretText({})

  const handleSubmit = async (data: CreateTextSecretForm): Promise<void> => {
    const dataToSubmit: SecretTextCreateDTO = omit(data, ['valueOrReference'])
    dataToSubmit.accountIdentifier = accountId

    try {
      await createSecret(dataToSubmit)
      props.onSuccess(dataToSubmit)
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
  const defaultSecretManagerId = props.secretsManagers.filter(item => item.default)[0]?.identifier

  return (
    <>
      <Text font={{ size: 'medium' }} color={Color.BLACK} margin={{ bottom: 'large' }}>
        {i18n.titleCreateText}
      </Text>
      <Formik
        initialValues={{
          valueOrReference: 'inline',
          secretManagerIdentifier: defaultSecretManagerId
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validationName),
          value: Yup.string().trim().required(i18n.validationValue),
          secretManagerIdentifier: Yup.string().required(i18n.validationKms)
        })}
        onSubmit={data => {
          handleSubmit(data)
        }}
      >
        {(formikProps: FormikProps<CreateTextSecretForm>) => (
          <FormikForm>
            <FormInput.Select
              name="secretManagerIdentifier"
              label={i18n.labelSecretsManager}
              items={secretManagersOptions}
              onChange={selectedSecret => {
                formikProps.setFieldValue('secretManagerIdentifier', selectedSecret.value)
                formikProps.setFieldValue('secretManagerName', selectedSecret.label)
              }}
            />
            <input name="secretManagerName" type="hidden" value={formikProps.values.secretManagerName} />
            <FormInput.InputWithIdentifier inputName="name" inputLabel={i18n.labelSecretName} idName="identifier" />
            <FormInput.RadioGroup
              name="valueOrReference"
              items={[
                { label: 'Inline Secret Value', value: 'inline' },
                { label: 'Reference Secret', value: 'reference' }
              ]}
            />
            {formikProps.values['valueOrReference'] === 'inline' ? (
              <FormInput.Text
                name="value"
                label={i18n.labelSecretValue}
                placeholder={i18n.placeholderSecretValue}
                inputGroup={{ type: 'password' }}
              />
            ) : null}
            {formikProps.values['valueOrReference'] === 'reference' ? (
              <FormInput.Text
                name="path"
                label={i18n.labelSecretReference}
                placeholder={i18n.placeholderSecretReference}
              />
            ) : null}
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

export default CreateTextSecret
