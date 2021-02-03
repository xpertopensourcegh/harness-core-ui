import React, { useState } from 'react'
import { CardSelect, Layout, CardBody, Button, Heading, Container, Text } from '@wings-software/uicore'
import type { IconName } from '@wings-software/uicore'
import type { GatewayDetails, Provider } from '@ce/components/COCreateGateway/models'
import i18n from './COProviderSelector.i18n'
import css from './COProviderSelector.module.scss'
interface COProviderSelectorProps {
  nextTab: () => void
  setGatewayDetails: (gatewayDetails: GatewayDetails) => void
  gatewayDetails: GatewayDetails
}

const data: Provider[] = [
  {
    name: 'Azure',
    value: 'azure',
    icon: 'service-azure'
  },
  {
    name: 'AWS',
    value: 'aws',
    icon: 'service-aws'
  },
  {
    name: 'Digital Ocean',
    value: 'do',
    icon: 'harness'
  }
]

function getProvider(name: string): Provider {
  return data.filter(p => p.name == name)[0]
}

const COProviderSelector: React.FC<COProviderSelectorProps> = props => {
  const [selectedCard, setSelectedCard] = useState<Provider>(getProvider(props.gatewayDetails.provider.name))
  return (
    <Container style={{ margin: '0 auto', paddingTop: 200, paddingLeft: 50 }}>
      <Layout.Vertical spacing="large" padding="large">
        <Heading className={css.title}>{i18n.title}</Heading>
        <Heading level={2}>{i18n.description}</Heading>
        <Text style={{ fontSize: '11px' }} font={{ weight: 'light' }}>
          {i18n.cloudAccounts}
        </Text>

        <Layout.Horizontal spacing="small" style={{ paddingTop: '29px' }}>
          <CardSelect
            data={data}
            selected={selectedCard}
            className={css.providersViewGrid}
            onChange={item => {
              props.gatewayDetails.provider = item
              setSelectedCard(item)
              props.setGatewayDetails(props.gatewayDetails)
            }}
            renderItem={item => (
              <Layout.Vertical spacing="small">
                <CardBody.Icon icon={item.icon as IconName} iconSize={21}></CardBody.Icon>
                <Text font={{ align: 'center' }} style={{ fontSize: 11 }}>
                  {item.name}
                </Text>
              </Layout.Vertical>
            )}
            cornerSelected={true}
          ></CardSelect>
        </Layout.Horizontal>
      </Layout.Vertical>
      <Button className={css.footer} intent="primary" text="Next" icon="chevron-right" onClick={props.nextTab} />
    </Container>
  )
}

export default COProviderSelector
