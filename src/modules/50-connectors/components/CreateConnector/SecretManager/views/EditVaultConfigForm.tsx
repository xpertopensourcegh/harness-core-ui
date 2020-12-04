import React from 'react'
import * as Yup from 'yup'
import { Button, Formik, FormikForm, FormInput } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'
import type { TagsInterface } from '@common/interfaces/ConnectorsInterface'
import type { VaultConnectorDTO, ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import i18n from '../CreateSecretManager.i18n'
import VaultConnectorFormFields, { vaultConnectorFormFieldsValidationSchema } from './VaultConnectorFormFields'
import type { VaultConfigFormData } from './VaultConfigForm'

interface EditVaultConfigFormData extends VaultConfigFormData {
  name: string
  identifier: string
  description?: string
  tags?: TagsInterface
}
interface ConnectorFormProps {
  type: string
  connector: ConnectorInfoDTO
  setConnector: (val: ConnectorInfoDTO) => void
  setConnectorForYaml: (val: ConnectorInfoDTO) => void
  enableCreate?: boolean
  enableEdit?: boolean
  onSubmit: (data: ConnectorRequestBody) => void
}

const validationSchema = Yup.object().shape(vaultConnectorFormFieldsValidationSchema)

const EditVaultConfigForm: React.FC<ConnectorFormProps> = ({ connector, onSubmit, setConnectorForYaml }) => {
  const { orgIdentifier, projectIdentifier } = useParams()

  const getConnectorInfoDtoFromFormData = (formData: EditVaultConfigFormData): ConnectorInfoDTO => {
    return {
      orgIdentifier,
      projectIdentifier,
      ...pick(formData, ['name', 'identifier', 'description', 'tags']),
      type: 'Vault',
      spec: {
        ...pick(formData, ['authToken', 'basePath', 'vaultUrl', 'readOnly', 'default', 'renewIntervalHours']),
        secretEngineName:
          formData.engineType === 'manual' ? formData.secretEngineName : formData.secretEngine?.split('@@@')[0],
        secretEngineVersion:
          formData.engineType === 'manual' ? formData.secretEngineVersion : formData.secretEngine?.split('@@@')[1]
      } as VaultConnectorDTO
    }
  }

  return (
    <>
      <Formik<EditVaultConfigFormData>
        initialValues={{
          ...pick(connector, ['name', 'identifier', 'description', 'tags']),
          ...pick(connector.spec, [
            'default',
            'readOnly',
            'renewIntervalHours',
            'secretEngineName',
            'secretEngineVersion',
            'vaultUrl'
          ]),
          engineType: 'manual',
          accessType: 'TOKEN', // TODO Abhinav read from response
          basePath: '' // TODO Abhinav read from response
        }}
        validationSchema={validationSchema}
        validate={formData => {
          setConnectorForYaml(getConnectorInfoDtoFromFormData(formData))
        }}
        onSubmit={formData => {
          onSubmit({
            connector: getConnectorInfoDtoFromFormData(formData)
          })
        }}
      >
        {formik => (
          <FormikForm>
            <FormInput.InputWithIdentifier inputLabel={i18n.labelName} isIdentifierEditable={false} />
            <FormInput.TextArea label={i18n.labelDescription} name="description" />
            <FormInput.TagInput
              label={i18n.labelTags}
              name="tags"
              labelFor={name => (typeof name === 'string' ? name : '')}
              itemFromNewTag={newTag => newTag}
              items={[]}
              tagInputProps={{
                noInputBorder: true,
                openOnKeyDown: false,
                showAddTagButton: true,
                showClearAllButton: true,
                allowNewTag: true
              }}
            />
            <VaultConnectorFormFields formik={formik} identifier={connector.identifier} isEditing={true} />
            <Button intent="primary" type="submit" text={i18n.buttonSave} />
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default EditVaultConfigForm
