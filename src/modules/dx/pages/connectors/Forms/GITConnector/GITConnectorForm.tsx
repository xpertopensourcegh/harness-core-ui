import React, { useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  SelectV2,
  Button,
  SelectOption,
  Text,
  Icon
} from '@wings-software/uikit'
import type { ConnectorDTO, ConnectorRequestWrapper } from 'services/cd-ng'
import UsernamePassword from 'modules/dx/components/connectors/ConnectorFormFields/UsernamePassword'
import { buildGITFormData, buildGITPayload } from '../../utils/ConnectorUtils'
import { getLabelForAuthType, AuthTypes } from '../../utils/ConnectorHelper'
import { AuthTypeFields } from '../KubeFormHelper'

import i18n from './GITConnectorForm.i18n'
import css from './GITConnectorForm.module.scss'

interface GITConnectorFormProps {
  enableEdit?: boolean
  connector: ConnectorDTO
  setConnector: (data: ConnectorDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorRequestWrapper) => void
}

const GITConnectorForm: React.FC<GITConnectorFormProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [connectType, setConnectType] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)
  const [authType, setAuthType] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)
  const { connector } = props

  return (
    <Formik
      initialValues={{
        ...buildGITFormData(connector)
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(),
        description: Yup.string()
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        props.onSubmit(buildGITPayload(formData))
      }}
      validate={data => props.setConnector(buildGITPayload(data).connector)}
    >
      {formikProps => (
        <Form>
          <div className={css.formCustomCss}>
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
            <div className={css.formFields}>
              <FormInput.RadioGroup
                name="connectionType"
                label={i18n.CONFIGURE_TEXT}
                items={[
                  { label: i18n.gitAccount, value: 'Account' },
                  { label: i18n.gitRepo, value: 'Repo' }
                ]}
                className={css.radioGroup}
              />
              <Text className={css.connectByLabel}>{i18n.CONNECT_TEXT}</Text>
              <Layout.Horizontal className={css.connectWrp}>
                <SelectV2
                  items={[
                    { label: i18n.HTTP, value: 'Http' },
                    { label: i18n.SSH, value: 'Ssh' }
                  ]}
                  value={connectType}
                  filterable={false}
                  onChange={item => {
                    setConnectType(item)
                    formikProps.setFieldValue('connectType', item.value)
                  }}
                  className={css.selectConnectType}
                >
                  <Button text={connectType.label} rightIcon="chevron-down" minimal />
                </SelectV2>

                <FormInput.Text name="url" className={css.enterUrl} />
              </Layout.Horizontal>
              {connectType?.value === 'Ssh' ? (
                <div className={css.sshFields}>
                  <FormInput.Text
                    name="sshKeyReference"
                    label={i18n.SSH_ENCRYPTED_KEY}
                    inputGroup={{ type: 'password' }}
                  />
                  <FormInput.Text name="branchName" label={i18n.BRANCH_NAME} />
                </div>
              ) : null}
              {connectType?.value === 'Http' ? (
                <Layout.Vertical spacing="medium">
                  <Layout.Horizontal className={css.credWrapper}>
                    <div className={css.label}>
                      <Icon name="lock" size={14} className={css.lockIcon} />
                      {i18n.Authentication}
                    </div>

                    <SelectV2
                      items={[{ label: getLabelForAuthType(AuthTypes.USER_PASSWORD), value: AuthTypes.USER_PASSWORD }]}
                      value={authType}
                      filterable={false}
                      onChange={item => {
                        setAuthType(item)
                        formikProps.setFieldValue('authType', item.value)
                      }}
                      className={css.selectAuth}
                    >
                      <Button text={authType.label} rightIcon="chevron-down" minimal />
                    </SelectV2>
                  </Layout.Horizontal>
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
                  <FormInput.Text name="branchName" label={i18n.BranchName} />
                </Layout.Vertical>
              ) : null}
            </div>
          </div>

          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Button intent="primary" type="submit" text={'Submit'} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default GITConnectorForm
