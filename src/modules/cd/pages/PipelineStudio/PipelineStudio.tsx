import React from 'react'
import { Button } from '@wings-software/uikit'
import { getLogger } from 'framework'

const logger = getLogger('CD')

const PipelineStudio: React.FC = () => {
  return (
    <div>
      <h1>Pipeline Studio</h1>
      <Button text="Hello World" />
    </div>
  )
}

logger.error('Failed to do something....', { foo: 'bar' })

export default PipelineStudio
