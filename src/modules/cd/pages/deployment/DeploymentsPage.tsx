import React from 'react'
import { loggerFor, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = loggerFor(ModuleName.CD)

export const DeploymentsPage: React.FC = () => {
  logger.error('Mounting Deployments...', { user: 'Tom' })

  return (
    <Container padding="huge">
      <Heading>Deployments</Heading>
    </Container>
  )
}
