import type { UseGetReturnData } from '@common/utils/testUtils'
import type {
  ResponseMapWebhookSourceRepoListWebhookEvent,
  ResponseListWebhookAction,
  ResponseNGTriggerResponse
} from 'services/pipeline-ng'

export const GetSourceRepoToEventResponse: UseGetReturnData<ResponseMapWebhookSourceRepoListWebhookEvent> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      GITLAB: ['Push', 'Merge Request'],
      GITHUB: ['Pull Request', 'Push', 'Delete'],
      BITBUCKET: ['Pull Request', 'Issue', 'Repository']
    },
    metaData: (null as unknown) as undefined,
    correlationId: '45939431-731c-4434-89b0-4414ac46d3f7'
  }
}

export const GetActionsListResponse: UseGetReturnData<ResponseListWebhookAction> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: ['closed', 'edited', 'opened', 'reopened', 'labeled', 'unlabeled', 'synchronized'],
    metaData: (null as unknown) as undefined,
    correlationId: '4b575abb-9519-485e-ab11-9a805dda5cc1'
  }
}

export const GetTriggerResponse: UseGetReturnData<ResponseNGTriggerResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      name: 'AllValues123',
      identifier: 'AllValues',
      description: 'desc',
      type: 'Webhook',
      accountIdentifier: 'accountIdentifier',
      orgIdentifier: 'default',
      projectIdentifier: 'project1',
      targetIdentifier: 'p1',
      yaml:
        'trigger:\n  name: AllValues123\n  identifier: AllValues\n  description: desc\n  target:\n    targetIdentifier: p1\n    type: Pipeline\n    spec:\n      runtimeInputYaml: |\n        pipeline:\n          identifier: p1\n          stages:\n            - stage:\n                identifier: stage1\n                type: Deployment\n                spec:\n                  infrastructure:\n                    infrastructureDefinition:\n                      type: KubernetesDirect\n                      spec:\n                        namespace: newNameSpaces\n                        releaseName: "22"\n  source:\n    type: Webhook\n    spec:\n      type: GITHUB\n      spec:\n        repoUrl: repoUrlss1\n        event: Pull Request\n        actions:\n          - closed\n          - edited\n          - opened\n        payloadConditions:\n          - key: sourceBranch\n            operator: equals\n            value: "123"\n          - key: targetBranch\n            operator: regex\n            value: regex\n          - key: abcd\n            operator: in\n            value: abc\n          - key: defg\n            operator: not in\n            value: def\n',
      version: 12
    },
    metaData: (null as unknown) as undefined,
    correlationId: '25df5700-e9a4-49c4-98eb-dea4c371fd6e'
  }
}

export const updateTriggerMockResponse = {
  status: 'SUCCESS',
  data: {
    name: 'AllValues123',
    identifier: 'AllValues',
    description: 'desc',
    type: 'Webhook',
    accountIdentifier: 'accountIdentifier',
    orgIdentifier: 'default',
    projectIdentifier: 'project1',
    targetIdentifier: 'p1',
    yaml:
      'trigger:\n  name: AllValues123\n  identifier: AllValues\n  description: desc\n  target:\n    targetIdentifier: p1\n    type: Pipeline\n    spec:\n      runtimeInputYaml: |\n        pipeline:\n          identifier: p1\n          stages:\n            - stage:\n                identifier: stage1\n                type: Deployment\n                spec:\n                  infrastructure:\n                    infrastructureDefinition:\n                      type: KubernetesDirect\n                      spec:\n                        namespace: newNameSpaces\n                        releaseName: "22"\n  source:\n    type: Webhook\n    spec:\n      type: GITHUB\n      spec:\n        repoUrl: repoUrlss1\n        event: Pull Request\n        actions:\n          - closed\n          - edited\n          - opened\n        payloadConditions:\n          - key: sourceBranch\n            operator: equals\n            value: "123"\n          - key: targetBranch\n            operator: regex\n            value: regex\n          - key: abcd\n            operator: in\n            value: abc\n          - key: defg\n            operator: not in\n            value: def\n',
    version: 13
  },
  metaData: null,
  correlationId: 'abd712b8-920a-43da-a382-228e93012e6e'
}

export const updateTriggerMockResponseYaml =
  'trigger:\n  name: AllValues123\n  identifier: AllValues\n  enabled: true\n  description: desc\n  target:\n    targetIdentifier: p1\n    type: Pipeline\n    spec:\n      runtimeInputYaml: |\n        pipeline:\n          identifier: p1\n          stages:\n            - stage:\n                identifier: stage1\n                type: Deployment\n                spec:\n                  infrastructure:\n                    infrastructureDefinition:\n                      type: KubernetesDirect\n                      spec:\n                        namespace: newNameSpaces\n                        releaseName: "22"\n  source:\n    type: Webhook\n    spec:\n      type: GITHUB\n      spec:\n        repoUrl: repoUrlss1\n        event: Pull Request\n        actions:\n          - closed\n          - edited\n          - opened\n        payloadConditions:\n          - key: sourceBranch\n            operator: equals\n            value: "123"\n          - key: targetBranch\n            operator: regex\n            value: regex\n          - key: abcd\n            operator: in\n            value: abc\n          - key: defg\n            operator: not in\n            value: def\n'

export const enabledFalseUpdateTriggerMockResponseYaml =
  'trigger:\n  name: AllValues123\n  identifier: AllValues\n  enabled: false\n  description: desc\n  target:\n    targetIdentifier: p1\n    type: Pipeline\n    spec:\n      runtimeInputYaml: |\n        pipeline:\n          identifier: p1\n          stages:\n            - stage:\n                identifier: stage1\n                type: Deployment\n                spec:\n                  infrastructure:\n                    infrastructureDefinition:\n                      type: KubernetesDirect\n                      spec:\n                        namespace: newNameSpaces\n                        releaseName: "22"\n  source:\n    type: Webhook\n    spec:\n      type: GITHUB\n      spec:\n        repoUrl: repoUrlss1\n        event: Pull Request\n        actions:\n          - closed\n          - edited\n          - opened\n        payloadConditions:\n          - key: sourceBranch\n            operator: equals\n            value: "123"\n          - key: targetBranch\n            operator: regex\n            value: regex\n          - key: abcd\n            operator: in\n            value: abc\n          - key: defg\n            operator: not in\n            value: def\n'
