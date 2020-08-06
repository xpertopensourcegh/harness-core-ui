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
  getCustomFields,
  DelegateTypes,
  DelegateInClusterType,
  getIconsForCard,
  AuthTypes,
  getSecretFieldsByType,
  SceretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useGetKubernetesDelegateNames, RestResponseListString } from 'services/portal'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  ConnectorConfigDTO,
  useCreateSecretText
} from 'services/cd-ng'
import { buildKubPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import InstallDelegateForm from 'modules/dx/common/InstallDelegateForm/InstallDelegateForm'
import VerifyInstalledDelegate from 'modules/dx/common/VerifyInstalledDelegate/VerifyInstalledDelegate'
import VerifyExistingDelegate from 'modules/dx/common/VerfiyExistingDelegate/VerifyExistingDelegate'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
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
  previousStep?: () => void
  nextStep?: () => void
  formData?: ConnectorConfigDTO
}

// ToDo: interface ThirdStepState {
//   delegateCount: number
//   setDelegateCount: (val: number) => void
//   currentStatus: number
//   setCurrentStatus: (val: number) => void
//   currentIntent: Intent
//   setCurrentIntent: (val: Intent) => void
//   validateError: string
//   setValidateError: (val: string) => void
//   // downloadOverLay: boolean
//   // setDownloadOverlay: (val: boolean) => void
// }

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
  hideLightModal: () => void
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
}

const formatDelegateList = (listData: string[] | undefined) => {
  return listData?.map((item: string) => {
    return { label: item || '', value: item || '' }
  })
}

// have put any as type check was failing due to unknown reason
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
  if (connectorData.inheritConfigFromDelegate) {
    delete connectorData.inheritConfigFromDelegate
  }
  state.setFormData(connectorData)
}

const installNewDelegate = (accountId: string) => {
  return <InstallDelegateForm accountId={accountId} />
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
      {state.inclusterDelegate === DelegateInClusterType.addNewDelegate ? installNewDelegate(props.accountId) : null}
    </div>
  )
}
// ToDO: const getCardIcons = (type: string, state: CreateK8sConnectorState) => {
//   return (
//     <Layout.Horizontal>
//       <Icon name="harness" size={18} /> <hr /> <Icon name="grey-cluster" size={30} />{' '}
//     </Layout.Horizontal>
//   )
// }

const SecondStep = (props: SecondStepProps) => {
  const { state, accountId } = props
  const { loading, data: delegateList, refetch: reloadDelegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId },
    lazy: true
  })
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
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
    <Layout.Vertical spacing="xxlarge" className={css.secondStep}>
      <Text font="medium" className={css.headingStepTwo}>
        {i18n.STEP_TWO.HEADING}
      </Text>
      <Formik
        initialValues={{
          delegateType: props?.formData?.delegateType || '',
          inheritConfigFromDelegate: props?.formData?.inheritConfigFromDelegate || ''
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
            createConnectorByType(createConnector, data)
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
              {!loading && state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER
                ? renderDelegateInclusterForm(delegateList, reloadDelegateList, state, props)
                : null}
            </div>

            <Layout.Horizontal spacing="large" className={css.saveSecondStep}>
              <Button onClick={() => props.previousStep?.()} text="Back" />
              {state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                <Button type="submit" className={css.continueBtn} text="Continue" />
              ) : (
                <Button
                  type="submit"
                  className={css.continueBtn}
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
// type showing as incompatible for property "type" in data
const createConnectorByType = async (
  createConnector: (data: ConnectorRequestDTORequestBody) => Promise<any>,
  data: any
) => {
  const { loading, data: connectordetails } = await createConnector(data as ConnectorRequestDTORequestBody)
  if (!loading && connectordetails) {
    // todo:
    // state.setConnector(connector)
    // const formData = buildKubFormData(connector)
    // state.setConnector(formData)
  }
  //todo else
}

const IntermediateStep = (props: IntermediateStepProps) => {
  const { state, accountId } = props

  // const accountIdentifier = accountId
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: createSecret } = useCreateSecretText({})

  return (
    <div className={css.intermediateStep}>
      <Text font="medium" className={css.headingIntermediate}>
        {i18n.STEP_INTERMEDIATE.HEADING}
      </Text>
      <Formik
        initialValues={
          {
            masterUrl: props.formData?.masterUrl || '',
            authType: props.formData?.authType || '',
            username: props.formData?.username || '',
            passwordRef: props.formData?.passwordRef || '',
            serviceAccountTokenRef: props.formData?.serviceAccountTokenRef || '',
            oidcIssuerUrl: props.formData?.oidcIssuerUrl || '',
            oidcUsername: props.formData?.oidcUsername || '',
            oidcClientIdRef: props.formData?.oidcClientIdRef || '',
            oidcPasswordRef: props.formData?.oidcPasswordRef || '',
            oidcSecretRef: props.formData?.oidcSecretRef || '',
            oidcScopes: props.formData?.oidcScopes || '',
            clientCertRef: props.formData?.clientCertRef || '',
            clientKeyRef: props.formData?.clientKeyRef || '',
            clientKeyPassphraseRef: props.formData?.clientKeyPassphraseRef || '',
            clientKeyAlgo: props.formData?.clientKeyAlgo || ''

            // passwordRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // serviceAccountTokenRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // oidcClientIdRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // oidcPasswordRefSceret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // oidcSecretRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // clientKeyRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // clientKeyPassphraseRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption },
            // clientCertRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } as SelectOption }
          } as ConnectorConfigDTO
        }
        onSubmit={formData => {
          const connectorData = { ...state.formData, ...formData, authType: state.authentication?.value }
          const data = buildKubPayload(connectorData)
          const passwordFields = getSecretFieldsByType(state.authentication?.value as string) || []

          Promise.all(
            passwordFields.map((item: SceretFieldByType) => {
              return createSecret({
                accountIdentifier: accountId,
                identifier: formData[item.secretField]?.secretId,
                name: formData[item.secretField]?.secretName,
                secretManagerIdentifier: formData[item.secretField]?.secretManager?.value as string,
                value: formData[item.passwordField]
              })
            })
          ).then(() => {
            createConnectorByType(createConnector, data)
            // to do status check
          })
          state.setFormData(connectorData)
          props.nextStep?.()
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
                {getCustomFields(props.state.authentication?.value, state.formData?.name, formikProps)}
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
    setInstallDelegate
  }
  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          accountId={props.accountId}
          type="K8sCluster"
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />
        <SecondStep name={i18n.STEP_TWO.NAME} state={state} {...props} formData={formData} />

        {delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
          <IntermediateStep {...props} name={i18n.STEP_INTERMEDIATE.NAME} state={state} formData={formData} />
        ) : null}
        {/*Removing for now: {installDelegate ? <VerifyInstalledDelegate accountId={props.accountId} name={i18n.STEP_THREE.NAME} /> : null} */}
        {delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
          state.inclusterDelegate === DelegateInClusterType.addNewDelegate ? (
            <VerifyInstalledDelegate
              accountId={props.accountId}
              name={i18n.STEP_THREE.NAME}
              connectorName={formData?.name}
              connectorIdentifier={formData?.identifier}
              delegateName={formData?.delegateName}
            />
          ) : (
            <VerifyExistingDelegate
              accountId={props.accountId}
              name={i18n.STEP_THREE.NAME}
              connectorName={formData?.name}
              connectorIdentifier={formData?.identifier}
              delegateName={formData?.delegateName}
              hideLightModal={props.hideLightModal}
            />
          )
        ) : (
          <VerifyOutOfClusterDelegate
            name={i18n.STEP_THREE.NAME}
            {...props}
            connectorName={formData?.name}
            connectorIdentifier={formData?.identifier}
          />
        )}
      </StepWizard>
      <Button text="close" />
    </>
  )
}

export default CreateK8sConnector
