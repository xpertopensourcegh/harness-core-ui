import React from 'react'
import { Button, Layout, StepProps, Tabs, Tab, Icon, Heading, Text, Container, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import CommonProblems from '@delegates/components/CreateDelegate/K8sDelegate/StepSuccessVerification/CommonProblems/CommonProblems'
import addFile from './images/addFile.svg'
import css from '../CreateK8sDelegate.module.scss'

const StepSuccessVerification: React.FC<StepProps<null>> = props => {
  const showTab = true
  const { previousStep } = props
  const { getString } = useStrings()
  const onClickBack = (): void => {
    previousStep?.()
  }
  return (
    <>
      <Layout.Horizontal className={css.verificationBody}>
        <Layout.Vertical className={css.panelLeft}>
          <Layout.Horizontal>
            <Heading level={2} className={css.titleYamlVerification}>
              {getString('delegate.successVerification.applyYAMLTitle')}
            </Heading>
          </Layout.Horizontal>
          <Layout.Horizontal className={css.descriptionVerificationWrapper}>
            <Text lineClamp={2} font="normal" width={407}>
              {getString('delegate.successVerification.description1')}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal>
            <Text lineClamp={2} font={{ weight: 'bold', size: 'normal' }} width={407}>
              {getString('delegate.successVerification.description2')}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="medium" className={css.verificationFieldWrapper}>
            <Container
              intent="primary"
              padding="small"
              font={{
                align: 'center'
              }}
              flex
              className={css.verificationField}
            >
              <Text style={{ marginRight: '24px' }}>$ kubectl apply -f harness-delegate.yaml</Text>
              <img src={addFile} alt="" aria-hidden className={css.addConfigImg} />
            </Container>
            <Button text={getString('verify')} intent="primary" padding="small" />
          </Layout.Horizontal>
        </Layout.Vertical>
        <Layout.Vertical>
          <hr className={css.verticalLine} />
        </Layout.Vertical>
        {showTab ? (
          <Layout.Vertical padding="large">
            <Layout.Horizontal spacing="small">
              <Icon name="warning-sign" color={Color.ORANGE_600} size={16} />
              <Text>{getString('delegate.delegateNotInstalled.title')}</Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="small">
              <Tabs id="delegateNotInstalledTabs">
                <Tab
                  id="tabId1"
                  title={<Text>{getString('delegate.delegateNotInstalled.tabs.commonProblems.title')}</Text>}
                  panel={<CommonProblems />}
                />
                <Tab
                  id="tabId2"
                  title={<Text>{getString('delegate.delegateNotInstalled.tabs.troubleshooting')}</Text>}
                  panel={<div>Hello</div>}
                />
              </Tabs>
            </Layout.Horizontal>
          </Layout.Vertical>
        ) : (
          <Layout.Vertical spacing="xxlarge">
            <Layout.Horizontal padding="large">
              <Icon size={16} name="steps-spinner" style={{ marginRight: '12px' }} />
              <Text font="small">{getString('delegate.successVerification.checkDelegateInstalled')}</Text>
            </Layout.Horizontal>
            <Layout.Vertical padding="large">
              <Layout.Horizontal spacing="medium" className={css.checkItemsWrapper}>
                <Icon size={10} color={Color.GREEN_500} name="command-artifact-check" className={css.checkIcon} />
                <Text font={{ weight: 'bold' }}>{getString('delegate.successVerification.heartbeatReceived')}</Text>
              </Layout.Horizontal>
              <Layout.Horizontal spacing="medium" className={css.checkItemsWrapper}>
                <Icon size={10} color={Color.GREEN_500} name="command-artifact-check" className={css.checkIcon} />
                <Text font={{ weight: 'bold' }}>{getString('delegate.successVerification.delegateInitialized')}</Text>
              </Layout.Horizontal>
            </Layout.Vertical>
          </Layout.Vertical>
        )}
      </Layout.Horizontal>
      <Layout.Horizontal padding="xxxlarge">
        <Button
          id="stepReviewScriptBackButton"
          text={getString('back')}
          onClick={onClickBack}
          icon="chevron-left"
          margin={{ right: 'small' }}
        />
      </Layout.Horizontal>
    </>
  )
}

export default StepSuccessVerification
