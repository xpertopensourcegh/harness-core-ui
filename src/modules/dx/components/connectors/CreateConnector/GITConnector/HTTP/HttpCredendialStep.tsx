import React, { useState } from 'react'
import { Layout, Button, Formik, FormInput, Text, SelectOption, Icon } from '@wings-software/uikit'
// import * as Yup from 'yup'
import i18n from './HttpCredentialStep.i18n'
import css from './HttpCredentialStep.module.scss'
import { Form } from 'formik'
import { Select } from '@blueprintjs/select'
import type { GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import { getCustomFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { buildGITPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  useListSecretManagers,
  SecretManagerConfig
} from 'services/cd-ng'

interface HttpCredentialStepProps {
  name: string
  setFormData: (formData: GITFormData | undefined) => void
  formData: GITFormData | undefined
  // not able to add StepPorps as
  nextStep?: () => void
  accountId: string
  hideLightModal: () => void
}
const CustomSelect = Select.ofType<SelectOption>()

// type showing as incompatible for property "type" in data with BE
const createConnectorByType = async (
  createConnector: (data: ConnectorRequestDTORequestBody) => Promise<any>,
  data: any
) => {
  try {
    const { loading, data: connectordetails } = await createConnector(data as ConnectorRequestDTORequestBody)
    if (!loading && connectordetails) {
      // todo:
      // state.setConnector(connector)
      // const formData = buildKubFormData(connector)
      // state.setConnector(formData)
    }
    //todo else
  } catch (e) {
    // TODO: handle error
  }
}

const HttpCredentialStep: React.FC<HttpCredentialStepProps> = props => {
  const [authType, setAuthType] = useState({
    label: 'Username and Password',
    value: 'UsernamePassword'
  } as SelectOption)
  const { mutate: createConnector } = useCreateConnector({})
  const { data: secretManagersApiResponse } = useListSecretManagers({
    queryParams: { accountIdentifier: props.accountId }
  })
  return (
    <div className={css.credStep}>
      <Text font="medium" className={css.headingCred}>
        {i18n.Credentials}
      </Text>
      <Formik
        initialValues={{
          authType: props.formData?.authType || '',
          username: props.formData?.username || '',
          password: props.formData?.password || '',
          branchName: props.formData?.branchName || ''
        }}
        //ToDo: validationSchema={Yup.object().shape({
        //     authType: Yup.string().trim().required(),
        //     // username: Yup.string().trim().required(),
        //     // authType: Yup.string().trim().required(),
        //     // authType: Yup.string().trim()
        //   })}
        onSubmit={formData => {
          const connectorData = { ...formData, ...props.formData, authType: authType?.value }
          const data = buildGITPayload(connectorData)
          createConnectorByType(createConnector, data)
        }}
      >
        {formikProps => (
          <div className={css.formWrapper}>
            <Form className={css.credForm}>
              <div className={css.formFields}>
                <Layout.Horizontal className={css.credWrapper}>
                  <div className={css.label}>
                    <Icon name="lock" size={14} className={css.lockIcon} />
                    {i18n.Authentication}
                  </div>
                  <CustomSelect
                    items={[
                      { label: 'Username and Password', value: 'UsernamePassword' }
                      //ToDo: { label: 'Kerberos', value: 'Kerberos' }
                    ]}
                    filterable={false}
                    itemRenderer={(item, { handleClick }) => (
                      <Button
                        inline
                        minimal
                        text={item.label}
                        onClick={e => handleClick(e as React.MouseEvent<HTMLElement, MouseEvent>)}
                      />
                    )}
                    onItemSelect={item => {
                      setAuthType(item)
                      formikProps.setFieldValue('authType', item.value)
                    }}
                    popoverProps={{ minimal: true }}
                  >
                    <Button
                      inline
                      minimal
                      rightIcon="chevron-down"
                      text={authType ? authType.label : 'Select...'}
                      className={css.connectByBtn}
                    />
                  </CustomSelect>
                </Layout.Horizontal>
                {/* Forcing  SecretManagerConfig[] type untill secrets integration is done */}
                <div className={css.authFields}>
                  {getCustomFields(
                    authType?.value,
                    secretManagersApiResponse?.data as SecretManagerConfig[],
                    props.formData?.name
                  )}
                </div>
                <FormInput.Text name="branchName" label="Branch Name" className={css.branchName} />
              </div>
              <Layout.Horizontal spacing="large" className={css.footer}>
                <Button type="submit" className={css.saveBtn} text={i18n.SAVE_CREDENTIALS_AND_CONTINUE} />
              </Layout.Horizontal>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default HttpCredentialStep
