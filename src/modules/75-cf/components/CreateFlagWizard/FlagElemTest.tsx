import React, { useState } from 'react'
import {
  Color,
  Formik,
  FormikForm as Form,
  Layout,
  Button,
  Container,
  Text,
  StepProps,
  CardSelect,
  CardBody,
  CodeBlock
} from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import type { IconName } from '@blueprintjs/core'
import cx from 'classnames'
import { FlagTypeSdk, FlagTypeLanguage } from '../CreateFlagDialog/FlagDialogUtils'
import i18n from './FlagWizard.i18n'
import css from './FlagElemTest.module.scss'

interface CardData {
  text: string
  value: string
  icon: string
}

interface CardLanguageData {
  value: string
  icon: string
}

const selectCardData: CardData[] = [
  {
    text: i18n.testTheFlag.sdkClient,
    value: FlagTypeSdk.client,
    icon: 'desktop'
  },
  {
    text: i18n.testTheFlag.sdkServer,
    value: FlagTypeSdk.server,
    icon: 'service-nexus'
  }
]

// FIXME: Need to change values because we need dynamic code samples
const selectClientLanguageData: CardLanguageData[] = [
  {
    value: 'jira',
    icon: 'service-jira'
  },
  {
    value: 'datadog',
    icon: 'service-datadog'
  }
]

// FIXME: Need to change values because we need dynamic code samples
const selectServerLanguageData: CardLanguageData[] = [
  {
    value: 'aws',
    icon: 'service-aws'
  },
  {
    value: 'github',
    icon: 'service-github'
  }
]

interface FlagElemTestProps {
  fromWizard: boolean
  hideModal?: () => void
}

// FIXME: Change any for StepProps
const FlagElemTest: React.FC<StepProps<any> & FlagElemTestProps> = props => {
  const { previousStep, prevStepData, fromWizard, hideModal } = props

  const [selectedCard, setSelectedCard] = useState<CardData | undefined>(undefined)
  const [isClient, setIsClient] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<CardLanguageData | undefined>(undefined)
  const [selectLanguageSdk, setSelectLanguageSdk] = useState('')
  const [btnPosition, setBtnPosition] = useState(true)

  const renderInstallLanguage = (): string => {
    if (selectLanguageSdk === FlagTypeLanguage.jira) {
      return 'npm install harness-toolkit --save'
    }
    return 'npm install harness-client --save'
  }

  const renderInstallSdk = (): string => {
    if (selectLanguageSdk === FlagTypeLanguage.jira) {
      return 'npm install -global create-react-app'
    }
    return 'npm install -global yarn'
  }

  const renderCodeSample = (): string => {
    if (selectLanguageSdk === FlagTypeLanguage.jira) {
      // prettier-ignore
      return (
        `setTimeout(() => {
          if (harness.isEnabled('name') {
            console.log('Toggle enabled')
          } else {
            console.log('Toggle disabled')
          }
        }, 2000)`
      )
    }
    return (
      // prettier-ignore
      `setInterval(() => {
        if (harness.isEnabled('PrepopulateName') {
          console.log('Toggle enabled')
        } else {
          console.log('Toggle disabled')
        }
      }, 1000)`
    )
  }

  const onVerifyFlag = (): void => {
    setTimeout(() => {
      alert('To be implemented...')
    }, 500)
  }

  const onClickBack = (): void => {
    previousStep?.({ ...prevStepData })
  }

  return (
    <Formik
      initialValues={{ selectedIcon: '' }}
      onSubmit={() => {
        // TODO: Uncomment when back-end for SDK is done
        // if (fromWizard) {
        //   return nextStep?.({ ...prevStepData, ...vals })
        // }
        // TODO: When the user is on edit targeting page only submit the Formik from this step

        if (confirm(i18n.confirmClose)) {
          hideModal?.()
        }
      }}
    >
      {formikProps => (
        <Form>
          <Layout.Vertical className={css.testFlagContainer}>
            <Text
              color={Color.BLACK}
              font={{ size: 'medium', weight: 'bold' }}
              margin={{ bottom: 'medium' }}
              className={cx(css.testFfHeadline, !btnPosition && css.borderBottom)}
            >
              {fromWizard
                ? i18n.testTheFlag.testFlagHeading.toUpperCase()
                : i18n.testTheFlag.testFlagTargetHeading.toUpperCase()}
            </Text>
            <Container>
              <Text color={Color.BLACK} margin={{ top: 'large', bottom: 'large' }}>
                {i18n.testTheFlag.setupAppText}
              </Text>
              <Text color={Color.BLACK} margin={{ bottom: 'small' }}>
                {i18n.testTheFlag.selectSdk}
              </Text>
              <CardSelect
                data={selectCardData}
                selected={selectedCard}
                className={css.selectOptionsCard}
                onChange={item => {
                  setSelectedCard(item)
                  setSelectedLanguage(undefined)
                  setSelectLanguageSdk('')
                  setBtnPosition(true)
                  setIsClient(item.value === FlagTypeSdk.client)
                  formikProps.setFieldValue('selectedIcon', item.value)
                }}
                renderItem={(item, selected) => (
                  <CardBody.Icon icon={item.icon as IconName} iconSize={20}>
                    <Text
                      font={{ size: 'small', align: 'center' }}
                      style={{
                        color: selected ? Color.GREY_900 : Color.GREY_350
                      }}
                    >
                      {item.text}
                    </Text>
                  </CardBody.Icon>
                )}
              ></CardSelect>
            </Container>
            {/* FIXME: Check the setSelectedCard useState method */}
            {isEmpty(selectedCard) ? null : (
              <Container>
                <Text margin={{ top: 'medium', bottom: 'small' }}>{i18n.testTheFlag.selectSdkLanguage}</Text>
                <CardSelect
                  data={isClient ? selectClientLanguageData : selectServerLanguageData}
                  selected={selectedLanguage}
                  className={css.selectOptionsCard}
                  onChange={item => {
                    setSelectedLanguage(item)
                    setSelectLanguageSdk(item.value)
                    setBtnPosition(false)
                    formikProps.setFieldValue('selectedIcon', item.value)
                  }}
                  renderItem={item => <CardBody.Icon icon={item.icon as IconName} iconSize={20} />}
                ></CardSelect>
              </Container>
            )}
            {isEmpty(selectedLanguage) ? null : (
              <>
                <Layout.Vertical>
                  <Container margin={{ top: 'large', bottom: 'large' }} className={css.testCodeBlock}>
                    <Text color={Color.BLACK} font={{ weight: 'bold' }}>
                      1. {i18n.testTheFlag.installNode}
                    </Text>
                    <CodeBlock allowCopy format="pre" snippet={renderInstallLanguage()} />
                  </Container>
                  <Container margin={{ top: 'large', bottom: 'large' }} className={css.testCodeBlock}>
                    <Text color={Color.BLACK} font={{ weight: 'bold' }}>
                      2. {i18n.testTheFlag.initClient}
                    </Text>
                    <CodeBlock allowCopy format="pre" snippet={renderInstallSdk()} />
                  </Container>
                  <Container margin={{ top: 'large', bottom: 'large' }} className={css.testCodeBlock}>
                    <Text color={Color.BLACK} font={{ weight: 'bold' }}>
                      3. {i18n.testTheFlag.codeSample}
                    </Text>
                    <CodeBlock allowCopy format="pre" snippet={renderCodeSample()} />
                    <Text margin={{ top: 'large' }}>{i18n.testTheFlag.codeSampleNote}</Text>
                  </Container>
                </Layout.Vertical>
                <Container margin={{ top: 'large', bottom: 'large' }}>
                  <Text font={{ weight: 'bold' }} margin={{ bottom: 'medium' }}>
                    {i18n.testTheFlag.verifyText}
                  </Text>
                  <Button intent="primary" text={i18n.testTheFlag.verify} onClick={onVerifyFlag} />
                </Container>
              </>
            )}
            <Layout.Horizontal
              className={cx(css.btnsGroup, btnPosition && css.btnsGroupPosa, !btnPosition && css.borderTop)}
            >
              {fromWizard && <Button text={i18n.back} onClick={onClickBack} margin={{ right: 'small' }} />}
              <Button text={i18n.close} type="submit" />
            </Layout.Horizontal>
          </Layout.Vertical>
        </Form>
      )}
    </Formik>
  )
}

export default FlagElemTest
