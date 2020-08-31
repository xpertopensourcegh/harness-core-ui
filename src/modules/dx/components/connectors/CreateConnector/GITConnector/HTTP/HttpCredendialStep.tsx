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
import { buildGITPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  usePostSecretText,
  EncryptedDataDTO,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorDTO
} from 'services/cd-ng'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import {
  AuthTypeFields,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { AuthTypes, getLabelForAuthType } from 'modules/dx/pages/connectors/utils/ConnectorHelper'
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
  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()

  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })
  const { mutate: createSecret } = usePostSecretText({})

  const handleCreate = async (data: ConnectorRequestDTORequestBody) => {
    try {
      await createConnector(data)
      props.nextStep?.()
    } catch (e) {
      modalErrorHandler?.showDanger(e?.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestDTORequestBody) => {
    try {
      await updateConnector(data)
      props.nextStep?.()
    } catch (error) {
      modalErrorHandler?.showDanger(error?.message)
    }
  }

  const createSecretCallback = async (formData: ConnectorConfigDTO, data: ConnectorDTO) => {
    let res
    try {
      modalErrorHandler?.hide()
      res = await createSecret({
        account: props.accountId,
        org: props.orgIdentifier,
        project: props.projectIdentifier,
        identifier: formData.passwordRefSecret?.secretId,
        name: formData.passwordRefSecret?.secretName,
        secretManager: formData.passwordRefSecret?.secretManager?.value as string,
        value: formData.passwordRef.name,
        type: 'SecretText',
        valueType: 'Inline'
      })
    } catch (e) {
      modalErrorHandler?.showDanger(e?.message)
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
            authType: props.formData?.authType || '',
            username: props.formData?.username || '',
            branchName: props.formData?.branchName || '',
            ...props.formData,
            passwordRef: { name: '', isReference: false },
            passwordRefSecret: {
              secretId: '',
              secretName: '',
              secretManager: { value: '' } as SelectOption
            }
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().trim().required('Username is required')
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
                if (!connectorData.passwordRef?.isReference) {
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
                  name={props.formData?.identifier}
                  isEditMode={props.isEditMode}
                  accountId={props.accountId}
                  orgIdentifier={props.orgIdentifier}
                  projectIdentifier={props.projectIdentifier}
                  formikProps={formikProps}
                  passwordField={AuthTypeFields.passwordRef}
                  onClickCreateSecret={() => setShowCreateSecretModal(true)}
                  onEditSecret={val => {
                    setShowCreateSecretModal(true)
                    setEditSecretData(val)
                  }}
                />
                <FormInput.Text name="branchName" label={i18n.BranchName} className={css.branchName} />
                <Layout.Horizontal spacing="large" className={css.footer}>
                  <Button type="submit" className={css.saveBtn} text={i18n.SAVE_CREDENTIALS_AND_CONTINUE} />
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
