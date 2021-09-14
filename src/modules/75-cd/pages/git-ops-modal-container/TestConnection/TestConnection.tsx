/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Layout, Heading, Container, StepsProgress, Intent, Button, ButtonVariation } from '@wings-software/uicore'

import { useStrings } from 'framework/strings'
import css from './TestConnection.module.scss'

export enum Status {
  // WAIT = 'WAIT',
  PROCESS = 'PROCESS',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

const TestConnection: React.FC<Record<string, unknown>> = (props: any) => {
  const [currentStep] = useState(1)
  const [currentStatus, setCurrentStatus] = useState<Status>(Status.PROCESS)
  const [currentIntent, setCurrentIntent] = useState<Intent>(Intent.NONE)
  const url = props?.prevStepData?.spec?.adapterUrl
  const stepName = `Validating ${url}`
  let validationStatusIntent = null

  const { getString } = useStrings()
  const handleSuccess = () => {
    props.onClose()
  }

  const launchArgoDashboard = () => {
    const provider = props?.prevStepData
    props.onLaunchArgoDashboard(provider)
  }

  const validateAdapterURL = () => {
    let updatedURL = url
    if (updatedURL) {
      updatedURL += url.endsWith('/') ? `api/version` : `/api/version`
    }

    fetch(updatedURL)
      .then(() => {
        setCurrentStatus(Status.DONE)
        setCurrentIntent(Intent.SUCCESS)
      })
      .catch(() => {
        setCurrentStatus(Status.ERROR)
        setCurrentIntent(Intent.DANGER)
      })
  }

  useEffect(() => {
    validateAdapterURL()
  }, [])

  if (currentStatus === Status.DONE) {
    validationStatusIntent = css.success
  } else if (currentStatus === Status.ERROR) {
    validationStatusIntent = css.error
  }

  return (
    <Layout.Vertical spacing="xxlarge" className={cx(css.stepContainer, css.fullHeight)}>
      <Container>
        <Heading level={2} style={{ fontSize: '18px', color: 'black' }}>
          {'Test Connection'}
        </Heading>
      </Container>

      <Layout.Vertical spacing="large" className={css.stepFormContainer}>
        <StepsProgress steps={[stepName]} intent={currentIntent} current={currentStep} currentStatus={currentStatus} />

        {(currentStatus === Status.DONE || currentStatus === Status.ERROR) && (
          <div className={cx(css.validationStatus, validationStatusIntent)}>
            {currentStatus === Status.DONE ? 'Validation Successful' : 'Validation Failed'}{' '}
          </div>
        )}

        <Layout.Horizontal className={css.layoutFooter} padding={{ top: 'small' }} spacing="large">
          {currentStatus === Status.ERROR && (
            <Button
              variation={ButtonVariation.SECONDARY}
              text={getString('back')}
              icon="chevron-left"
              onClick={() => props?.previousStep?.(props?.prevStepData)}
              data-name="commonGitBackButton"
            />
          )}
          <Button
            variation={currentStatus === Status.ERROR ? ButtonVariation.PRIMARY : ButtonVariation.SECONDARY}
            text={getString('finish')}
            onClick={handleSuccess}
            className={css.nextButton}
          />

          {currentStatus === Status.DONE && (
            <Button
              variation={ButtonVariation.PRIMARY}
              text={getString('cd.launchArgo')}
              onClick={launchArgoDashboard}
              className={css.nextButton}
            />
          )}
        </Layout.Horizontal>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default TestConnection
