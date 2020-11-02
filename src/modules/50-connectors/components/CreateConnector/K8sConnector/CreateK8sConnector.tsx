import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  StepWizard,
  Layout,
  Button,
  Text,
  CardSelect,
  FormInput,
  Formik,
  Icon,
  SelectV2,
  SelectOption,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import { Form } from 'formik'
import cx from 'classnames'
import * as Yup from 'yup'
import { useToaster } from '@common/exports'
import {
  authOptions,
  DelegateInClusterType,
  getIconsForCard,
  getSecretFieldsByType,
  SecretFieldByType
} from '@connectors/pages/connectors/Forms/KubeFormHelper'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useGetKubernetesDelegateNames, RestResponseListString } from 'services/portal'
import {
  useCreateConnector,
  ConnectorConfigDTO,
  useUpdateConnector,
  ConnectorRequestBody,
  SecretDTOV2,
  usePostSecret
} from 'services/cd-ng'
import { buildKubPayload } from '@connectors/pages/connectors/utils/ConnectorUtils'
import InstallDelegateForm from '@connectors/common/InstallDelegateForm/InstallDelegateForm'
import VerifyInstalledDelegate from '@connectors/common/VerifyInstalledDelegate/VerifyInstalledDelegate'
import VerifyExistingDelegate from '@connectors/common/VerifyExistingDelegate/VerifyExistingDelegate'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import CreateSecretOverlay from '@secrets/components/CreateSecretOverlay/CreateSecretOverlay'
import { Connectors } from '@connectors/constants'
import { DelegateTypes, AuthTypes } from '@connectors/pages/connectors/Forms/KubeFormInterfaces'
import ConnectorFormFields from '../../ConnectorFormFields/ConnectorFormFields'
import i18n from './CreateK8sConnector.i18n'
import css from './CreateK8sConnector.module.scss'

const DelegateTypesText = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER
}

const DelegateInfoText = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER_INFO,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER_INFO
}
interface StepProps<PrevStepData> {
  name?: string
  // These props will be passed by wizard
  prevStepData?: PrevStepData
  currentStep?: () => number
  totalSteps?: () => number
  nextStep?: (data?: PrevStepData) => void
  previousStep?: (data?: PrevStepData) => void
  gotoStep?: (stepNumber: number, data?: PrevStepData) => void
  firstStep?: (data?: PrevStepData) => void
  lastStep?: (data?: PrevStepData) => void
}

interface StepChangeData<SharedObject> {
  prevStep?: number
  nextStep?: number
  prevStepData: SharedObject
}
export interface StepWizardProps<SharedObject> {
  children: Array<React.ReactElement<StepProps<SharedObject>>>
  isNavMode?: boolean
  className?: string
  onStepChange?: (data: StepChangeData<SharedObject | undefined>) => void
  onCompleteWizard?: (data: SharedObject | undefined) => void // This will be called when all step completed
  initialStep?: number
}

interface SecondStepProps {
  name: string
  accountId: string
  state: CreateK8sConnectorState
  previousStep?: () => void
  nextStep?: () => void
  formData?: ConnectorConfigDTO
  hideLightModal?: () => void
  onSuccess: () => void
}
interface IntermediateStepProps {
  name: string
  state: CreateK8sConnectorState
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  previousStep?: () => void
  nextStep?: () => void
  formData?: ConnectorConfigDTO
  onSuccess: () => void
}

interface FirstData {
  type: string
  value: string
  info: string
}
const secondStepData: FirstData[] = [
  {
    type: DelegateTypes.DELEGATE_IN_CLUSTER,
    value: DelegateTypesText.DELEGATE_IN_CLUSTER,
    info: DelegateInfoText.DELEGATE_IN_CLUSTER
  },
  {
    type: DelegateTypes.DELEGATE_OUT_CLUSTER,
    value: DelegateTypesText.DELEGATE_OUT_CLUSTER,
    info: DelegateInfoText.DELEGATE_OUT_CLUSTER
  }
]

interface CreateK8sConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
  onSuccess: () => void
}
interface CreateK8sConnectorState {
  delegateType: string
  setDelegateType: (type: string) => void
  formData: ConnectorConfigDTO | undefined
  setFormData: (data: ConnectorConfigDTO | undefined) => void
  inclusterDelegate: string
  setInClusterDelegate: (type: string) => void
  authentication: SelectOption
  setAuthentication: (type: SelectOption) => void
  delegateList: RestResponseListString | null
  setDelegateList: (list: RestResponseListString | null) => void
  installDelegate: boolean
  setInstallDelegate: (val: boolean) => void
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
}

const formatDelegateList = (listData: string[] | undefined) => {
  return listData?.map((item: string) => {
    return { label: item || '', value: item || '' }
  })
}

const selectExistingDelegate = (delegateList: RestResponseListString | null) => {
  const listData = delegateList?.resource
  const delegateListFiltered = formatDelegateList(listData) || [{ label: '', value: '' }]
  return (
    <>
      <FormInput.Select
        name="delegateName"
        label="Select Delegate"
        className={css.selectDelegate}
        items={delegateListFiltered}
      />
    </>
  )
}

const addToFormData = (state: CreateK8sConnectorState, newFormData: any) => {
  const connectorData = { ...state.formData, ...newFormData }
  if (connectorData.delegateName) {
    delete connectorData.delegateName
  }
  state.setFormData(connectorData)
}

const renderDelegateInclusterForm = (
  delegateList: RestResponseListString | null,
  state: any,
  props: SecondStepProps
) => {
  return (
    <div className={css.incluster}>
      <Text className={css.howToProceed}>{i18n.STEP_TWO.HOW_TO_PROCEED}</Text>
      <div
        className={css.radioOption}
        onClick={() => {
          state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
          state.setInstallDelegate(false)

          state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.useExistingDelegate} />
        <span className={css.label}>Use an existing Delegate</span>
      </div>
      {state.inclusterDelegate === DelegateInClusterType.useExistingDelegate
        ? selectExistingDelegate(delegateList)
        : null}
      <div
        className={css.radioOption}
        onClick={() => {
          state.setInstallDelegate(true)
          state.setInClusterDelegate(DelegateInClusterType.addNewDelegate)
          state.setInClusterDelegate(DelegateInClusterType.addNewDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.addNewDelegate} />
        <span className={css.label}>Add a new Delegate to this Cluster</span>
      </div>
      {state.inclusterDelegate === DelegateInClusterType.addNewDelegate ? (
        <InstallDelegateForm accountId={props.accountId} />
      ) : null}
    </div>
  )
}

const SecondStep = (props: SecondStepProps) => {
  const { state, accountId } = props
  const { projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const { data: delegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId }
  })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const handleCreate = async (data: ConnectorRequestBody) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      props.onSuccess?.()
      showSuccess(`Connector '${props.formData?.name}' created successfully`)
      props.nextStep?.()
    } catch (e) {
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.formData?.name}' updated successfully`)
      props.nextStep?.()
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  return (
    <Layout.Vertical spacing="medium" className={css.secondStep}>
      <Text font="medium" className={css.headingStepTwo}>
        {i18n.STEP_TWO.HEADING}
      </Text>
      <Formik
        initialValues={{
          delegateType: props?.formData?.delegateType || DelegateTypes.DELEGATE_IN_CLUSTER,
          delegateName: props?.formData?.delegateName || '',
          profile: props?.formData?.profile || ''
        }}
        validationSchema={Yup.object().shape({
          delegateName: Yup.string().when('delegateType', {
            is: DelegateTypes.DELEGATE_IN_CLUSTER,
            then: Yup.string()
              .trim()
              .required(
                state.inclusterDelegate === DelegateInClusterType.useExistingDelegate
                  ? i18n.STEP_TWO.validation.delegate
                  : i18n.STEP_TWO.validation.delegateName
              )
          })
        })}
        onSubmit={formData => {
          const connectorData = {
            ...state.formData,
            ...formData,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }
          state.setFormData(connectorData)
          if (state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER) {
            const data = {
              ...buildKubPayload(connectorData)
            }
            if (state.isEditMode) {
              handleUpdate(data)
            } else {
              handleCreate(data)
            }
          }
        }}
      >
        {formikProps => (
          <Form>
            <div className={css.delegateWrapper}>
              <ModalErrorHandler bind={setModalErrorHandler} style={{ marginBottom: 'var(--spacing-medium)' }} />
              <CardSelect
                onChange={(item: FirstData) => {
                  state?.setDelegateType(item.type)
                  formikProps?.setFieldValue('delegateType', item.type)
                }}
                data={secondStepData}
                className={css.customCss}
                renderItem={function renderItem(item: FirstData) {
                  return (
                    <div className={cx({ [css.selectedCard]: item.type === formikProps.values.delegateType })}>
                      <Layout.Horizontal>
                        <div
                          className={cx(css.itemName, {
                            [css.selectedText]: item.type === formikProps.values.delegateType
                          })}
                        >
                          {item.value}
                          {getIconsForCard(item.type, item.type === formikProps.values.delegateType)}
                        </div>
                        {item.type === formikProps.values.delegateType ? (
                          <Icon name="deployment-success-new" size={16} className={css.tickWrp} />
                        ) : null}
                      </Layout.Horizontal>
                      <div className={css.itemInfo}>
                        {item.type === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                          <div className={css.recommended}>{i18n.STEP_TWO.RECOMMENDED}</div>
                        ) : null}
                        <div className={css.textInfo}>{item.info}</div>
                      </div>
                    </div>
                  )
                }}
                selected={formikProps.values?.delegateType}
              />
              {formikProps.values.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER
                ? renderDelegateInclusterForm(delegateList, state, props)
                : null}
            </div>

            <Layout.Horizontal spacing="large" margin={{ top: 'medium' }}>
              <Button onClick={() => props.previousStep?.()} text="Back" />
              {formikProps.values.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                <Button type="submit" text="Continue" disabled={loadConnector} />
              ) : (
                <Button
                  text="Continue"
                  onClick={() => {
                    addToFormData(state, { delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER })
                    props.nextStep?.()
                  }}
                />
              )}
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export const IntermediateStep: React.FC<IntermediateStepProps> = props => {
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<SecretDTOV2>()
  const { showSuccess } = useToaster()
  const { state, accountId } = props
  const { projectIdentifier, orgIdentifier } = useParams()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: createSecret } = usePostSecret({ queryParams: { accountIdentifier: props.accountId } })
  const [loadSecret, setLoadSecret] = useState(false)
  const [loadConnector, setLoadConnector] = useState(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const handleCreate = async (data: ConnectorRequestBody) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      props.onSuccess?.()
      showSuccess(`Connector '${props.formData?.name}' created successfully`)
      props.nextStep?.()
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.formData?.name}' updated successfully`)
      props.nextStep?.()
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  return (
    <>
      <div className={css.intermediateStep}>
        <Text font="medium" className={css.headingIntermediate}>
          {i18n.STEP_INTERMEDIATE.HEADING}
        </Text>
        <Formik<ConnectorConfigDTO>
          initialValues={{
            masterUrl: '',
            authType: state.authentication?.value,
            username: '',
            oidcIssuerUrl: '',
            oidcUsername: '',
            oidcScopes: '',
            clientKeyAlgo: '',
            ...props.formData
          }}
          validationSchema={Yup.object().shape({
            masterUrl: Yup.string().required(i18n.STEP_INTERMEDIATE.validation.masterUrl),
            passwordRef: Yup.string().when('authType', {
              is: AuthTypes.USER_PASSWORD,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.passwordRef)
            }),
            username: Yup.string().when('authType', {
              is: AuthTypes.USER_PASSWORD,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.username)
            }),
            serviceAccountTokenRef: Yup.string().when('authType', {
              is: AuthTypes.SERVICE_ACCOUNT,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.serviceAccountTokenRef)
            }),
            oidcIssuerUrl: Yup.string().when('authType', {
              is: AuthTypes.OIDC,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.oidcIssueUrl)
            }),
            oidcUsername: Yup.string().when('authType', {
              is: AuthTypes.OIDC,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.username)
            }),
            oidcPasswordRef: Yup.string().when('authType', {
              is: AuthTypes.OIDC,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.oidcPasswordRef)
            }),
            oidcClientIdRef: Yup.string().when('authType', {
              is: AuthTypes.OIDC,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.oidcClientIdRef)
            }),
            clientCertRef: Yup.string().when('authType', {
              is: AuthTypes.CLIENT_KEY_CERT,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.clientCertRef)
            }),
            clientKeyRef: Yup.string().when('authType', {
              is: AuthTypes.CLIENT_KEY_CERT,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.clientKeyRef)
            }),
            clientKeyPassphraseRef: Yup.string().when('authType', {
              is: AuthTypes.CLIENT_KEY_CERT,
              then: Yup.string().trim().required(i18n.STEP_INTERMEDIATE.validation.clientKeyPassphraseRef)
            })
          })}
          onSubmit={formData => {
            modalErrorHandler?.hide()
            const connectorData = {
              ...state.formData,
              ...formData,
              authType: state.authentication?.value,
              projectIdentifier: projectIdentifier,
              orgIdentifier: orgIdentifier
            }
            const data = {
              ...buildKubPayload(connectorData)
            }
            const passwordFields = getSecretFieldsByType(state.authentication?.value as string) || []
            const nonRefrencedFields = passwordFields
              .map((item: SecretFieldByType) => {
                if (!formData[item.passwordField]?.isReference) {
                  return item
                }
              })
              .filter(item => {
                if (item !== undefined && formData[item.passwordField]) {
                  return item
                }
              })
            if (state.isEditMode) {
              handleUpdate(data)
            } else {
              if (nonRefrencedFields.length) {
                setLoadSecret(true)
                Promise.all(
                  (nonRefrencedFields as SecretFieldByType[])?.map((item: SecretFieldByType) => {
                    return createSecret({
                      secret: {
                        type: 'SecretText',
                        orgIdentifier: props.orgIdentifier,
                        projectIdentifier: props.projectIdentifier,
                        identifier: formData[item.secretField]?.secretId,
                        name: formData[item.secretField]?.secretName,
                        tags: {},
                        spec: {
                          value: formData[item.passwordField]?.value,
                          valueType: 'Inline',
                          secretManagerIdentifier: formData[item.secretField]?.secretManager?.value as string
                        }
                      } as SecretDTOV2
                    })
                  })
                )
                  .then(() => {
                    setLoadSecret(false)
                    if (state.isEditMode) {
                      handleUpdate(data)
                    } else {
                      handleCreate(data)
                    }
                  })
                  .catch(error => {
                    setLoadSecret(false)
                    modalErrorHandler?.showDanger(error?.data?.message || error?.message)
                  })
              } else {
                handleCreate(data)
              }
            }
            state.setFormData(connectorData)
          }}
        >
          {formikProps => (
            <div className={css.formWrapper}>
              <Form className={css.credForm}>
                <ModalErrorHandler bind={setModalErrorHandler} />
                <div className={css.formFields}>
                  <FormInput.Text label={i18n.STEP_INTERMEDIATE.masterUrl} name="masterUrl" />
                  <Layout.Horizontal className={css.credWrapper}>
                    <div className={css.label}>
                      <Icon name="lock" size={14} className={css.lockIcon} />
                      Credentials
                    </div>
                    <SelectV2
                      items={authOptions}
                      value={props.state.authentication}
                      filterable={false}
                      onChange={val => {
                        props.state.setAuthentication(val)
                        formikProps.setFieldValue('authType', val.value)
                      }}
                      className={css.selectAuth}
                    >
                      <Button text={props.state.authentication?.label} rightIcon="chevron-down" minimal />
                    </SelectV2>
                  </Layout.Horizontal>
                  <ConnectorFormFields
                    formik={formikProps}
                    isEditMode={state.isEditMode}
                    accountId={props.accountId}
                    orgIdentifier={props.orgIdentifier}
                    projectIdentifier={props.projectIdentifier}
                    authType={props.state.authentication?.value}
                    name={state.formData?.name}
                    onClickCreateSecret={() => setShowCreateSecretModal(true)}
                    onEditSecret={val => {
                      setShowCreateSecretModal(true)
                      setEditSecretData(val)
                    }}
                  />
                </div>
                <Layout.Horizontal spacing="large" margin={{ top: 'large' }}>
                  <Button onClick={() => props.previousStep?.()} text="Back" />
                  <Button
                    type="submit"
                    style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
                    text="Continue"
                    disabled={loadConnector || loadSecret}
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

const CreateK8sConnector = (props: CreateK8sConnectorProps) => {
  const [delegateType, setDelegateType] = useState(DelegateTypes.DELEGATE_IN_CLUSTER)
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const [inclusterDelegate, setInClusterDelegate] = useState(DelegateInClusterType.useExistingDelegate)
  const [authentication, setAuthentication] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)
  const [delegateList, setDelegateList] = useState({} as RestResponseListString | null)
  const [installDelegate, setInstallDelegate] = useState(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const state: CreateK8sConnectorState = {
    delegateType,
    setDelegateType,
    formData,
    setFormData,
    inclusterDelegate,
    setInClusterDelegate,
    authentication,
    setAuthentication,
    delegateList,
    setDelegateList,
    installDelegate,
    setInstallDelegate,
    isEditMode,
    setIsEditMode
  }
  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          type="K8sCluster"
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />
        <SecondStep name={i18n.STEP_TWO.NAME} state={state} {...props} formData={formData} />

        {delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
          <IntermediateStep
            {...props}
            name={i18n.STEP_INTERMEDIATE.NAME}
            state={state}
            formData={formData}
            onSuccess={props.onSuccess}
          />
        ) : null}
        {delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
          state.inclusterDelegate === DelegateInClusterType.addNewDelegate ? (
            <VerifyInstalledDelegate
              accountId={props.accountId}
              orgIdentifier={props.orgIdentifier}
              projectIdentifier={props.projectIdentifier}
              name={i18n.STEP_THREE.NAME}
              connectorName={formData?.name}
              connectorIdentifier={formData?.identifier}
              delegateName={formData?.delegateName}
              profile={formData?.profile}
              hideLightModal={props.hideLightModal}
              onSuccess={props.onSuccess}
            />
          ) : (
            <VerifyExistingDelegate
              name={i18n.STEP_THREE.NAME}
              connectorName={formData?.name}
              connectorIdentifier={formData?.identifier}
              delegateName={formData?.delegateName}
              hideLightModal={props.hideLightModal}
              renderInModal={true}
              onSuccess={props.onSuccess}
              setIsEditMode={() => setIsEditMode(true)}
            />
          )
        ) : (
          <VerifyOutOfClusterDelegate
            name={i18n.STEP_THREE.NAME}
            setIsEditMode={() => setIsEditMode(true)}
            {...props}
            connectorName={formData?.name}
            connectorIdentifier={formData?.identifier}
            renderInModal={true}
            isLastStep={true}
            type={Connectors.KUBERNETES_CLUSTER}
          />
        )}
      </StepWizard>
    </>
  )
}

export default CreateK8sConnector
