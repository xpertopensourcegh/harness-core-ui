import React, { useState } from 'react'
import { Layout, Button, Formik, FormInput, Text, SelectOption, Icon } from '@wings-software/uikit'
// import * as Yup from 'yup'
import { Form, FormikProps } from 'formik'
import { Select } from '@blueprintjs/select'
import { useParams } from 'react-router-dom'
import type { GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import { buildGITPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import { useCreateConnector, ConnectorRequestDTORequestBody, useCreateSecretText } from 'services/cd-ng'
import type { InlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import ConnectorFormFields from '../../../ConnectorFormFields/ConnectorFormFields'
import i18n from './HttpCredentialStep.i18n'
import css from './HttpCredentialStep.module.scss'

interface HttpCredentialStepProps {
  name: string
  setFormData: (formData: GITFormData | undefined) => void
  formData: GITFormData | undefined
  projectIdentifier: string
  orgIdentifier: string
  // not able to add StepPorps as
  nextStep?: () => void
  accountId: string
  hideLightModal: () => void
}

interface HttpCredentialStepState {
  authType: SelectOption
  setAuthType: (val: SelectOption) => void
  showCreateSecretModal: boolean
  setShowCreateSecretModal: (val: boolean) => void
}
const CustomSelect = Select.ofType<SelectOption>()

// type showing as incompatible for property "type" in data with BE
const createConnectorByType = async (
  createConnector: (data: ConnectorRequestDTORequestBody) => Promise<any>,
  data: any
): Promise<void> => {
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

interface CredentialFormData extends GITFormData {
  passwordSecret?: InlineSecret
}

const HttpCredentialStep: React.FC<HttpCredentialStepProps> = props => {
  const { accountId } = useParams()
  const [authType, setAuthType] = useState({
    label: 'Username and Password',
    value: 'UsernamePassword'
  } as SelectOption)

  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const state: HttpCredentialStepState = {
    authType,
    setAuthType,
    showCreateSecretModal,
    setShowCreateSecretModal
  }

  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: createSecret } = useCreateSecretText({})

  return (
    <>
      <div className={css.credStep}>
        <Text
          font="medium"
          margin={{ top: 'var(--spacing-small)', left: 'var(--spacing-small)' }}
          color="var(--grey-800)"
        >
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
            createSecret({
              accountIdentifier: accountId,
              identifier: formData.passwordSecret?.secretId,
              name: formData.passwordSecret?.secretName,
              secretManagerIdentifier: formData.passwordSecret?.secretManager?.value as string
            }).then(() => {
              createConnectorByType(createConnector, data)
            })
          }}
        >
          {(formikProps: FormikProps<CredentialFormData>) => (
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
                  <div className={css.authFields}>
                    <ConnectorFormFields
                      orgIdentifier={props.orgIdentifier}
                      projectIdentifier={props.projectIdentifier}
                      accountId={accountId}
                      formikProps={formikProps}
                      authType={authType?.value}
                      onClickCreateSecret={() => state.setShowCreateSecretModal(true)}
                    />
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
      {showCreateSecretModal ? <CreateSecretOverlay setShowCreateSecretModal={setShowCreateSecretModal} /> : null}
    </>
  )
}

export default HttpCredentialStep
