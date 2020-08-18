import React from 'react'
import { useParams } from 'react-router-dom'
import { Layout, FormInput, SelectOption } from '@wings-software/uikit'

import { useGetConnectorList } from 'services/cd-ng'

import i18n from '../SecretDetails.i18n'

const EditVisualSecret: React.FC = () => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()

  const { data: secretsManagersApiResponse } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: { orgIdentifier, projectIdentifier, type: 'Vault' }
  })
  const secretManagersOptions: SelectOption[] =
    secretsManagersApiResponse?.data?.content?.map(item => {
      return {
        label: item.name || '',
        value: item.identifier || ''
      }
    }) || []

  return (
    <Layout.Vertical width={500}>
      <FormInput.InputWithIdentifier
        inputName="name"
        inputLabel={i18n.labelName}
        idName="identifier"
        isIdentifierEditable={false}
      />
      <FormInput.Text
        name="value"
        label={i18n.labelValue}
        inputGroup={{ type: 'password' }}
        placeholder={i18n.valueValue}
      />
      <FormInput.Select
        disabled
        name="secretManagerIdentifier"
        label={i18n.labelSecretManager}
        items={secretManagersOptions}
      />
      <FormInput.TextArea name="description" label={i18n.labelDescription} />
      <FormInput.TagInput
        name="tags"
        label={i18n.labelTags}
        items={[]}
        labelFor={name => name as string}
        itemFromNewTag={newTag => newTag}
        tagInputProps={{
          showClearAllButton: true,
          allowNewTag: true
        }}
      />
    </Layout.Vertical>
  )
}

export default EditVisualSecret
