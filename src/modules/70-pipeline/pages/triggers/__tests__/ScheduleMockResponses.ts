export const GetTriggerScheduleResponse = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      name: 'test-schedule',
      identifier: 'testschedule',
      description: 'description',
      type: 'Scheduled',
      accountIdentifier: 'accountId',
      orgIdentifier: 'default',
      projectIdentifier: 'project1',
      targetIdentifier: 'pipeline1',
      yaml:
        'trigger:\n    name: test-schedule\n    identifier: testschedule\n    enabled: true\n    description: description\n    tags:\n        tag1: ""\n        tag2: "2"\n    target:\n        targetIdentifier: pipeline1\n        type: Pipeline\n        spec:\n            runtimeInputYaml: |\n                pipeline:\n                    identifier: pipeline1\n                    stages:\n                        - stage:\n                              identifier: stage1\n                              type: Deployment\n                              spec:\n                                  infrastructure:\n                                      environmentRef: ""\n                                      infrastructureDefinition:\n                                          type: KubernetesDirect\n                                          spec:\n                                              namespace: ""\n    source:\n        type: Scheduled\n        spec:\n            type: Cron\n            spec:\n                expression: 0/5 * * * *\n',
      version: 1,
      enabled: true
    },
    metaData: null,
    correlationId: 'b3e99035-2bdd-448c-916d-3f2ce7d1ac08'
  }
}
