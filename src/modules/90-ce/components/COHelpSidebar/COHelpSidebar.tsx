import { Button, Layout, Container, Text, Icon } from '@wings-software/uicore'
import React, { useState } from 'react'
import idleTimeIMG from './images/idleTime.svg'
import spotVSODIMG from './images/spotOD.svg'
import ssh from './images/ssh.svg'
import rdp from './images/rdp.svg'
import bgTasks from './images/bgTasks.svg'
import dnsLink from './images/dnsLink.svg'

interface COHelpSidebarProps {
  pageName: string
}
const COHelpSidebar: React.FC<COHelpSidebarProps> = props => {
  const [isOPen, setIsOpen] = useState<boolean>(true)
  return (
    <Container>
      {isOPen ? (
        <div
          style={{
            width: '392px',
            bottom: 0,
            right: 0,
            top: 65,
            position: 'fixed',
            backgroundColor: '#ffff',
            boxShadow:
              '0 0 0 1px rgba(16, 22, 26, 0.1), 0 4px 8px rgba(16, 22, 26, 0.2), 0 18px 46px 6px rgba(16, 22, 26, 0.2)',
            zIndex: 20
          }}
        >
          <Button
            icon="main-close"
            style={{ float: 'right', border: 'none' }}
            onClick={() => {
              setIsOpen(false)
            }}
          ></Button>
          {props.pageName == 'configuration' ? (
            <Container padding="large">
              <Layout.Vertical padding="medium" spacing="large">
                <Text style={{ fontWeight: 500, fontSize: '13px', lineHeight: '24px' }}>
                  <Icon name="info"></Icon> Idle Time
                </Text>
                <img src={idleTimeIMG} alt="" aria-hidden />
                <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                  Set the number of minutes you want AutoStopping to wait before optimizing idle instances. AutoStopping
                  will shut down (for on-demand) or snapshot and terminate (for spot) the instances after the idle time
                  period has elapsed.
                </Text>
                <Text style={{ color: '#0278d5', fontSize: '13px', fontWeight: 500, lineHeight: '24px' }}>
                  Read more...
                </Text>
                <Text style={{ fontWeight: 500, fontSize: '13px', lineHeight: '24px' }}>
                  <Icon name="info"></Icon> Spot vs On-Demand instances
                </Text>
                <img src={spotVSODIMG} alt="" aria-hidden />
                <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                  Your Linux on t3.2xlarge instance in US East (N. Virginia) region costs $240 on-demand and $72 on
                  spot. That’s 70% savings!
                </Text>
                <Text style={{ color: '#0278d5', fontSize: '13px', fontWeight: 500, lineHeight: '24px' }}>
                  Read more...
                </Text>
              </Layout.Vertical>
            </Container>
          ) : null}
          {props.pageName == 'setup-access' ? (
            <Container padding="large">
              <Layout.Vertical padding="medium" spacing="xxlarge">
                <Layout.Horizontal spacing="large" padding="medium">
                  <img src={dnsLink} alt="" aria-hidden />
                  <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                    A DNS Link lets you connect to the Gateway by matching human-readable domain names
                  </Text>
                </Layout.Horizontal>
                <Layout.Horizontal spacing="large" padding="medium">
                  <img src={ssh} alt="" aria-hidden />
                  <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                    A description of how SSH is used to access the Gateway securely over an unsecured network.
                  </Text>
                </Layout.Horizontal>
                <Layout.Horizontal spacing="large" padding="medium">
                  <img src={rdp} alt="" aria-hidden />
                  <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                    RDP provides you with a graphical interface to connect to another computer over a network
                    connection.
                  </Text>
                </Layout.Horizontal>
                <Layout.Horizontal spacing="large" padding="medium">
                  <img src={bgTasks} alt="" aria-hidden />
                  <Text style={{ lineHeight: '20px', fontSize: '13px' }}>
                    Background tasks description of how it works in accessing gateways
                  </Text>
                </Layout.Horizontal>
              </Layout.Vertical>
            </Container>
          ) : null}
        </div>
      ) : null}
    </Container>
  )
}

export default COHelpSidebar
