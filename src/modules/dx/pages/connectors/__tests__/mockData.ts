export const ManualK8s = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for K8s',
          identifier: 'k8sId',
          name: 'K8sName',
          type: 'K8sCluster',
          tags: [],
          spec: {
            credential: {
              type: 'ManualConfig',
              spec: {
                masterUrl: 'master url',
                auth: {
                  type: 'UsernamePassword',
                  spec: {
                    passwordRef: 'acc.secretname',
                    username: 'user name'
                  }
                }
              }
            }
          }
        },
        status: {
          errorMessage: 'Unable to connect to the server',
          lastConnectedAt: 0,
          lastTestedAt: 1601199008081,
          status: 'FAILURE'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}

export const InlineK8s = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for K8s',
          identifier: 'k8sId',
          name: 'K8sName',
          type: 'K8sCluster',
          tags: ['tag1'],
          spec: {
            credential: {
              type: 'InheritFromDelegate',
              spec: {
                delegateName: 'kubernetes'
              }
            }
          }
        },
        status: {
          errorMessage: 'Unable to connect to the server',
          lastConnectedAt: 0,
          lastTestedAt: 1601199008081,
          status: 'FAILURE'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}

export const GitHttp = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for Git',
          identifier: 'GitHttpId',
          name: 'GitHttpName',
          type: 'Git',
          tags: ['tag1'],
          spec: {
            branchName: 'branch',
            connectionType: 'REPO',
            type: 'Http',
            url: 'url',
            spec: {
              passwordRef: 'acc.secretname',
              username: 'user name'
            }
          }
        },
        status: {
          errorMessage: 'Unable to connect to the server',
          lastConnectedAt: 0,
          lastTestedAt: 1601199008081,
          status: 'FAILURE'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}

export const Docker = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for Docker',
          identifier: 'DockerId',
          name: 'DockerName',
          type: '"DockerRegistry"',
          tags: ['tag1'],
          spec: {
            dockerRegistryUrl: 'docker Registry url',
            auth: {
              type: 'UsernamePassword',
              spec: {
                passwordRef: 'acc.secretname',
                username: 'user name'
              }
            }
          }
        },
        status: {
          errorMessage: 'Unable to connect to the server',
          lastConnectedAt: 0,
          lastTestedAt: 1601199008081,
          status: 'FAILURE'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}
export const ActiveDocker = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for Docker',
          identifier: 'DockerId',
          name: 'DockerName',
          type: '"DockerRegistry"',
          tags: ['tag1'],
          spec: {
            dockerRegistryUrl: 'docker Registry url',
            auth: {
              type: 'UsernamePassword',
              spec: {
                passwordRef: 'acc.secretname',
                username: 'user name'
              }
            }
          }
        },
        status: {
          errorMessage: null,
          lastConnectedAt: 1601199008081,
          lastTestedAt: 1601199008081,
          status: 'SUCCESS'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}

export const Vault = {
  status: 'SUCCESS' as const,
  data: {
    currentPage: 1,
    empty: false,
    content: [
      {
        connector: {
          description: 'This description is for Vault',
          identifier: 'VaultId',
          name: 'VaultName',
          type: '"Vault"',
          tags: ['tag1'],
          spec: {
            default: false
          }
        },
        status: {
          errorMessage: null,
          lastConnectedAt: 1601199008081,
          lastTestedAt: 1601199008081,
          status: 'SUCCESS'
        },
        createdAt: 1601198999531,
        lastModifiedAt: 1601199008088
      }
    ],
    total: 1
  },
  metaData: null,
  correlationId: 'correlationId'
}
