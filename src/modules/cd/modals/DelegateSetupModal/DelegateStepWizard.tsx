import React from 'react'
import {
  StepWizard,
  Layout,
  Button,
  Text,
  RadioSelect,
  TextInput,
  Select,
  Label,
  StepsProgress,
  Intent,
  CodeBlock
} from '@wings-software/uikit'
import css from './DelegateSetupModal.module.scss'
import { Formik, Form, connect } from 'formik'
import i18n from './DelegateSetup.i18n'

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

const DelegateTypes = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER
}

const DelegateInfoText = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER_INFO,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER_INFO
}

interface FirstData {
  value: string
  info: string
  icon: string
}

const firstStepData: FirstData[] = [
  {
    value: DelegateTypes.DELEGATE_IN_CLUSTER,
    info: DelegateInfoText.DELEGATE_IN_CLUSTER,
    icon: 'blank'
  },
  {
    value: DelegateTypes.DELEGATE_OUT_CLUSTER,
    info: DelegateInfoText.DELEGATE_OUT_CLUSTER,
    icon: 'blank'
  }
]

const FirstStep = (props: any) => {
  const selected = props.prevStepData && props.prevStepData.delegateType

  const radioProps = {
    data: firstStepData,
    className: 'customGrid',
    renderItem: function renderItem(item: any) {
      return (
        <div>
          <Layout.Vertical spacing="medium">
            <div className={css.itemName}>{item.value}</div>
            <div className={css.itemInfo}>{item.info}</div>
          </Layout.Vertical>
        </div>
      )
    },
    onChange: (item: FirstData) => props.nextStep({ delegateType: item.value })
  }
  return (
    <Layout.Vertical padding="small">
      <div style={{ height: '180px' }}></div>
      <Text font="large" padding="small" style={{ textTransform: 'uppercase', color: 'var(--grey-700)' }}>
        {props.name}
      </Text>
      <Text padding="medium" style={{ textTransform: 'uppercase', color: 'var(--grey-400)' }}>
        {i18n.STEP_ONE.RECOMMENDED}
      </Text>
      <RadioSelect {...radioProps} selected={selected && firstStepData.filter(data => data.value === selected)[0]} />
    </Layout.Vertical>
  )
}

interface ConnectedProps {
  formik?: any
  label: string
  name: string
  type?: string
}

const MyTextField = (props: ConnectedProps) => {
  const { formik, label, ...rest } = props
  const hasError = formik.touched[props.name] && formik.errors[props.name]

  return (
    <Layout.Vertical spacing="small">
      <Label>{props.label}</Label>
      <TextInput
        {...rest}
        value={formik.values[props.name]}
        errorText={hasError ? formik.errors[props.name] : ''}
        onChange={event => {
          const target = event.target as HTMLInputElement
          formik.setFieldValue(props.name, target.value)
        }}
      />
    </Layout.Vertical>
  )
}

const FormikField: any = connect(MyTextField)

const SecondStep = (props: any) => {
  const selected = props.prevStepData && props.prevStepData.delegateType
  return (
    <Layout.Vertical padding="small">
      <Text font="medium" padding="small" style={{ color: 'var(--grey-700)', fontWeight: 'bold', padding: 0 }}>
        {props.name}
      </Text>
      {selected === DelegateTypes.DELEGATE_IN_CLUSTER && (
        <Formik
          initialValues={{ ...props.prevStepData }}
          onSubmit={values => {
            props.nextStep({ ...props.prevStepData, ...values })
          }}
        >
          {() => (
            <Form>
              <Layout.Vertical spacing="large" className={css.formLayout}>
                <FormikField
                  label={i18n.STEP_TWO.CONNECTOR_NAME_LABEL}
                  type="text"
                  name="connectorname"
                  placeholder={i18n.STEP_TWO.CONNECTOR_NAME_PLACEHOLDER}
                />

                <Layout.Horizontal spacing="large">
                  <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
                  <Button type="submit" style={{ color: 'var(--blue-500)' }} text="Save and Continue" />
                </Layout.Horizontal>
              </Layout.Vertical>
            </Form>
          )}
        </Formik>
      )}
      {selected === DelegateTypes.DELEGATE_OUT_CLUSTER && (
        <Formik
          initialValues={{ ...props.prevStepData }}
          onSubmit={values => {
            props.nextStep({ ...props.prevStepData, ...values })
          }}
        >
          {() => (
            <Form>
              <Layout.Vertical spacing="large" className={css.formLayout}>
                <FormikField
                  label={i18n.STEP_TWO.CONNECTOR_NAME_LABEL}
                  type="text"
                  name="connectorname"
                  placeholder={i18n.STEP_TWO.CONNECTOR_NAME_PLACEHOLDER}
                />
                <FormikField
                  label={i18n.STEP_TWO.MASTER_URL_LABEL}
                  type="text"
                  name="masterURL"
                  placeholder={i18n.STEP_TWO.MASTER_URL_PLACEHOLDER}
                />

                <Layout.Horizontal spacing="large">
                  <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
                  <Button type="submit" style={{ color: 'var(--blue-500)' }} text="Save and Continue" />
                </Layout.Horizontal>
              </Layout.Vertical>
            </Form>
          )}
        </Formik>
      )}
    </Layout.Vertical>
  )
}

const ThirdStep = (props: any) => {
  const [currentStatus, setCurrentStatus] = React.useState(1)
  const [currentIntent, setCurrentIntent] = React.useState<Intent>(Intent.WARNING)
  React.useEffect(() => {
    if (currentStatus > 1 && currentStatus < 5) {
      const interval = setInterval(() => setCurrentStatus(currentStatus + 1), 5000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [currentStatus])
  return (
    <Layout.Vertical padding="small">
      <Text font="medium" padding="small" style={{ color: 'var(--grey-700)', padding: 0 }}>
        Verify Connection to <span style={{ fontWeight: 700 }}>{props?.prevStepData?.connectorname}</span>
      </Text>
      <StepsProgress
        steps={[
          i18n.STEP_THREE.STEPS.ONE,
          i18n.STEP_THREE.STEPS.TWO,
          i18n.STEP_THREE.STEPS.THREE,
          i18n.STEP_THREE.STEPS.FOUR
        ]}
        intent={currentIntent}
        current={currentStatus}
        currentStatus={'PROCESS'}
      />
      {currentStatus === 4 && (
        <Text font="small" style={{ color: 'var(--grey-400)', padding: 0, width: 300 }}>
          {i18n.STEP_THREE.VERIFICATION_TIME_TEXT}
        </Text>
      )}
      <section className={css.stepsOverlay}>
        <Layout.Vertical spacing="xxlarge">
          <Text
            font="medium"
            style={{ color: 'var(--grey-700)', padding: 0, fontWeight: 700, marginBottom: 'var(--spacing-large)' }}
          >
            Install your Delegate
          </Text>

          <Layout.Vertical spacing="small">
            <Label>Supported Formats</Label>
            <Select items={[{ label: 'YAML', value: 'YAML' }]} />
          </Layout.Vertical>
          <Button
            intent="primary"
            large
            text={i18n.STEP_THREE.INSTALL.DOWNLOAD_BTN_TEXT}
            icon="bring-data"
            onClick={() => {
              setCurrentIntent(Intent.SUCCESS)
              setTimeout(() => {
                setCurrentStatus(currentStatus + 1)
              }, 3000)
            }}
          />
          <Layout.Vertical spacing="large">
            <Text style={{ color: 'var(--grey-500)', padding: 0, marginTop: 'var(--spacing-large)' }}>
              {i18n.STEP_THREE.INSTALL.DELEGATE_RUN_INFO}
            </Text>
            <CodeBlock allowCopy format="pre" snippet={i18n.STEP_THREE.INSTALL.COMMAND} />
          </Layout.Vertical>
        </Layout.Vertical>
      </section>
      <Layout.Horizontal spacing="large">
        <Button onClick={() => props.previousStep(props.prevStepData)} text="Back" />
        <Button type="submit" onClick={() => props.hideLightModal} style={{ color: 'var(--blue-500)' }} text="Close" />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export const DelegateStepWizard = () => {
  const [, setSecondStepName] = React.useState(DelegateTypes.DELEGATE_IN_CLUSTER)
  return (
    <div className={css.exampleWizard}>
      <StepWizard onStepChange={({ prevStepData }: any) => setSecondStepName(prevStepData.delegateType)}>
        <FirstStep name={i18n.STEP_ONE.NAME} />
        <SecondStep name={i18n.STEP_TWO.NAME} />
        <ThirdStep name={i18n.STEP_THREE.NAME} />
      </StepWizard>
      <Button text="close" />
    </div>
  )
}
