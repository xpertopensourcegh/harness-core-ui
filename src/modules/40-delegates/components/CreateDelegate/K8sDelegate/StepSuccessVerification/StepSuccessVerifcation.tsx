import React from 'react'

import { Button, Layout, StepProps, Heading, Text } from '@wings-software/uicore'
import { CopyText } from '@common/components/CopyText/CopyText'
import { useStrings } from 'framework/exports'
import type { StepK8Data } from '@delegates/DelegateInterface'
import StepProcessing from '../StepProcessing/StepProcessing'
// import CommonProblems from '@delegates/components/CreateDelegate/K8sDelegate/StepSuccessVerification/CommonProblems/CommonProblems'
// import addFile from './images/addFile.svg'
import css from '../CreateK8sDelegate.module.scss'

const StepSuccessVerification: React.FC<StepProps<StepK8Data>> = props => {
  const [showProcessing, setShowProcessing] = React.useState(false)
  const { previousStep } = props
  // const { accountId } = useParams()
  const { getString } = useStrings()

  // const { data, loading, error, refetch: verifyHeartBeat } = useHeartbeat({
  //   queryParams: { accountId, sessionId: 'WB4xZm8BRAiSMyTPf2dmRQ' },
  //   lazy: true
  // })

  // const onVerify = () => {}

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
            <CopyText textToCopy="$ kubectl apply -f harness-delegate.yaml">
              <span>$ kubectl apply -f harness-delegate.yaml</span>
            </CopyText>
            {/* <Container
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
            </Container> */}
            <Button
              text={getString('verify')}
              intent="primary"
              padding="small"
              onClick={() => {
                setShowProcessing(true)
                // console.log('on verify', data)
                // onVerify()
              }}
            />
          </Layout.Horizontal>
        </Layout.Vertical>
        <Layout.Vertical>
          <hr className={css.verticalLine} />
        </Layout.Vertical>
        {showProcessing && (
          <Layout.Vertical>
            <StepProcessing {...props} />
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
