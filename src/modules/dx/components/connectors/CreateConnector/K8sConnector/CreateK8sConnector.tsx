import React, { useState } from 'react'
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
  SelectOption
} from '@wings-software/uikit'
import { Form } from 'formik'
import cx from 'classnames'
import * as Yup from 'yup'
import {
  authOptions,
  DelegateTypes,
  DelegateInClusterType,
  getIconsForCard,
  AuthTypes,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useGetKubernetesDelegateNames, RestResponseListString } from 'services/portal'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  ConnectorConfigDTO,
  useUpdateConnector,
  usePostSecretText,
  EncryptedDataDTO
} from 'services/cd-ng'
import { buildKubPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import InstallDelegateForm from 'modules/dx/common/InstallDelegateForm/InstallDelegateForm'
import VerifyInstalledDelegate from 'modules/dx/common/VerifyInstalledDelegate/VerifyInstalledDelegate'
import VerifyExistingDelegate from 'modules/dx/common/VerfiyExistingDelegate/VerifyExistingDelegate'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import { useToaster } from 'modules/common/exports'
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
  reloadDelegateList: () => Promise<unknown>,
  state: any,
  props: SecondStepProps
) => {
  return (
    <div className={css.incluster}>
      <Text className={css.howToProceed}>{i18n.STEP_TWO.HOW_TO_PROCEED}</Text>
      <div
        className={css.radioOption}
        onClick={() => {
          reloadDelegateList()
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
  const { showError } = useToaster()
  const { data: delegateList, refetch: reloadDelegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId },
    lazy: true
  })
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const handleCreate = async (data: ConnectorRequestDTORequestBody) => {
    try {
      await createConnector(data)
      props.nextStep?.()
    } catch (e) {
      showError(e.message)
    }
  }
  const radioProps = {
    data: secondStepData,
    className: css.customCss,
    renderItem: function renderItem(item: FirstData) {
      return (
        <div className={cx({ [css.selectedCard]: item.type === state.delegateType })}>
          <Layout.Horizontal>
            <div className={cx(css.itemName, { [css.selectedText]: item.type === state.delegateType })}>
              {item.value}
              {getIconsForCard(item.type, item.type === state.delegateType)}
            </div>
            {item.type === state.delegateType ? (
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
    }
  }

  return (
    <Layout.Vertical spacing="medium" className={css.secondStep}>
      <Text font="medium" className={css.headingStepTwo}>
        {i18n.STEP_TWO.HEADING}
      </Text>
      <Formik
        initialValues={{
          delegateType: props?.formData?.delegateType || '',
          delegateName: props?.formData?.delegateName || ''
        }}
        validationSchema={Yup.object().shape({
          delegateType: Yup.string().trim().required(),
          delegateName: Yup.string().trim()
        })}
        onSubmit={formData => {
          const connectorData = { ...state.formData, ...formData }
          state.setFormData(connectorData)
          if (state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER) {
            const data = buildKubPayload(connectorData)
            handleCreate(data)
          }

          props.nextStep?.()
        }}
      >
        {formikProps => (
          <Form>
            <div className={css.delegateWrapper}>
              <CardSelect
                onChange={(item: FirstData) => {
                  state?.setDelegateType(item.type)
                  formikProps?.setFieldValue('delegateType', item.type)
                }}
                {...radioProps}
                selected={undefined}
              />
              {state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER
                ? renderDelegateInclusterForm(delegateList, reloadDelegateList, state, props)
                : null}
            </div>

            <Layout.Horizontal spacing="large" margin={{ top: 'large' }}>
              <Button onClick={() => props.previousStep?.()} text="Back" />
              {state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                <Button type="submit" text="Continue" />
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

const IntermediateStep: React.FC<IntermediateStepProps> = props => {
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)

  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const { state, accountId } = props
  const { showError } = useToaster()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })
  const { mutate: createSecret } = usePostSecretText({})

  // BE type need to be fixed
  const handleCreate = async (data: ConnectorRequestDTORequestBody) => {
    try {
      await createConnector(data)
      props.nextStep?.()
    } catch (e) {
      showError(e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestDTORequestBody) => {
    try {
      await updateConnector(data)
      props.nextStep?.()
    } catch (error) {
      showError(error.message)
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
            authType: '',
            username: '',
            oidcIssuerUrl: '',
            oidcUsername: '',
            oidcScopes: '',
            clientKeyAlgo: '',
            ...props.formData
          }}
          onSubmit={formData => {
            const connectorData = { ...state.formData, ...formData, authType: state.authentication?.value }
            const data = buildKubPayload(connectorData)
            const passwordFields = getSecretFieldsByType(state.authentication?.value as string) || []
            const nonRefrencedFields = passwordFields
              .map((item: SecretFieldByType) => {
                if (!formData[item.passwordField]?.isReference) {
                  return item
                }
              })
              .filter(item => {
                if (item !== undefined) {
                  return item
                }
              })
            if (state.isEditMode) {
              handleUpdate(data)
            } else {
              if (nonRefrencedFields.length) {
                Promise.all(
                  passwordFields.map((item: SecretFieldByType) => {
                    return createSecret({
                      account: accountId,
                      org: props.orgIdentifier,
                      project: props.projectIdentifier,
                      identifier: formData[item.secretField]?.secretId,
                      name: formData[item.secretField]?.secretName,
                      secretManager: formData[item.secretField]?.secretManager?.value as string,
                      value: formData[item.passwordField].value,
                      type: 'SecretText',
                      valueType: 'Inline'
                    })
                  })
                ).then(() => {
                  if (state.isEditMode) {
                    handleUpdate(data)
                  } else {
                    handleCreate(data)
                  }
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
                      }}
                      className={css.selectAuth}
                    >
                      <Button text={props.state.authentication?.label} rightIcon="chevron-down" minimal />
                    </SelectV2>
                  </Layout.Horizontal>
                  <ConnectorFormFields
                    isEditMode={state.isEditMode}
                    accountId={props.accountId}
                    orgIdentifier={props.orgIdentifier}
                    projectIdentifier={props.projectIdentifier}
                    formikProps={formikProps}
                    authType={props.state.authentication?.value}
                    name={state.formData?.name}
                    onClickCreateSecret={() => setShowCreateSecretModal(true)}
                    onEditSecret={val => {
                      setShowCreateSecretModal(true)
                      setEditSecretData(val)
                    }}
                  />
                </div>
                <Layout.Horizontal spacing="large" style={{ marginBottom: '30px' }}>
                  <Button onClick={() => props.previousStep?.()} text="Back" />
                  <Button
                    type="submit"
                    style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
                    text="Continue"
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
  const [delegateType, setDelegateType] = useState('')
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const [inclusterDelegate, setInClusterDelegate] = useState('')
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
            />
          ) : (
            <VerifyExistingDelegate
              accountId={props.accountId}
              orgIdentifier={props.orgIdentifier}
              projectIdentifier={props.projectIdentifier}
              name={i18n.STEP_THREE.NAME}
              connectorName={formData?.name}
              connectorIdentifier={formData?.identifier}
              delegateName={formData?.delegateName}
              hideLightModal={props.hideLightModal}
              renderInModal={true}
              onSuccess={props.onSuccess}
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
          />
        )}
      </StepWizard>
      <Button text="close" />
    </>
  )
}

export default CreateK8sConnector
