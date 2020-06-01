import React from 'react'
import { loggerFor, ModuleName } from 'framework/exports'
import { Container, Heading } from '@wings-software/uikit'
import { DelegateSetupModal } from '../../modals/DelegateSetupModal/DelegateSetupModal'

const logger = loggerFor(ModuleName.CD)

export default function DeploymentsPage(): JSX.Element {
  logger.debug('Mounting Deployments...')

  return (
    <Container padding="xsmall">
      <Heading>Deployments</Heading>
      <DelegateSetupModal />
    </Container>
  )
}
