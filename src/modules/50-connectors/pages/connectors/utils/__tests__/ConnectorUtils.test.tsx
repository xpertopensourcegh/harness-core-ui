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
        secretKeyRef: { name: 'mysecretappd', identifier: 'mysecretappd', referenceString: 'account.mysecretappd' },
        crossAccountAccess: false,
        accessKey: 'access key'
      })
    ).toEqual({
      connector: {
        name: 'dummyaws',
        description: '',
        identifier: 'dummyaws',
        tags: {},
        type: 'Aws',
        spec: {
          credential: {
            type: 'ManualConfig',
            spec: { accessKey: 'access key', secretKeyRef: 'account.mysecretappd' },
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
          username: '',
          artifactoryServerUrl: 'dummyurl',
          userName: 'dummyusername',
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
            auth: { type: 'UsernamePassword', spec: { username: 'dummyusername', passwordRef: 'account.jkdhkjdhk' } }
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
          username: 'username',
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
