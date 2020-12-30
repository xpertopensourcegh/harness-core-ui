import React, { useState } from 'react'
import { Heading, Container, Layout, Checkbox, Collapse } from '@wings-software/uikit'
import COHelpSidebar from '@ce/components/COHelpSidebar/COHelpSidebar'
import i18n from './COGatewayAccess.i18n'

const COGatewayAccess: React.FC = () => {
  const [dnsCheck, setDNSCheck] = useState<false | boolean>(false)
  const [sshCheck, setSSHCheck] = useState<false | boolean>(false)
  return (
    <Container width="50%" style={{ margin: '0 auto', paddingTop: 200 }}>
      <COHelpSidebar pageName="setup-access" />
      <Layout.Vertical spacing="large" padding="large" style={{ marginLeft: '10px' }}>
        <Heading level={1} font={{ weight: 'bold' }}>
          {i18n.setupAccess}
        </Heading>
        <Heading level={2} font={{ weight: 'light' }}>
          {i18n.subtitle}
        </Heading>
        <Checkbox
          label="DNS Link"
          onChange={val => {
            setDNSCheck(val.currentTarget.checked)
          }}
        />
        <Checkbox label="RDP" />
        <Checkbox
          label="SSH"
          onChange={val => {
            setSSHCheck(val.currentTarget.checked)
          }}
        />
        <Checkbox label="Background Tasks" />
      </Layout.Vertical>
      {dnsCheck ? (
        <Collapse isOpen={false} heading={'DNS Link Setup'}>
          Steps to setup DNS
        </Collapse>
      ) : null}
      {sshCheck ? (
        <Collapse isOpen={false} heading={'SSH Setup'}>
          Steps to setup SSH
        </Collapse>
      ) : null}
    </Container>
  )
}

export default COGatewayAccess
