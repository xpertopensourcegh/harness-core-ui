import { Layout, Container, Text, Icon, Color } from '@wings-software/uicore'
import React from 'react'
import idleTimeIMG from './images/idleTime.svg'
import spotVSODIMG from './images/spotOD.svg'
import ssh from './images/ssh.svg'
import rdp from './images/rdp.svg'
import bgTasks from './images/bgTasks.svg'
import ip from './images/ip.svg'
import dnsLink from './images/dnsLink.svg'

interface COHelpSidebarProps {
  pageName: string
  sectionName?: string
}
const COHelpSidebar: React.FC<COHelpSidebarProps> = props => {
  return (
    <Container>
      {props.pageName == 'configuration' ? (
        <Container padding="large">
          <Layout.Vertical padding="medium" spacing="large">
            <Text style={{ fontWeight: 500, fontSize: 'var(--font-size-normal)', lineHeight: '24px' }}>
              <Icon name="info"></Icon> Idle Time
            </Text>
            <Container flex style={{ justifyContent: 'center', flexGrow: 1 }}>
              <img src={idleTimeIMG} alt="" aria-hidden />
            </Container>
            <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
              Set the number of minutes you want AutoStopping to wait before optimizing idle instances. AutoStopping
              will shut down (for on-demand) or snapshot and terminate (for spot) the instances after the idle time
              period has elapsed.
            </Text>
            <Text
              style={{ color: '#0278d5', fontSize: 'var(--font-size-normal)', fontWeight: 500, lineHeight: '24px' }}
            >
              Read more...
            </Text>
            <Text style={{ fontWeight: 500, fontSize: 'var(--font-size-normal)', lineHeight: '24px' }}>
              <Icon name="info"></Icon> Spot vs On-Demand instances
            </Text>
            <img src={spotVSODIMG} alt="" aria-hidden />
            <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
              Your Linux on t3.2xlarge instance in US East (N. Virginia) region costs $240 on-demand and $72 on spot.
              That’s 70% savings!
            </Text>
            <Text
              style={{ color: '#0278d5', fontSize: 'var(--font-size-normal)', fontWeight: 500, lineHeight: '24px' }}
            >
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
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                Select DNS Link if the instances managed by this AutoStopping Rule are currently accessed by a URL.
              </Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="large" padding="medium">
              <img src={ssh} alt="" aria-hidden />
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                A description of how SSH is used to access the Rule securely over an unsecured network.
              </Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="large" padding="medium">
              <img src={rdp} alt="" aria-hidden />
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                RDP provides you with a graphical interface to connect to another computer over a network connection.
              </Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="large" padding="medium">
              <img src={bgTasks} alt="" aria-hidden />
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                Background tasks description of how it works in accessing gateways
              </Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="large" padding="medium">
              <img src={ip} alt="" aria-hidden />
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                IP addresses if the instances managed by this AutoStopping Rule are currently accessed by an IP.
              </Text>
            </Layout.Horizontal>
            <Text
              style={{ color: '#0278d5', fontSize: 'var(--font-size-normal)', fontWeight: 500, lineHeight: '24px' }}
            >
              Read more...
            </Text>
          </Layout.Vertical>
        </Container>
      ) : null}
      {props.pageName == 'setup-access-dns' ? (
        <>
          <Container padding="large" background={Color.BLUE_200}>
            <Layout.Vertical padding="medium" spacing="xxlarge">
              <Layout.Horizontal spacing="large" padding="medium">
                <img src={dnsLink} alt="" aria-hidden />
                <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                  Select DNS Link if the instances managed by this AutoStopping Rule are currently accessed by a URL.
                </Text>
              </Layout.Horizontal>
            </Layout.Vertical>
          </Container>
          <Container padding="large">
            <Layout.Vertical padding="medium" spacing="xxlarge">
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                To create a DNS Link, you need to:
              </Text>
              <Layout.Horizontal spacing="large">
                <Icon name="info-sign" size={23} color={Color.BLUE_500}></Icon>
                <Layout.Vertical spacing="small" style={{ maxWidth: '80%' }}>
                  <Text style={{ fontWeight: 'bold', lineHeight: '20px' }}>
                    Enter the URL currently used to access the instances
                  </Text>
                  <Text style={{ lineHeight: '20px' }}>
                    Domain name should be entered without prefixing the scheme. A rule can have multiple URLs. You can
                    enter comma separated values into Custom URL to support multiple URLs.
                  </Text>
                </Layout.Vertical>
              </Layout.Horizontal>
              {(props.sectionName as string) == 'public-dns' ? (
                <Layout.Horizontal spacing="large">
                  <Icon name="info-sign" size={23} color={Color.BLUE_500}></Icon>
                  <Layout.Vertical spacing="small" style={{ maxWidth: '80%' }}>
                    <Text style={{ fontWeight: 'bold', lineHeight: '20px' }}>
                      Select and Configure the DNS Provider
                    </Text>
                    <Text style={{ lineHeight: '20px' }}>
                      You will need to map your publicly accessible URL to the host name generated by this Lightwing
                      AutoStopping Rule. Select your DNS Provider from the list to proceed with the mapping.
                    </Text>
                  </Layout.Vertical>
                </Layout.Horizontal>
              ) : (props.sectionName as string) == 'private-dns' ? (
                <Layout.Horizontal spacing="large">
                  <Icon name="info-sign" size={23} color={Color.BLUE_500}></Icon>
                  <Layout.Vertical spacing="small" style={{ maxWidth: '80%' }}>
                    <Text style={{ fontWeight: 'bold', lineHeight: '20px' }}>Select an Access Point</Text>
                    <Text style={{ lineHeight: '20px' }}>
                      Since your URL is not publicly accessible, you will need to create a new Access Point or select
                      from an existing one. This will enable the AutoStopping Rule to manage your resources from within
                      your private network.
                    </Text>
                  </Layout.Vertical>
                </Layout.Horizontal>
              ) : null}
              <Text
                style={{ color: '#0278d5', fontSize: 'var(--font-size-normal)', fontWeight: 500, lineHeight: '24px' }}
              >
                Read more...
              </Text>
            </Layout.Vertical>
          </Container>
        </>
      ) : null}
      {props.pageName == 'setup-access-ssh' ? (
        <>
          <Container padding="large" background={Color.BLUE_200}>
            <Layout.Vertical padding="medium" spacing="xxlarge">
              <Layout.Horizontal spacing="large" padding="medium">
                <img src={ssh} alt="" aria-hidden />
                <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                  A description of how SSH is used to access the Rule securely over an unsecured network.
                </Text>
              </Layout.Horizontal>
            </Layout.Vertical>
          </Container>
          <Container padding="large">
            <Layout.Vertical padding="medium" spacing="xxlarge">
              <Text style={{ lineHeight: '20px', fontSize: 'var(--font-size-normal)' }}>
                To SSH into instances, you need to:
              </Text>
              <Layout.Horizontal spacing="large">
                <Icon name="info-sign" size={23} color={Color.BLUE_500}></Icon>
                <Layout.Vertical spacing="small" style={{ maxWidth: '80%' }}>
                  <Text style={{ fontWeight: 'bold', lineHeight: '20px' }}>Download CLI</Text>
                  <Text style={{ lineHeight: '20px' }}>
                    Lightwing CLI allows you to access the resources managed by this AutoStopping Rule via SSH and RDP
                    while still allowing Lightwing to detect usage and idleness in order to perform the required
                    optimization actions as needed.
                  </Text>
                </Layout.Vertical>
              </Layout.Horizontal>
              <Text
                style={{ color: '#0278d5', fontSize: 'var(--font-size-normal)', fontWeight: 500, lineHeight: '24px' }}
              >
                Read more...
              </Text>
            </Layout.Vertical>
          </Container>
        </>
      ) : null}
    </Container>
  )
}

export default COHelpSidebar
