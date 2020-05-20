import React from 'react'
import { getLogger, ModuleName } from 'framework'
import { Container, Heading } from '@wings-software/uikit'

const logger = getLogger(ModuleName.CD, 'PipelineStudioPage')

export const PipelineStudioPage: React.FC = () => {
  logger.info('Mounting Pipeline Studio...')

  return (
    <Container padding="huge">
      <Heading>Pipeline Studio</Heading>
    </Container>
  )
}
