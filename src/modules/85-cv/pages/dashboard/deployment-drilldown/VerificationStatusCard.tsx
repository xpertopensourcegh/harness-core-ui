import React from 'react'
import { Container, Color } from '@wings-software/uicore'
import type { VerificationResult } from 'services/cv'
import i18n from './DeploymentDrilldownView.i18n'
import styles from './DeploymentDrilldownView.module.scss'

export default function VerificationStatusCard({ status }: { status: VerificationResult['status'] }) {
  let statusMessage: string | undefined = undefined
  let color: Color | undefined = undefined
  let backgroundColor: Color | undefined = undefined
  switch (status) {
    case 'IN_PROGRESS':
      statusMessage = i18n.status.inProgress
      color = Color.BLUE_500
      backgroundColor = Color.BLUE_350
      break
    case 'VERIFICATION_FAILED':
    case 'ERROR':
      statusMessage = i18n.status.failed
      color = Color.RED_500
      backgroundColor = Color.RED_350
      break
    case 'VERIFICATION_PASSED':
      statusMessage = i18n.status.passed
      color = Color.GREEN_500
      backgroundColor = Color.GREEN_350
      break
    default:
      statusMessage = undefined
  }
  if (!statusMessage) {
    return null
  }
  return (
    <Container className={styles.verificationStatusCard} color={color} background={backgroundColor}>
      {statusMessage}
    </Container>
  )
}
