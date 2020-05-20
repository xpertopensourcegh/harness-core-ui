import React from 'react'
import { getLogger, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = getLogger(ModuleName.CD, 'Deployments')

export const DeploymentsPage: React.FC = () => {
  logger.info('Mounting Deployments...')

  return (
    <Container padding="huge">
      <Heading>Deployments</Heading>
    </Container>
  )
}
