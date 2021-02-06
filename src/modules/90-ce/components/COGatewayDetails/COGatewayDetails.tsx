import React, { useState } from 'react'
import {
  Layout,
  Tabs,
  Tab,
  Button,
  Container,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  Icon,
  Text
} from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import COGatewayConfig from '@ce/components/COGatewayConfig/COGatewayConfig'
import COGatewayAccess from '@ce/components/COGatewayAccess/COGatewayAccess'
import COGatewayReview from '@ce/components/COGatewayReview/COGatewayReview'
import type { GatewayDetails } from '@ce/components/COCreateGateway/models'
import routes from '@common/RouteDefinitions'
import { useSaveService, Service } from 'services/lw'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import i18n from './COGatewayDetails.i18n'
import css from './COGatewayDetails.module.scss'
interface COGatewayDetailsProps {
  previousTab: () => void
  gatewayDetails: GatewayDetails
  setGatewayDetails: (gwDetails: GatewayDetails) => void
}
const COGatewayDetails: React.FC<COGatewayDetailsProps> = props => {
  const history = useHistory()
  const [selectedTabId, setSelectedTabId] = useState<string>('configuration')
  const [validConfig, setValidConfig] = useState<boolean>(false)
  const [validAccessSetup, setValidAccessSetup] = useState<boolean>(false)
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
      org_id: orgIdentifier, // eslint-disable-line
      project_id: projectIdentifier, // eslint-disable-line
      account_identifier: accountId, // eslint-disable-line
      fulfilment: props.gatewayDetails.fullfilment,
      kind: 'instance',
      cloud_account_id: props.gatewayDetails.cloudAccount.id, // eslint-disable-line
      idle_time_mins: props.gatewayDetails.idleTimeMins, // eslint-disable-line
      custom_domains: props.gatewayDetails.customDomains ? props.gatewayDetails.customDomains : [], // eslint-disable-line
      // eslint-disable-next-line
      health_check: props.gatewayDetails.healthCheck,
      routing: {
        instance: {
          filter_text: `id = ['${props.gatewayDetails.selectedInstances[0].id}']` // eslint-disable-line
        },
        ports: props.gatewayDetails.routing.ports,
        lb: undefined
      },
      opts: {
        preserve_private_ip: false, // eslint-disable-line
        always_use_private_ip: false // eslint-disable-line
      },
      disabled: props.gatewayDetails.disabled,
      match_all_subdomains: props.gatewayDetails.matchAllSubdomains, // eslint-disable-line
      access_point_id: props.gatewayDetails.accessPointID // eslint-disable-line
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
  const selectTab = (tabId: string) => {
    if (tabId == selectedTabId) {
      return
    }
    const tabIndex = tabs.findIndex(t => t == tabId)
    setSelectedTabId(tabs[tabIndex])
  }
  const getNextButtonText = (): string => {
    const tabIndex = tabs.findIndex(t => t == selectedTabId)
    if (tabIndex == tabs.length - 1) {
      return 'Save Rule'
    }
    return 'Next'
  }
  return (
    <Container style={{ overflow: 'scroll', maxHeight: '100vh', backgroundColor: 'var(--white)' }}>
      <Breadcrumbs
        className={css.breadCrumb}
        links={[
          {
            url: routes.toCECODashboard({ orgIdentifier, projectIdentifier, accountId }),
            label: 'Setup'
          },
          {
            url: routes.toCECODashboard({ orgIdentifier, projectIdentifier, accountId }),
            label: 'Autostopping Rules'
          },
          {
            url: '',
            label: props.gatewayDetails.name || ''
          }
        ]}
      />
      <Container className={css.detailsTab}>
        <Tabs id="tabsId1" selectedTabId={selectedTabId} onChange={selectTab}>
          <Tab
            id="configuration"
            title={
              <Layout.Horizontal>
                {validConfig ? (
                  <Icon name="tick-circle" className={css.greenSymbol} size={16} />
                ) : (
                  <Icon name="symbol-circle" className={css.symbol} size={16} />
                )}
                <Text className={css.tabTitle}>1. {i18n.configuration}</Text>
              </Layout.Horizontal>
            }
            panel={
              <COGatewayConfig
                gatewayDetails={props.gatewayDetails}
                setGatewayDetails={props.setGatewayDetails}
                valid={validConfig}
                setValidity={setValidConfig}
              />
            }
          />
          <Tab
            id="setupAccess"
            title={
              <Layout.Horizontal>
                {validAccessSetup ? (
                  <Icon name="tick-circle" className={css.greenSymbol} size={16} />
                ) : (
                  <Icon name="symbol-circle" className={css.symbol} size={16} />
                )}
                <Text className={css.tabTitle}>2. {i18n.setupAccess}</Text>
              </Layout.Horizontal>
            }
            panel={
              <COGatewayAccess
                valid={validAccessSetup}
                setValidity={setValidAccessSetup}
                gatewayDetails={props.gatewayDetails}
                setGatewayDetails={props.setGatewayDetails}
              />
            }
          />
          <Tab
            id="review"
            title={
              <Layout.Horizontal>
                {validConfig && validAccessSetup ? (
                  <Icon name="tick-circle" className={css.greenSymbol} size={16} />
                ) : (
                  <Icon name="symbol-circle" className={css.symbol} size={16} />
                )}
                <Text className={css.tabTitle}>3. {i18n.review}</Text>
              </Layout.Horizontal>
            }
            panel={<COGatewayReview gatewayDetails={props.gatewayDetails} />}
          />
        </Tabs>
      </Container>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Layout.Horizontal className={css.footer} spacing="medium">
        <Button text="Previous" icon="chevron-left" onClick={() => previousTab()} />
        <Button
          intent="primary"
          text={getNextButtonText()}
          icon="chevron-right"
          onClick={() => nextTab()}
          disabled={
            (selectedTabId == tabs[0] && !validConfig) ||
            (selectedTabId == tabs[1] && !validAccessSetup) ||
            (selectedTabId == tabs[2] && (!validAccessSetup || !validConfig))
          }
        />
      </Layout.Horizontal>
    </Container>
  )
}

export default COGatewayDetails
