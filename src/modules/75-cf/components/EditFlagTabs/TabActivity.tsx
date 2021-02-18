import React from 'react'
import { Container } from '@wings-software/uicore'
import { AuditLogObjectType } from '@cf/utils/CFUtils'
import type { Feature } from 'services/cf'
import { AuditLogs } from '../AuditLogs/AuditLogs'

const TabActivity: React.FC<{ flagData: Feature }> = ({ flagData }) => {
  return (
    <Container
      style={{
        marginTop: '-20px',
        height: 'calc(100vh - 135px)',
        overflow: 'auto',
        marginLeft: 'var(--spacing-large)'
      }}
    >
      <AuditLogs flagData={flagData} objectType={AuditLogObjectType.FeatureActivation} />
    </Container>
  )
}

export default TabActivity
