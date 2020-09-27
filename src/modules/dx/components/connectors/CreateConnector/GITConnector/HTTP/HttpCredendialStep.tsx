import React, { useState } from 'react'
import {
  Layout,
  Button,
  Formik,
  FormInput,
  Text,
  SelectOption,
  Icon,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  FormikForm as Form,
  SelectV2
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { useToaster } from 'modules/common/exports'
import { buildGITPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import {
  useCreateConnector,
  usePostSecret,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorRequestWrapper,
  SecretDTOV2
} from 'services/cd-ng'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import {
  AuthTypeFields,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { AuthTypes, getLabelForAuthType } from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import type { SecretInfo } from 'modules/dx/components/SecretInput/SecretTextInput'
import UsernamePassword from '../../../ConnectorFormFields/UsernamePassword'
import i18n from './HttpCredentialStep.i18n'
import css from './HttpCredentialStep.module.scss'

interface HttpCredentialStepProps {
  name: string
  setFormData: (formData: ConnectorConfigDTO) => void
  formData?: ConnectorConfigDTO
  projectIdentifier: string
  orgIdentifier: string
  nextStep?: () => void
  previousStep?: (data?: ConnectorConfigDTO) => void
  accountId: string
  hideLightModal: () => void
  isEditMode: boolean
}

const HttpCredentialStep: React.FC<HttpCredentialStepProps> = props => {
  const { accountId } = useParams()
  const [authType, setAuthType] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)

  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<SecretDTOV2>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { showSuccess } = useToaster()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })
  const { mutate: createSecret } = usePostSecret({ queryParams: { accountIdentifier: accountId } })
  const [loadSecret, setLoadSecret] = useState(false)
  const [loadConnector, setLoadConnector] = useState(false)

  const handleCreate = async (data: ConnectorRequestWrapper) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.formData?.name}' created successfully`)
      props.nextStep?.()
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestWrapper) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.formData?.name}' updated successfully`)
      props.nextStep?.()
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error?.message)
    }
  }

  const createSecretCallback = async (formData: ConnectorConfigDTO, data: ConnectorRequestWrapper) => {
    let res
    try {
      modalErrorHandler?.hide()
      setLoadSecret(true)
      res = await createSecret({
        secret: {
          type: 'SecretText',
          orgIdentifier: props.orgIdentifier,
          projectIdentifier: props.projectIdentifier,
          identifier: formData.passwordRefSecret?.secretId,
          name: formData.passwordRefSecret?.secretName,
          tags: {},
          spec: {
            value: formData.passwordRef.value,
            valueType: 'Inline',
            secretManagerIdentifier: formData.passwordRefSecret?.secretManager?.value as string
          }
        } as SecretDTOV2
      })

      setLoadSecret(false)
    } catch (e) {
      setLoadSecret(false)
      modalErrorHandler?.showDanger(e?.data?.message || e?.message)
    }

    if (res && res.status === 'SUCCESS' && res.data) {
      if (props.isEditMode) {
        handleUpdate(data)
      } else {
        handleCreate(data)
      }
    }
  }
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
            authType: props.formData?.authType || authType.value,
            username: props.formData?.username || '',
            branchName: props.formData?.branchName || '',
            ...props.formData,
            passwordRef: undefined
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().trim().required(i18n.validation.username),
            passwordRef: Yup.string().when('authType', {
              is: AuthTypes.USER_PASSWORD,
              then: Yup.string().trim().required(i18n.validation.passwordRef)
            })
          })}
          onSubmit={formData => {
            const connectorData = {
              ...formData,
              ...props.formData,
              authType: authType?.value,
              projectIdentifier: props.projectIdentifier,
              orgIdentifier: props.orgIdentifier
            }
            const data = buildGITPayload(connectorData)

            const passwordFields = getSecretFieldsByType('UsernamePassword') || []
            const nonReferencedFields = passwordFields
              .map((item: SecretFieldByType) => {
                if (!((connectorData.passwordRef as unknown) as SecretInfo)?.isReference) {
                  return item
                }
              })
              .filter(item => {
                if (item !== undefined) {
                  return item
                }
              })
            if (props.isEditMode) {
              handleUpdate(data)
            } else {
              if (nonReferencedFields.length) {
                createSecretCallback(formData, data)
              } else {
                handleCreate(data)
              }
            }
            props.setFormData(connectorData)
          }}
        >
          {formikProps => (
            <div className={css.formWrapper}>
              <Form className={css.credForm}>
                <ModalErrorHandler bind={setModalErrorHandler} />
                <Layout.Vertical style={{ minHeight: '440px' }}>
                  <Layout.Horizontal className={css.credWrapper}>
                    <div className={css.label}>
                      <Icon name="lock" size={14} className={css.lockIcon} />
                      {i18n.Authentication}
                    </div>

                    <SelectV2
                      items={[
                        { label: getLabelForAuthType(AuthTypes.USER_PASSWORD), value: AuthTypes.USER_PASSWORD }
                        //ToDo: { label: 'Kerberos', value: 'Kerberos' }
                      ]}
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
                    formik={formikProps}
                    name={props.formData?.identifier}
                    isEditMode={props.isEditMode}
                    accountId={props.accountId}
                    orgIdentifier={props.orgIdentifier}
                    projectIdentifier={props.projectIdentifier}
                    passwordField={AuthTypeFields.passwordRef}
                    onClickCreateSecret={() => setShowCreateSecretModal(true)}
                    onEditSecret={val => {
                      setShowCreateSecretModal(true)
                      setEditSecretData(val)
                    }}
                  />
                  <FormInput.Text name="branchName" label={i18n.BranchName} className={css.branchName} />
                </Layout.Vertical>
                <Layout.Horizontal spacing="large" className={css.footer}>
                  <Button
                    onClick={() => props.previousStep?.({ ...props.formData })}
                    text={i18n.BACK}
                    font={{ size: 'small' }}
                  />
                  <Button
                    type="submit"
                    className={css.saveBtn}
                    text={i18n.SAVE_CREDENTIALS_AND_CONTINUE}
                    disabled={loadSecret || loadConnector}
                  />
                </Layout.Horizontal>
              </Form>
            </div>
          )}
        </Formik>
      </div>
      {showCreateSecretModal ? (
        <CreateSecretOverlay editSecretData={editSecretData} setShowCreateSecretModal={setShowCreateSecretModal} />
      ) : null}
    </>
  )
}

export default HttpCredentialStep
