import React from 'react'
import { Layout, Text } from '@wings-software/uicore'

const IPSetup: React.FC = () => {
  return (
    <Layout.Vertical
      spacing="medium"
      padding="medium"
      style={{ backgroundColor: 'var(--grey-200)', maxWidth: '755px' }}
    >
      <Text>
        This is just placeholder text. You can customize the domain name for your Autostopping Rule. Domain name should
        be entered without prefixing the scheme.
      </Text>
    </Layout.Vertical>
  )
}

export default IPSetup
