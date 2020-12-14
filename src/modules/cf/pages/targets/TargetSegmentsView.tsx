import React from 'react'
import { Spinner } from '@blueprintjs/core'
import { Container } from '@wings-software/uikit'

const TargetSegmentsView: React.FC<any> = ({ loading }) => {
  if (loading) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }
  return <div>To be implemented</div>
}

export default TargetSegmentsView
