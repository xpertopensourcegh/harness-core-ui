import React from 'react'

import { StepProps, Container, Layout, Text, Color, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import CopyToClipboard from '@common/components/CopyToClipBoard/CopyToClipBoard'

import css from './DelegateInstallationError.module.scss'

const TroubleShooting: React.FC<StepProps<null>> = () => {
  const { getString } = useStrings()
  const [showPodsError, setShowPodsError] = React.useState(true)
  const [showEventsError, setShowEventsError] = React.useState(false)
  const [showHarnessError, setShowHarnessError] = React.useState(false)
  const [showHarnessSupport, setShowHarnessSupport] = React.useState(false)
  const iconProps = { size: 10, color: 'orange' }

  const onEventClick = () => {
    setShowEventsError(false)
    setShowHarnessError(true)
  }
  return (
    <Layout.Vertical width={630} style={{ padding: '0px var(--spacing-large)' }}>
      <Layout.Horizontal
        flex
        style={{
          borderBottom: '0.5px solid #B0B1C4',

          padding: 'var(--spacing-small) var(--spacing-medium)'
        }}
      >
        <Button intent="primary" minimal text={getString('back')} />

        <Text
          icon="info"
          color={Color.BLACK}
          font={{ size: 'medium', weight: 'bold' }}
          style={{ lineHeight: '22px' }}
          iconProps={{
            color: Color.BLUE_800
          }}
        >
          {getString('delegate.delegateNotInstalled.tabs.commonProblems.hereIsWhatYouCanDo')}
        </Text>
        <Button intent="primary" minimal text={getString('restart')} />
      </Layout.Horizontal>
      <Layout.Vertical width={511} style={{ padding: 'var(--spacing-medium) 0px' }}>
        <Layout.Horizontal flex>
          <Text color={Color.BLACK_100} font={{ weight: 'bold' }}>
            {getString('delegate.delegateNotInstalled.statusOfCluster')}
          </Text>
          <Button
            intent="primary"
            minimal
            text={getString('delegate.delegateNotInstalled.tabs.commonProblems.troubleshoot')}
          />
        </Layout.Horizontal>
        <Container
          intent="primary"
          padding="small"
          font={{
            align: 'center'
          }}
          flex
          className={css.podCmndField}
        >
          <Text>{getString('delegate.delegateNotInstalled.podCommand')}</Text>
          <CopyToClipboard content={getString('delegate.delegateNotInstalled.podCommand')} />
        </Container>
      </Layout.Vertical>
      {showPodsError && (
        <Container className={css.podCmndVerification}>
          <Text color={Color.BLACK_100}>{getString('delegate.delegateNotInstalled.podComeUp')}</Text>
          <Container style={{ marginTop: 'var(--spacing-medium)' }}>
            <Button text={getString('yes')} />
            <Button
              intent="none"
              onClick={() => {
                setShowPodsError(false)
                setShowEventsError(true)
              }}
              className={css.noBtn}
              text={getString('no')}
            />
          </Container>
        </Container>
      )}

      {showEventsError && (
        <>
          <Layout.Vertical width={511} style={{ padding: 'var(--spacing-medium) 0px' }}>
            <Text color={Color.BLACK_100} font={{ weight: 'bold' }}>
              {getString('delegate.delegateNotInstalled.eventErrorBlock')}
            </Text>
          </Layout.Vertical>
          <Container className={css.btnContainer}>
            <Button rightIcon="warning-sign" iconProps={iconProps} onClick={onEventClick} className={css.error}>
              {getString('delegate.delegateNotInstalled.permissionError')}
            </Button>
            <Button
              onClick={onEventClick}
              rightIcon="warning-sign"
              iconProps={iconProps}
              className={`${css.error} ${css.addSpacing}`}
            >
              {getString('delegate.delegateNotInstalled.crashloopError')}
            </Button>
            <Button
              onClick={onEventClick}
              rightIcon="warning-sign"
              iconProps={iconProps}
              className={`${css.error} ${css.addSpacing}`}
            >
              {getString('delegate.delegateNotInstalled.pullError')}
            </Button>
          </Container>
        </>
      )}
      {showHarnessError && (
        <>
          <Layout.Vertical width={511} style={{ padding: 'var(--spacing-medium) 0px' }}>
            <Text color={Color.BLACK_100} font={{ weight: 'bold' }}>
              {getString('delegate.delegateNotInstalled.harnessErrorValidation')}
            </Text>
          </Layout.Vertical>
          <Container className={css.podCmndVerification}>
            <Button
              onClick={() => {
                setShowHarnessError(false)
                setShowEventsError(false)
                setShowHarnessSupport(true)
              }}
              text={getString('yes')}
            />
            <Button text={getString('no')} intent="none" className={css.noBtn} />
          </Container>
        </>
      )}
      {showHarnessSupport && (
        <Text color={Color.BLACK_100} font={{ weight: 'bold' }}>
          {getString('delegate.delegateNotInstalled.contactHarness')}
        </Text>
      )}
    </Layout.Vertical>
  )
}

export default TroubleShooting
