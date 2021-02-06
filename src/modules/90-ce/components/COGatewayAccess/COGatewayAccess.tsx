import React, { useEffect, useState } from 'react'
import { Heading, Container, Layout, Checkbox, Icon, Tabs, Tab } from '@wings-software/uicore'
import COHelpSidebar from '@ce/components/COHelpSidebar/COHelpSidebar'
import DNSLinkSetup from './DNSLinkSetup'
import i18n from './COGatewayAccess.i18n'
import SSHSetup from './SSHSetup'
import IPSetup from './IPAddressSetup'
import type { GatewayDetails } from '../COCreateGateway/models'
import COFixedDrawer from './COFixedDrawer'
import css from './COGatewayAccess.module.scss'

interface COGatewayAccessProps {
  valid: boolean
  setValidity: (tab: boolean) => void
  gatewayDetails: GatewayDetails
  setGatewayDetails: (gw: GatewayDetails) => void
}
const COGatewayAccess: React.FC<COGatewayAccessProps> = props => {
  const [dnsCheck, setDNSCheck] = useState<false | boolean>(props.gatewayDetails.connectionMetadata.dnsLink.selected)
  const [sshCheck, setSSHCheck] = useState<false | boolean>(props.gatewayDetails.connectionMetadata.ssh.selected)
  const [ipCheck, setIPCheck] = useState<false | boolean>(props.gatewayDetails.connectionMetadata.ipaddress.selected)
  const [rdpCheck, setRDPCheck] = useState<false | boolean>(props.gatewayDetails.connectionMetadata.rdp.selected)
  const [bgCheck, setBGCheck] = useState<false | boolean>(
    props.gatewayDetails.connectionMetadata.backgroundTasks.selected
  )
  const [selectedTabId, setSelectedTabId] = useState<string>('')
  const [selectedHelpText, setSelectedHelpText] = useState<string>('')
  const [selectedHelpTextSection, setSelectedHelpTextSection] = useState<string>('')
  const selectTab = (tabId: string) => {
    setSelectedTabId(tabId)
  }

  useEffect(() => {
    if (dnsCheck || ipCheck || sshCheck || bgCheck || rdpCheck) {
      props.setValidity(true)
    } else {
      props.setValidity(false)
    }
    props.gatewayDetails.connectionMetadata.dnsLink.selected = dnsCheck
    props.gatewayDetails.connectionMetadata.ssh.selected = sshCheck
    props.gatewayDetails.connectionMetadata.rdp.selected = rdpCheck
    props.gatewayDetails.connectionMetadata.backgroundTasks.selected = bgCheck
    props.gatewayDetails.connectionMetadata.ipaddress.selected = ipCheck
    props.setGatewayDetails(props.gatewayDetails)
    if (dnsCheck) {
      setSelectedTabId('dns')
      return
    }
    if (sshCheck) {
      setSelectedTabId('ssh')
      return
    }
    if (ipCheck) {
      setSelectedTabId('ip')
      return
    }
    if (rdpCheck) {
      setSelectedTabId('rdp')
      return
    }
    if (bgCheck) {
      setSelectedTabId('bg')
      return
    }
    setSelectedTabId('')
  }, [dnsCheck, sshCheck, ipCheck, rdpCheck, bgCheck])

  useEffect(() => {
    let helpTextBase = 'setup-access'
    if (selectedTabId != '') helpTextBase = `${helpTextBase}-${selectedTabId}`
    setSelectedHelpText(helpTextBase)
  }, [selectedTabId])
  return (
    <Container style={{ margin: '0 auto', paddingTop: 10, height: '100vh', marginLeft: '230px' }}>
      <COFixedDrawer content={<COHelpSidebar pageName={selectedHelpText} sectionName={selectedHelpTextSection} />} />
      <Layout.Vertical spacing="large" padding="medium" style={{ marginLeft: '10px' }}>
        <Layout.Vertical spacing="small" padding="medium">
          <Layout.Horizontal spacing="small">
            <Heading level={2} font={{ weight: 'semi-bold' }}>
              {i18n.setupAccess}
            </Heading>
          </Layout.Horizontal>
          <Heading level={3} font={{ weight: 'light' }}>
            {i18n.subtitle}
          </Heading>
        </Layout.Vertical>
        <Layout.Vertical spacing="small" padding="medium">
          <Layout.Horizontal spacing="small">
            <Heading level={3} font={{ weight: 'light' }}>
              {i18n.accessDescription}
            </Heading>
            <Icon name="info"></Icon>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="xxxlarge" style={{ paddingLeft: 'var(--spacing-large)' }}>
            <Layout.Vertical spacing="medium" style={{ paddingLeft: 'var(--spacing-small)' }}>
              <Checkbox
                label="DNS Link"
                onChange={val => {
                  setDNSCheck(val.currentTarget.checked)
                }}
                className={css.checkbox}
                defaultChecked={dnsCheck}
              />
              <Checkbox
                label="RDP"
                className={css.checkbox}
                onChange={val => {
                  setRDPCheck(val.currentTarget.checked)
                }}
                defaultChecked={rdpCheck}
              />
              <Checkbox
                label="SSH"
                onChange={val => {
                  setSSHCheck(val.currentTarget.checked)
                }}
                className={css.checkbox}
                defaultChecked={sshCheck}
              />
            </Layout.Vertical>
            <Layout.Vertical spacing="medium" style={{ paddingLeft: 'var(--spacing-xxlarge)' }}>
              <Checkbox
                label="Background Tasks"
                className={css.checkbox}
                onChange={val => {
                  setBGCheck(val.currentTarget.checked)
                }}
                defaultChecked={bgCheck}
              />
              <Checkbox
                label="IP address"
                className={css.checkbox}
                defaultChecked={ipCheck}
                onChange={val => {
                  setIPCheck(val.currentTarget.checked)
                }}
              />
            </Layout.Vertical>
          </Layout.Horizontal>
        </Layout.Vertical>
        <Container className={css.setupTab}>
          <Tabs id="setupTabs" selectedTabId={selectedTabId} onChange={selectTab}>
            {dnsCheck ? (
              <Tab
                id="dns"
                title={'DNS Link'}
                panel={
                  <DNSLinkSetup
                    gatewayDetails={props.gatewayDetails}
                    setHelpTextSection={setSelectedHelpTextSection}
                    setGatewayDetails={props.setGatewayDetails}
                  />
                }
              ></Tab>
            ) : null}
            {sshCheck ? <Tab id="ssh" title={'SSH'} panel={<SSHSetup />}></Tab> : null}
            {ipCheck ? <Tab id="ip" title={'IP Address'} panel={<IPSetup />}></Tab> : null}
            {rdpCheck ? <Tab id="rdp" title={'RDP'} panel={<IPSetup />}></Tab> : null}
            {bgCheck ? <Tab id="bg" title={'Background Tasks'} panel={<IPSetup />}></Tab> : null}
          </Tabs>
        </Container>
      </Layout.Vertical>
    </Container>
  )
}

export default COGatewayAccess
