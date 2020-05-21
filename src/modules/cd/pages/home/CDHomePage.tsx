import React from 'react'
import { loggerFor, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = loggerFor(ModuleName.CD, 'CDHomePage')

const CDHomePage: React.FC = () => {
  logger.info('Mounting CDHomePage...')

  return (
    <Container padding="huge">
      <Heading>Continuous Deployments</Heading>
    </Container>
  )
}

export default CDHomePage
