import { buildAWSPayload, buildArtifactoryPayload, buildGitPayload } from '../ConnectorUtils'

describe('Connector Utils', () => {
  test(' test buildAWSPayload', () => {
    expect(
      buildAWSPayload({
        name: 'dummyaws',
        description: '',
        identifier: 'dummyaws',
        tags: {},
        credential: 'ManualConfig',
        username: 'usename',
        secretKeyRef: { name: 'mysecretappd', identifier: 'mysecretappd', referenceString: 'account.mysecretappd' },
        crossAccountAccess: false,
        accessKey: { type: 'TEXT', value: 'accesskey' }
      })
    ).toEqual({
      connector: {
        name: 'dummyaws',
        description: '',
        orgIdentifier: undefined,
        projectIdentifier: undefined,
        identifier: 'dummyaws',
        tags: {},
        type: 'Aws',
        spec: {
          credential: {
            type: 'ManualConfig',
            spec: { accessKey: 'accesskey', accessKeyRef: undefined, secretKeyRef: 'account.mysecretappd' },
            crossAccountAccess: null
          }
        }
      }
    })
  }),
    test(' test buildArtifactoryPayload', () => {
      expect(
        buildArtifactoryPayload({
          name: 'dummy name',
          description: '',
          identifier: 'dummy_name',
          tags: {},
          artifactoryServerUrl: 'dummyurl',
          username: { type: 'TEXT', value: 'dummyusername' },
          password: { name: 'jkdhkjdhk', identifier: 'jkdhkjdhk', referenceString: 'account.jkdhkjdhk' }
        })
      ).toEqual({
        connector: {
          type: 'Artifactory',
          name: 'dummy name',
          identifier: 'dummy_name',
          description: '',
          tags: {},
          spec: {
            artifactoryServerUrl: 'dummyurl',
            auth: {
              type: 'UsernamePassword',
              spec: { username: 'dummyusername', usernameRef: undefined, passwordRef: 'account.jkdhkjdhk' }
            }
          }
        }
      })
    }),
    test(' test buildGitPayload with ssh', () => {
      expect(
        buildGitPayload({
          name: 'dummy name',
          description: '',
          identifier: 'dummy_name',
          tags: {},
          connectionType: 'Ssh',
          branchName: 'branchName',
          url: 'url',
          urlType: 'Repo',
          connectType: 'Ssh',
          sshKey: { referenceString: 'sshKeyRef' }
        })
      ).toEqual({
        connector: {
          type: 'Git',
          name: 'dummy name',
          identifier: 'dummy_name',
          orgIdentifier: undefined,
          projectIdentifier: undefined,
          description: '',
          tags: {},
          spec: {
            connectionType: 'Repo',
            branchName: 'branchName',
            url: 'url',
            type: 'Ssh',
            spec: {
              sshKeyRef: 'sshKeyRef'
            }
          }
        }
      })
    })
})
