import React, { useState } from 'react'
import { StepWizard, Layout, Button, Text, CardSelect, FormInput, Formik, Icon } from '@wings-software/uikit'
import { Form } from 'formik'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import {
  authOptions,
  getCustomFields,
  DelegateTypes,
  DelegateInClusterType,
  getIconsForCard
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import i18n from './CreateK8sConnector.i18n'
import css from './CreateK8sConnector.module.scss'
import cx from 'classnames'
import * as Yup from 'yup'
import type { KubFormData } from 'modules/dx/interfaces/ConnectorInterface'
import { useGetKubernetesDelegateNames, RestResponseListString } from 'services/portal'
import { useCreateConnector, ConnectorRequestDTORequestBody } from 'services/cd-ng'
import { buildKubPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import InstallDelegateForm from 'modules/dx/common/InstallDelegateForm/InstallDelegateForm'
import VerifyInstalledDelegate from 'modules/dx/common/VerifyInstalledDelegate/VerifyInstalledDelegate'
import { useListSecretManagers, SecretManagerConfigDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'

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
  formData?: KubFormData
  hideLightModal?: () => void
}
interface IntermediateStepProps {
  name: string
  state: CreateK8sConnectorState
  accountId: string
  previousStep?: () => void
  nextStep?: () => void
  formData?: KubFormData
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
  formData: KubFormData | undefined
  setFormData: (data: KubFormData | undefined) => void
  inclusterDelegate: string
  setInClusterDelegate: (type: string) => void
  authentication: string
  setAuthentication: (type: string) => void
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
        name="inheritConfigFromDelegate"
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
          inheritConfigFromDelegate: Yup.string().trim().required('Delegate Name is required')
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
  const { data: secretManagersApiResponse } = useListSecretManagers({
    queryParams: { accountIdentifier: accountId }
  })
  // const accountIdentifier = accountId
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })

  return (
    <div className={css.intermediateStep}>
      <Text font="medium" className={css.headingIntermediate}>
        {i18n.STEP_INTERMEDIATE.HEADING}
      </Text>
      <Formik
        initialValues={{
          masterUrl: props.formData?.masterUrl || '',
          authType: props.formData?.authType || '',
          username: props.formData?.username || '',
          password: props.formData?.password || ''
        }}
        onSubmit={formData => {
          const connectorData = { ...state.formData, ...formData }

          const data = buildKubPayload(connectorData)

          createConnectorByType(createConnector, data)
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
                  <FormInput.Select
                    name="authType"
                    items={authOptions}
                    className={css.selectAuth}
                    onChange={val => {
                      if (typeof val.value === 'string') {
                        props.state.setAuthentication(val?.value)
                      }
                    }}
                  />
                </Layout.Horizontal>
                {/* Forcing  SecretManagerConfigDTO[] type untill secrets integration is done */}
                {getCustomFields(
                  props.state.authentication,
                  secretManagersApiResponse?.data as SecretManagerConfigDTO[],
                  state.formData?.name,
                  formikProps
                )}
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

// Todo: const getStepOne = (state: ThirdStepState) => {
//   if (state.currentStatus > 1) {
//     return `${state.delegateCount?.resource?.delegates?.length} delegates found`
//   } else {
//     return i18n.STEP_THREE.STEPS.ONE
//   }
// }
// ToDo: Will move this to seperate module with service integrations
// const ThirdStep = (props: ThirdStepProps) => {
//   const [currentStatus, setCurrentStatus] = React.useState(1)
//   const [currentIntent, setCurrentIntent] = React.useState<Intent>()
//   const [delegateCount, setDelegateCount] = React.useState()
//   const [validateError, setValidateError] = useState()
//   const state: ThiirdStepState = {
//     delegateCount,
//     setDelegateCount,
//     currentStatus,
//     setCurrentStatus,
//     currentIntent,
//     setCurrentIntent,
//     validateError,
//     setValidateError
//   }

//   React.useEffect(() => {
//     if (currentStatus === 1) {
//       // checkingDelegate(state, props.accountId)
//     } else if (currentStatus === 3) {
//       // Todo: const data = buildKubPayload(props.state.formData)
//       // validateCreds(data, state)
//     } else if (currentStatus > 1 && currentStatus < 5) {
//       const interval = setInterval(() => setCurrentStatus(currentStatus + 1), 5000)
//       return () => {
//         clearInterval(interval)
//       }
//     }
//   }, [currentStatus])
//   return (
//     <Layout.Vertical padding="small" style={{ height: '100%' }}>
//       <Text font="medium" padding="small" style={{ color: 'var(--grey-700)', padding: 0 }}>
//         Verify Connection to <span style={{ fontWeight: 700 }}>{props?.prevStepData?.connectorname}</span>
//       </Text>
//       <StepsProgress
//         steps={[getStepOne(state), i18n.STEP_THREE.STEPS.TWO, i18n.STEP_THREE.STEPS.THREE]}
//         intent={currentIntent}
//         current={currentStatus}
//         currentStatus={'PROCESS'}
//       />
//       {currentStatus === 3 && (
//         <Text font="small" style={{ color: 'var(--grey-400)', padding: 0, width: 300 }}>
//           {i18n.STEP_THREE.VERIFICATION_TIME_TEXT}
//         </Text>
//       )}
//       {state.validateError?.responseMessages[0]?.message && (
//         <Text font="small" style={{ color: 'red', padding: 10, width: '95%', margin: 10 }}>
//           {state.validateError}
//         </Text>
//       )}

//       <Layout.Horizontal spacing="large" style={{ marginTop: '300px' }}>
//         <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
//         <Button type="submit" onClick={() => props.hideLightModal} style={{ color: 'var(--blue-500)' }} text="Close" />
//       </Layout.Horizontal>
//     </Layout.Vertical>
//   )
// }

const CreateK8sConnector = (props: CreateK8sConnectorProps) => {
  // const [, setSecondStepName] = React.useState(DelegateTypes.DELEGATE_IN_CLUSTER)
  const [delegateType, setDelegateType] = useState('')
  const [formData, setFormData] = useState<KubFormData | undefined>()
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const [authentication, setAuthentication] = useState('')
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
        {delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
          <VerifyOutOfClusterDelegate name={i18n.STEP_THREE.NAME} {...props} connectorName={formData?.name} />
        ) : (
          <VerifyInstalledDelegate accountId={props.accountId} name={i18n.STEP_THREE.NAME} />
        )}
      </StepWizard>
      <Button text="close" />
    </>
  )
}

export default CreateK8sConnector
