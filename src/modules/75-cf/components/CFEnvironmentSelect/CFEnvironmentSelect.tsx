import React from 'react'
import { Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

export const CFEnvironmentSelect: React.FC<{ component: JSX.Element }> = ({ component }) => {
  const { getString } = useStrings()
  return (
    <Layout.Horizontal
      style={{ '--layout-spacing': 'var(--spacing-small)', alignItems: 'baseline' } as React.CSSProperties}
    >
      <Text style={{ fontWeight: 700, fontSize: '16px' }}>{getString('environment')}</Text>
      {component}
    </Layout.Horizontal>
  )
}
