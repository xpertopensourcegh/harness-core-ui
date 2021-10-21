import type { DelegateGroupDetails } from 'services/portal'

export default {
  activelyConnected: true,
  delegateConfigurationId: 'config-id-1',
  delegateDescription: 'desc 1',
  delegateGroupIdentifier: 'id1',
  delegateInsightsDetails: {},
  delegateInstanceDetails: [],
  delegateType: 'ECS',
  groupCustomSelectors: ['sel-1', 'sel-2'],
  groupHostName: 'group-host-1',
  groupId: 'groupId1',
  groupName: 'group-name-1',
  lastHeartBeat: 1231231,
  sizeDetails: {
    ram: 3000,
    cpu: 3
  },
  groupImplicitSelectors: {
    DELEGATE_NAME: 'DELEGATE_NAME',
    HOST_NAME: 'HOST_NAME',
    PROFILE_NAME: 'PROFILE_NAME'
  }
} as DelegateGroupDetails
