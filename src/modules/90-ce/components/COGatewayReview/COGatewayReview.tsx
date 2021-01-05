import React from 'react'
import { Heading, Container, Layout, Label, Text } from '@wings-software/uicore'
import type { GatewayDetails } from '@ce/components/COCreateGateway/models'
import i18n from './COGatewayReview.i18n'
import css from './COGatewayReview.module.scss'
interface COGatewayReviewProps {
  gatewayDetails: GatewayDetails
}
const COGatewayReview: React.FC<COGatewayReviewProps> = props => {
  return (
    <Layout.Horizontal spacing="large" padding="large">
      <Container width="50%">
        <Layout.Vertical spacing="large" padding="large">
          <Heading level={1}>{i18n.gatewayDetails}</Heading>
          <Label>{i18n.nameYourGateway}</Label>
          <Text>{props.gatewayDetails.name}</Text>
          <Label>{i18n.selectCloudAccount}</Label>
          <Text>{props.gatewayDetails.cloudAccount.name}</Text>
        </Layout.Vertical>
      </Container>
      <Container className={css.configDetails} width="50%">
        <Layout.Vertical spacing="large" padding="large">
          <Heading level={1}>{i18n.configurationDetails}</Heading>
          <Label>{i18n.idleTime}</Label>
          <Text>{props.gatewayDetails.idleTimeMins}</Text>
          <Label>{i18n.instanceType}</Label>
          <Text>{props.gatewayDetails.fullfilment}</Text>
          <Label>{i18n.instance}</Label>
          <Label>{i18n.routing}</Label>
        </Layout.Vertical>
      </Container>
    </Layout.Horizontal>
  )
}

export default COGatewayReview
