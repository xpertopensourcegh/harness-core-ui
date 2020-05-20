import React from 'react'
import { getLogger, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = getLogger(ModuleName.CD, 'CDHomePage')

const CDHomePage: React.FC = () => {
  logger.info('Mounting CDHomePage...')

  return (
    <Container padding="huge">
      <Heading>Continuous Deployments</Heading>
    </Container>
  )
}

export default CDHomePage
