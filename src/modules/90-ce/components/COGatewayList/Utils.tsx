import { Intent, Tag } from '@wings-software/uicore'
import moment from 'moment'
import React from 'react'
import type { AllResourcesOfAccountResponse } from 'services/lw'

export function getRelativeTime(t: string, format: string): string {
  return moment(t, format).fromNow()
}

export function getInstancesLink(resources: AllResourcesOfAccountResponse): string {
  const instanceIDs = resources.response?.map(x => x.id)
  const region = resources.response?.length ? resources.response[0].region : ''
  return `https://console.aws.amazon.com/ec2/v2/home?region=${region}#Instances:search=${instanceIDs?.join(
    ','
  )};sort=instanceId`
}
const gatewayStateMap: { [key: string]: JSX.Element } = {
  down: (
    <Tag intent={Intent.DANGER} minimal={true} style={{ borderRadius: '25px' }}>
      STOPPED
    </Tag>
  ),
  active: (
    <Tag intent={Intent.SUCCESS} minimal={true} style={{ borderRadius: '25px' }}>
      RUNNING
    </Tag>
  )
}

export function getStateTag(state: string): JSX.Element {
  return gatewayStateMap[state]
}
