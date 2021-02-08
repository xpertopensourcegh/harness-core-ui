import { buildAWSPayload, buildArtifactoryPayload, buildGitPayload, removeErrorCode } from '../ConnectorUtils'

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
          authType: 'UsernamePassword',
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
            url: 'url',
            type: 'Ssh',
            spec: {
              sshKeyRef: 'sshKeyRef'
            }
          }
        }
      })
    }),
    test(' test remove error code ', () => {
      expect(
        removeErrorCode([
          {
            message:
              'No eligible delegates could perform the required capabilities for this task: [ dhgjdgk ]↵  -  The capabilities were tested by the following delegates: [ Meenakshi-Raikwar-MBP ]↵  -  Following delegates were validating but never returned: [  ]↵  -  Other delegates (if any) may have been offline or were not eligible due to tag or scope restrictions.',
            reason: ' No Eligible Delegate Found',
            code: 450
          }
        ])
      ).toEqual([
        {
          message:
            'No eligible delegates could perform the required capabilities for this task: [ dhgjdgk ]↵  -  The capabilities were tested by the following delegates: [ Meenakshi-Raikwar-MBP ]↵  -  Following delegates were validating but never returned: [  ]↵  -  Other delegates (if any) may have been offline or were not eligible due to tag or scope restrictions.',
          reason: ' No Eligible Delegate Found'
        }
      ])
    })
})
