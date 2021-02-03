import React from 'react'
import { Layout, Button, Text } from '@wings-software/uicore'

const SSHSetup: React.FC = () => {
  return (
    <Layout.Vertical
      spacing="medium"
      padding="medium"
      style={{ backgroundColor: 'var(--grey-200)', maxWidth: '755px' }}
    >
      <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
        This is just placeholder text. You can customize the domain name for your Autostopping Rule. Domain name should
        be entered without prefixing the scheme. A Rule can have multiple URLs. You can enter comma separated values
        into Custom domain field to support multiple URLs.
      </Text>
      <Button
        style={{
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid var(--blue-700)',
          marginTop: '23px',
          color: 'var(--blue-700)',
          width: '130px'
        }}
        text="Download CLI"
      />
    </Layout.Vertical>
  )
}

export default SSHSetup
