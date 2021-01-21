import React from 'react'
import { Button, Layout, StepProps, Icon, Heading, Text, Container, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import addFile from './images/addFile.svg'
import css from '../CreateK8sDelegate.module.scss'

const StepSuccessVerification: React.FC<StepProps<null>> = props => {
  const { previousStep } = props
  const { getString } = useStrings()
  const onClickBack = (): void => {
    previousStep?.()
  }
  return (
    <>
      <Layout.Horizontal spacing="large" className={css.verificationHeader}></Layout.Horizontal>
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
          <Layout.Horizontal className={css.verificationFieldWrapper}>
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
