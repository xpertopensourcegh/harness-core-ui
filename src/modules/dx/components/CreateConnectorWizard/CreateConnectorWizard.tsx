import React, { useState } from 'react'
import {
  StepWizard,
  Layout,
  Button,
  Text,
  CardSelect,
  StepsProgress,
  Intent,
  FormInput,
  Formik,
  Icon
} from '@wings-software/uikit'
import css from './CreateConnectorWizard.module.scss'
import { Form } from 'formik'
import i18n from './CreateConnectorWizard.i18n'
import ConnectorDetailFields from 'modules/dx/pages/connectors/Forms/ConnectorDetailFields'
import { getHeadingByType } from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import {
  authOptions,
  getCustomFields,
  DelegateTypes,
  DelegateInClusterType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import * as Yup from 'yup'
import { illegalIdentifiers } from 'framework/utils/StringUtils'
import cx from 'classnames'
import { ConnectorService } from 'modules/dx/services'
import { buildKubPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import InstallDelegateForm from '../../common/InstallDelegateForm/InstallDelegateForm'
import VerifyInstalledDelegate from 'modules/dx/common/VerifyInstalledDelegate/VerifyInstalledDelegate'
import { useListSecretManagers } from 'services/cd-ng'

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
interface CreateConnectorWizardProps {
  accountId: string
}

export interface StepWizardProps<SharedObject> {
  children: Array<React.ReactElement<StepProps<SharedObject>>>
  isNavMode?: boolean
  className?: string
  onStepChange?: (data: StepChangeData<SharedObject | undefined>) => void
  onCompleteWizard?: (data: SharedObject | undefined) => void // This will be called when all step completed
  initialStep?: number
}

const DelegateTypesText = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER
}

const DelegateInfoText = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER_INFO,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER_INFO
}

interface FirstData {
  type: string
  value: string
  info: string
  icon: string
}

interface CreateConnectorWizardState {
  setSecondStepName: any
  delegateType: string
  setDelegateType: (type: string) => void
  formData: any
  setFormData: (data: any) => void
  inclusterDelegate: string
  setInClusterDelegate: (type: string) => void
  authentication: string
  setAuthentication: (type: string) => void
  delegateList: any
  setDelegateList: (list: any) => void
  installDelegate: boolean
  setInstallDelegate: (val: boolean) => void
}

const firstStepData: FirstData[] = [
  {
    type: DelegateTypes.DELEGATE_IN_CLUSTER,
    value: DelegateTypesText.DELEGATE_IN_CLUSTER,
    info: DelegateInfoText.DELEGATE_IN_CLUSTER,
    icon: 'blank'
  },
  {
    type: DelegateTypes.DELEGATE_OUT_CLUSTER,
    value: DelegateTypesText.DELEGATE_OUT_CLUSTER,
    info: DelegateInfoText.DELEGATE_OUT_CLUSTER,
    icon: 'blank'
  }
]

const createConnectorByType = async (data: any, props: CreateConnectorWizardProps) => {
  const xhrGroup = 'create-connector'
  const { accountId } = props
  const { error } = await ConnectorService.createConnector({ xhrGroup, connector: data, accountId })
  if (!error) {
    // todo:
    // state.setConnector(connector)
    // const formData = buildKubFormData(connector)
    // state.setConnector(formData)
  }
  //todo else
}

const validateCreds = async (data: any, state: any) => {
  const { validateStatus, error } = await ConnectorService.validateCredentials({ data })
  // const response  = await ConnectorService.validateCredentials({data})

  if (!error) {
    state.setCurrentStatus(4)
  } else {
    state.setCurrentIntent('DANGER')
    state.setCurrentStatus('DANGER')
    state.setValidateError(validateStatus)
  }
}

const fetchExistingDelegates = async (state: any, props: CreateConnectorWizardProps) => {
  const { accountId } = props
  const { delegateList, error } = await ConnectorService.fetchExistingDelegates({ accountId })
  if (!error) {
    state.setDelegateList(delegateList)
  }
}

const FirstStep = (props: any) => {
  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep}>
      <div className={css.heading}>{getHeadingByType('K8sCluster')}</div>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(illegalIdentifiers),
          description: Yup.string()
        })}
        onSubmit={formData => {
          props.nextStep({})
          props.setFormData(formData)
        }}
      >
        {() => (
          <Form className={css.connectorForm}>
            <ConnectorDetailFields />
            <Button type="submit" text={i18n.STEP_ONE.saveAndContinue} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

const selectExistingDelegate = () => {
  return (
    <>
      {/* <div className={css.selectDelegateText}>Select a Delegate</div> */}
      <FormInput.Select
        name="inheritConfigFromDelegate"
        label="Select Delegate"
        className={css.selectDelegate}
        items={[
          { label: 'Delegate_one', value: 'Delegate_one' },
          { label: 'Delegate_two', value: 'Delegate_two' }
        ]}
      />
    </>
  )
}

const installNewDelegate = (accountId: string) => {
  return <InstallDelegateForm accountId={accountId} />
}

const renderDelegateInclusterForm = (state: any, props: CreateConnectorWizardProps) => {
  return (
    <div className={css.incluster}>
      <Text className={css.howToProceed}>{i18n.STEP_TWO.HOW_TO_PROCEED}</Text>
      <div
        className={css.radioOption}
        onClick={() => {
          state.setInstallDelegate(false)

          fetchExistingDelegates(state, props)
          state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.useExistingDelegate} />
        <span className={css.label}>Use an existing Delegate</span>
      </div>
      {state.inclusterDelegate === DelegateInClusterType.useExistingDelegate ? selectExistingDelegate() : null}
      <div
        className={css.radioOption}
        onClick={() => {
          state.setInstallDelegate(true)
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

const addToFormData = (state: any, newFormData: any) => {
  const connectorData = { ...state.formData, ...newFormData }
  if (connectorData.inheritConfigFromDelegate) {
    delete connectorData.inheritConfigFromDelegate
  }
  state.setFormData(connectorData)
}

const SecondStep = (props: any) => {
  const selected = props.prevStepData && props.prevStepData.delegateType
  // const selected = props.prevStepData && props.prevStepData.delegateType
  const { state } = props
  const radioProps = {
    data: firstStepData,
    className: css.customCss,
    renderItem: function renderItem(item: any) {
      return (
        <div className={cx({ [css.selectedCard]: item.type === state.delegateType })}>
          {/* <Layout.Vertical spacing="medium" className={cx({ [css.selectedCard]: item.type === state.delegateType })}> */}
          <div className={cx(css.itemName, { [css.selectedText]: item.type === state.delegateType })}>
            {item.value}
            {/* {item.type === state.delegateType ? <Icon name="tick" size={12} /> : null} */}
          </div>
          <div className={css.itemInfo}>
            {item.type === DelegateTypes.DELEGATE_IN_CLUSTER ? (
              <div className={css.recommended}>RECOMMENDED</div>
            ) : null}
            <div className={css.textInfo}>{item.info}</div>
          </div>
        </div>
        // </Layout.Vertical>
      )
    }
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={css.secondStep}>
      <Text font="medium" className={css.headingStepTwo}>
        {i18n.STEP_TWO.HEADING}
      </Text>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({
          delegateType: Yup.string().trim().required(),
          inheritConfigFromDelegate: Yup.string().trim().required('Delegate Name is required')
        })}
        onSubmit={formData => {
          const connectorData = { ...state.formData, ...formData }

          if (state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER) {
            const data = buildKubPayload(connectorData)
            createConnectorByType(data, props)
          }

          state.setFormData(connectorData)
          props.nextStep({})
        }}
      >
        {formikProps => (
          <Form>
            <div className={css.delegateWrapper}>
              <CardSelect
                onChange={(item: any) => {
                  state?.setDelegateType(item.type)
                  formikProps?.setFieldValue('delegateType', item.type)
                }}
                {...radioProps}
                selected={selected && firstStepData.filter(data => data.value === selected)[0]}
              />
              {state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER
                ? renderDelegateInclusterForm(state, props)
                : null}
            </div>

            <Layout.Horizontal spacing="large" className={css.saveSecondStep}>
              <Button onClick={() => props.previousStep({})} text="Back" />
              {state.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                <Button
                  type="submit"
                  style={{ color: 'var(--blue-500)' }}
                  text="Continue"
                  // onClick={() => props.nextStep({})}
                />
              ) : (
                <Button
                  type="submit"
                  style={{ color: 'var(--blue-500)' }}
                  text="Continue"
                  onClick={() => {
                    addToFormData(state, { delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER })
                    props.nextStep({})
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

const IntermediateStep = (props: any) => {
  const { state, accountId } = props
  const { data: secretManagersApiResponse } = useListSecretManagers({
    queryParams: { accountIdentifier: accountId }
  })

  return (
    <div className={css.intermediateStep}>
      <Text font="medium" className={css.headingIntermediate}>
        {i18n.STEP_INTERMEDIATE.HEADING}
      </Text>
      <Formik
        initialValues={{ ...props.prevStepData }}
        onSubmit={formData => {
          const connectorData = { ...state.formData, ...formData }
          const data = buildKubPayload(connectorData)

          createConnectorByType(data, props)
          state.setFormData(connectorData)
          props.nextStep({})
        }}
      >
        {() => (
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
                {getCustomFields(props.state.authentication, secretManagersApiResponse?.data, state.formData.name)}
              </div>
              <Layout.Horizontal spacing="large" style={{ marginBottom: '30px' }}>
                <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
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

const checkingDelegate = async (state: any, accountId: string) => {
  const { delegateStatus, error } = await ConnectorService.checkDelegates({ accountId })
  if (!error) {
    state.setDelegateCount(delegateStatus)
    state.setCurrentStatus(2)
    state.setCurrentIntent(Intent.SUCCESS)
  }
}
const getStepOne = (state: any) => {
  if (state.currentStatus > 1) {
    return `${state.delegateCount?.resource?.delegates?.length} delegates found`
  } else {
    return i18n.STEP_THREE.STEPS.ONE
  }
}
const ThirdStep = (props: any) => {
  const [currentStatus, setCurrentStatus] = React.useState(1)
  const [currentIntent, setCurrentIntent] = React.useState<Intent>()
  const [delegateCount, setDelegateCount] = React.useState()
  const [validateError, setValidateError] = useState()
  const state: any = {
    delegateCount,
    setDelegateCount,
    currentStatus,
    setCurrentStatus,
    currentIntent,
    setCurrentIntent,
    validateError,
    setValidateError
  }

  React.useEffect(() => {
    if (currentStatus === 1) {
      checkingDelegate(state, props.accountId)
    } else if (currentStatus === 3) {
      const data = buildKubPayload(props.state.formData)

      validateCreds(data, state)
    } else if (currentStatus > 1 && currentStatus < 5) {
      const interval = setInterval(() => setCurrentStatus(currentStatus + 1), 5000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [currentStatus])
  return (
    <Layout.Vertical padding="small" style={{ height: '100%' }}>
      <Text font="medium" padding="small" style={{ color: 'var(--grey-700)', padding: 0 }}>
        Verify Connection to <span style={{ fontWeight: 700 }}>{props?.prevStepData?.connectorname}</span>
      </Text>
      <StepsProgress
        steps={[getStepOne(state), i18n.STEP_THREE.STEPS.TWO, i18n.STEP_THREE.STEPS.THREE]}
        intent={currentIntent}
        current={currentStatus}
        currentStatus={'PROCESS'}
      />
      {currentStatus === 3 && (
        <Text font="small" style={{ color: 'var(--grey-400)', padding: 0, width: 300 }}>
          {i18n.STEP_THREE.VERIFICATION_TIME_TEXT}
        </Text>
      )}
      {state.validateError?.responseMessages[0]?.message && (
        <Text font="small" style={{ color: 'red', padding: 10, width: '95%', margin: 10 }}>
          {state.validateError}
        </Text>
      )}

      <Layout.Horizontal spacing="large" style={{ marginTop: '300px' }}>
        <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
        <Button type="submit" onClick={() => props.hideLightModal} style={{ color: 'var(--blue-500)' }} text="Close" />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export const CreateConnectorWizard = (props: CreateConnectorWizardProps) => {
  const [, setSecondStepName] = React.useState(DelegateTypes.DELEGATE_IN_CLUSTER)
  const [delegateType, setDelegateType] = useState('')
  const [formData, setFormData] = useState({})
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const [authentication, setAuthentication] = useState('')
  const [delegateList, setDelegateList] = useState()
  const [installDelegate, setInstallDelegate] = useState(false)

  const state: CreateConnectorWizardState = {
    setSecondStepName,
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
    <div className={css.exampleWizard}>
      <StepWizard>
        <FirstStep name={i18n.STEP_ONE.NAME} setFormData={setFormData} />
        <SecondStep {...props} name={i18n.STEP_TWO.NAME} state={state} />
        {delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
          <IntermediateStep {...props} name={i18n.STEP_INTERMEDIATE.NAME} state={state} />
        ) : null}
        {installDelegate ? (
          <VerifyInstalledDelegate accountId={props.accountId} name={i18n.STEP_THREE.NAME} />
        ) : (
          <ThirdStep name={i18n.STEP_THREE.NAME} state={state} />
        )}
      </StepWizard>
      <Button text="close" />
    </div>
  )
}
