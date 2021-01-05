import React, { useState } from 'react'
import {
  Layout,
  Tabs,
  Tab,
  Button,
  Container,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import COGatewayConfig from '@ce/components/COGatewayConfig/COGatewayConfig'
import COGatewayAccess from '@ce/components/COGatewayAccess/COGatewayAccess'
import COGatewayReview from '@ce/components/COGatewayReview/COGatewayReview'
import type { GatewayDetails } from '@ce/components/COCreateGateway/models'
import routes from '@common/RouteDefinitions'
import { useSaveService, Service } from 'services/lw'
import i18n from './COGatewayDetails.i18n'
import css from './COGatewayDetails.module.scss'
interface COGatewayDetailsProps {
  previousTab: () => void
  gatewayDetails: GatewayDetails
  setGatewayDetails: (gwDetails: GatewayDetails) => void
}
const COGatewayDetails: React.FC<COGatewayDetailsProps> = props => {
  const history = useHistory()
  const [selectedTabId, setSelectedTabId] = useState<string | undefined>('configuration')
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const tabs = ['configuration', 'setupAccess', 'review']
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { mutate: saveGateway } = useSaveService({
    org_id: orgIdentifier, // eslint-disable-line
    project_id: projectIdentifier // eslint-disable-line
  })
  const onSave = async (): Promise<void> => {
    const gateway: Service = {
      name: props.gatewayDetails.name,
      org_id: +orgIdentifier, // eslint-disable-line
      project_id: projectIdentifier, // eslint-disable-line
      fulfilment: props.gatewayDetails.fullfilment,
      kind: 'instance',
      cloud_account_id: +props.gatewayDetails.cloudAccount.id, // eslint-disable-line
      idle_time_mins: props.gatewayDetails.idleTimeMins, // eslint-disable-line
      custom_domains: [''], // eslint-disable-line
      // eslint-disable-next-line
      health_check: {
        protocol: 'http',
        path: '/',
        port: 80,
        timeout: 30
      },
      routing: {
        instance: {
          filter_text: `id = ['${props.gatewayDetails.selectedInstances[0].id}']` // eslint-disable-line
        },
        ports: [
          {
            protocol: 'http',
            target_protocol: 'http', // eslint-disable-line
            port: 80,
            target_port: 80, // eslint-disable-line
            action: 'forward',
            server_name: '', // eslint-disable-line
            redirect_url: '', // eslint-disable-line
            routing_rules: [{ path_match: '' }] // eslint-disable-line
          }
        ],
        lb: undefined
      },
      opts: {
        preserve_private_ip: false, // eslint-disable-line
        always_use_private_ip: false // eslint-disable-line
      },
      disabled: false,
      match_all_subdomains: false // eslint-disable-line
    }
    try {
      const result = await saveGateway({ service: gateway, deps: [], apply_now: false }) // eslint-disable-line
      if (result.response) {
        history.push(
          routes.toCECODashboard({
            orgIdentifier: orgIdentifier as string,
            projectIdentifier: projectIdentifier as string,
            accountId
          })
        )
      }
    } catch (e) {
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }
  const nextTab = (): void => {
    const tabIndex = tabs.findIndex(t => t == selectedTabId)
    if (tabIndex == tabs.length - 1) {
      onSave()
    } else if (tabIndex < tabs.length - 1) {
      setSelectedTabId(tabs[tabIndex + 1])
    }
  }
  const previousTab = (): void => {
    const tabIndex = tabs.findIndex(t => t == selectedTabId)
    if (tabIndex > 0) {
      setSelectedTabId(tabs[tabIndex - 1])
    } else {
      props.previousTab()
    }
  }
  const getNextButtonText = (): string => {
    const tabIndex = tabs.findIndex(t => t == selectedTabId)
    if (tabIndex == tabs.length - 1) {
      return 'Save Gateway'
    }
    return 'Next'
  }
  return (
    <Container>
      <Layout.Horizontal spacing="small">
        <Tabs id="tabsId1" selectedTabId={selectedTabId}>
          <Tab id="name" title={props.gatewayDetails.name} />
          <Tab
            id="configuration"
            title={i18n.configuration}
            panel={
              <COGatewayConfig gatewayDetails={props.gatewayDetails} setGatewayDetails={props.setGatewayDetails} />
            }
          />
          <Tab id="setupAccess" title={i18n.setupAccess} panel={<COGatewayAccess />} />
          <Tab id="review" title={i18n.review} panel={<COGatewayReview gatewayDetails={props.gatewayDetails} />} />
        </Tabs>
      </Layout.Horizontal>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Layout.Horizontal className={css.footer} spacing="medium">
        <Button text="Previous" icon="chevron-left" onClick={() => previousTab()} />
        <Button intent="primary" text={getNextButtonText()} icon="chevron-right" onClick={() => nextTab()} />
      </Layout.Horizontal>
    </Container>
  )
}

export default COGatewayDetails
