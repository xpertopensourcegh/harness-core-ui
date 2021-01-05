import React, { useState } from 'react'
import { Container, Layout, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import COGatewayBasics from '@ce/components/COGatewayBasics/COGatewayBasics'
import COProviderSelector from '@ce/components/COProviderSelector/COProviderSelector'
import COGatewayDetails from '@ce/components/COGatewayDetails/COGatewayDetails'
import type { GatewayDetails } from './models'
import autostoppingInfo from './images/autostoppingInfo.svg'
import css from './COCreateGateway.module.scss'

function getString(val: string | undefined): string {
  const stringVal = val?.toString()
  if (stringVal != undefined) {
    return stringVal
  }
  return ''
}

export const CECODashboardPage: React.FC = () => {
  const { projectIdentifier, orgIdentifier } = useParams<AccountPathProps & Partial<ProjectPathProps>>()
  const gatewayCreationTabs = ['providerSelector', 'gatewayBasics', 'gatewayConfig']
  const [currentTab, setCurrentTab] = useState<string | 'providerSelector'>('providerSelector')
  const initialGatewayDetails: GatewayDetails = {
    name: '',
    cloudAccount: {
      id: '',
      name: ''
    },
    idleTimeMins: 5,
    fullfilment: '',
    filter: '',
    kind: 'instance',
    orgID: getString(orgIdentifier),
    projectID: getString(projectIdentifier),
    hostName: '',
    customDomains: [],
    matchAllSubdomains: false,
    disabled: false,
    routing: {
      instance: {
        filterText: ''
      },
      lb: '',
      ports: []
    },
    healthCheck: undefined,
    opts: {
      preservePrivateIP: false,
      deleteCloudResources: false,
      alwaysUsePrivateIP: false
    },
    provider: {
      name: 'Azure',
      icon: 'service-azure',
      value: 'azure'
    },
    selectedInstances: []
  }
  const [gatewayDetails, setGatewayDetails] = useState<GatewayDetails>(initialGatewayDetails)
  const nextTab = (): void => {
    const tabIndex = gatewayCreationTabs.findIndex(t => t == currentTab)
    if (tabIndex < gatewayCreationTabs.length - 1) {
      setCurrentTab(gatewayCreationTabs[tabIndex + 1])
    }
  }
  const previousTab = (): void => {
    const tabIndex = gatewayCreationTabs.findIndex(t => t == currentTab)
    if (tabIndex > 0) {
      setCurrentTab(gatewayCreationTabs[tabIndex - 1])
    }
  }
  return (
    <Container>
      {currentTab != 'gatewayConfig' ? (
        <Container flex id="ce-co-config">
          <Container width="43%" padding="medium">
            <Layout.Vertical padding="xlarge" spacing="large">
              <Container style={{ backgroundColor: '#FAFAFC' }}>
                <Layout.Horizontal spacing="large" padding="large">
                  <img src={autostoppingInfo}></img>
                  <Text style={{ fontSize: '13px', lineHeight: '24px', maxWidth: '331px' }}>
                    AutoStopping Gateways dynamically make sure that your non-production workloads are running (and
                    costing you) only when you’re using them, and never when they are idle. Additionally, run your
                    workloads on fully orchestrated spot instances without any worry of spot interruptions.
                  </Text>
                </Layout.Horizontal>
              </Container>
            </Layout.Vertical>
          </Container>
          <Container width="57%" className={css.selectorPanel}>
            {currentTab == 'providerSelector' ? (
              <COProviderSelector
                nextTab={nextTab}
                setGatewayDetails={setGatewayDetails}
                gatewayDetails={gatewayDetails}
              />
            ) : null}
            {currentTab == 'gatewayBasics' ? (
              <COGatewayBasics
                nextTab={nextTab}
                previousTab={previousTab}
                gatewayDetails={gatewayDetails}
                setGatewayDetails={setGatewayDetails}
              />
            ) : null}
          </Container>
        </Container>
      ) : null}

      {currentTab == 'gatewayConfig' ? (
        <COGatewayDetails
          previousTab={previousTab}
          gatewayDetails={gatewayDetails}
          setGatewayDetails={setGatewayDetails}
        />
      ) : null}
    </Container>
  )
}

export default CECODashboardPage
