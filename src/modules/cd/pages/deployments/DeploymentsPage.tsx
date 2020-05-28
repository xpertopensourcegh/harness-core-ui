import React from 'react'
import { loggerFor, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = loggerFor(ModuleName.CD)

export default function DeploymentsPage(): JSX.Element {
  logger.debug('Mounting Deployments...')

  return (
    <Container padding="xsmall">
      <Heading>Deployments</Heading>
    </Container>
  )
}
