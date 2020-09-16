import React from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import { Formik, FormikForm as Form, FormInput, Layout, Button } from '@wings-software/uikit'
import type { ConnectorDTO } from 'services/cd-ng'
import UsernamePassword from 'modules/dx/components/connectors/ConnectorFormFields/UsernamePassword'
import { StringUtils } from 'modules/common/exports'
import { buildDockerFormData, buildDockerPayload } from '../../utils/ConnectorUtils'
import { AuthTypeFields } from '../KubeFormHelper'
import i18n from './DockerConnectorForm.i18n'

interface DockerConnectorFormProps {
  enableEdit?: boolean
  connector: ConnectorDTO
  setConnector: (data: ConnectorDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorDTO) => void
}

const DockerConnectorForm: React.FC<DockerConnectorFormProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { connector } = props

  return (
    <Formik
      initialValues={{
        ...buildDockerFormData(connector)
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.validation.name),
        identifier: Yup.string().when('name', {
          is: val => val?.length,
          then: Yup.string()
            .trim()
            .required(i18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validation.validIdRegex)
            .notOneOf(StringUtils.illegalIdentifiers)
        }),
        dockerRegistryUrl: Yup.string().trim().required(i18n.validation.dockerUrl),
        username: Yup.string().trim().required(i18n.validation.username)
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        props.onSubmit(buildDockerPayload(formData))
      }}
      validate={data => props.setConnector(buildDockerPayload(data))}
    >
      {formikProps => (
        <Form>
          <Layout.Vertical width={370} spacing="small">
            <FormInput.InputWithIdentifier isIdentifierEditable={false} />
            <FormInput.TextArea label={i18n.description} name="description" />
            <FormInput.TagInput
              name="tags"
              label={i18n.tags}
              items={connector?.tags || []}
              labelFor={name => (typeof name === 'string' ? name : '')}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                noInputBorder: true,
                openOnKeyDown: false,
                showAddTagButton: true,
                showClearAllButton: true,
                allowNewTag: true,
                placeholder: i18n.enterTags
              }}
            />
            <FormInput.Text name="dockerRegistryUrl" label={i18n.DockerRegistryURL} />
            <UsernamePassword
              name={connector?.identifier}
              isEditMode={true}
              accountId={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              formikProps={formikProps}
              passwordField={AuthTypeFields.passwordRef}
              onClickCreateSecret={() => undefined}
            />
          </Layout.Vertical>
          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Button intent="primary" type="submit" text={i18n.SUBMIT} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default DockerConnectorForm
