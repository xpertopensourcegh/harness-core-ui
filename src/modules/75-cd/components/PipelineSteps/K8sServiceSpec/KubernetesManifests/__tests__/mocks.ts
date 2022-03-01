/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

export const manifests = [
  {
    manifest: {
      identifier: 'helmhttpid',
      type: 'HelmChart',
      spec: {
        store: {
          type: 'Http',
          spec: {
            connectorRef: '<+input>'
          }
        },
        chartName: '<+input>',
        chartVersion: '<+input>',
        helmVersion: 'V2',
        skipResourceVersioning: '<+input>',
        commandFlags: [
          {
            commandType: 'Template',
            flag: 'asd'
          }
        ]
      }
    }
  },
  {
    manifest: {
      identifier: 'helmgitid',
      type: 'HelmChart',
      spec: {
        store: {
          type: 'Git',
          spec: {
            connectorRef: '<+input>',
            gitFetchType: 'Branch',
            folderPath: '<+input>',
            repoName: '<+input>',
            branch: '<+input>'
          }
        },
        skipResourceVersioning: false,
        helmVersion: 'V2'
      }
    }
  },
  {
    manifest: {
      identifier: 'helms3id',
      type: 'HelmChart',
      spec: {
        store: {
          type: 'S3',
          spec: {
            connectorRef: '<+input>',
            bucketName: '<+input>',
            folderPath: '<+input>',
            region: '<+input>'
          }
        },
        chartName: '<+input>',
        chartVersion: '<+input>',
        helmVersion: 'V2',
        skipResourceVersioning: false
      }
    }
  },
  {
    manifest: {
      identifier: 'helmgcsid',
      type: 'HelmChart',
      spec: {
        store: {
          type: 'Gcs',
          spec: {
            connectorRef: '<+input>',
            bucketName: '<+input>',
            folderPath: '<+input>'
          }
        },
        chartName: '<+input>',
        chartVersion: '<+input>',
        helmVersion: 'V2',
        skipResourceVersioning: '<+input>',
        commandFlags: [
          {
            commandType: 'Template',
            flag: 'sdsd'
          }
        ]
      }
    }
  },
  {
    manifest: {
      identifier: 'asdf',
      type: 'Kustomize',
      spec: {
        store: {
          type: 'Github',
          spec: {
            connectorRef: '<+input>',
            gitFetchType: 'Branch',
            folderPath: '<+input>',
            repoName: '<+input>',
            branch: '<+input>'
          }
        },
        pluginPath: '<+input>',
        skipResourceVersioning: false
      }
    }
  }
]

export const template = {
  manifests: [
    {
      manifest: {
        identifier: 'helmhttpid',
        type: 'HelmChart',
        spec: {
          store: {
            type: 'Http',
            spec: {
              connectorRef: '<+input>'
            }
          },
          chartName: '<+input>',
          chartVersion: '<+input>',
          skipResourceVersioning: '<+input>'
        }
      }
    },
    {
      manifest: {
        identifier: 'helmgitid',
        type: 'HelmChart',
        spec: {
          store: {
            type: 'Git',
            spec: {
              connectorRef: '<+input>',
              folderPath: '<+input>',
              repoName: '<+input>',
              branch: '<+input>'
            }
          }
        }
      }
    },
    {
      manifest: {
        identifier: 'helms3id',
        type: 'HelmChart',
        spec: {
          store: {
            type: 'S3',
            spec: {
              connectorRef: '<+input>',
              bucketName: '<+input>',
              folderPath: '<+input>',
              region: '<+input>'
            }
          },
          chartName: '<+input>',
          chartVersion: '<+input>'
        }
      }
    },
    {
      manifest: {
        identifier: 'helmgcsid',
        type: 'HelmChart',
        spec: {
          store: {
            type: 'Gcs',
            spec: {
              connectorRef: '<+input>',
              bucketName: '<+input>',
              folderPath: '<+input>'
            }
          },
          chartName: '<+input>',
          chartVersion: '<+input>',
          skipResourceVersioning: '<+input>'
        }
      }
    },
    {
      manifest: {
        identifier: 'asdf',
        type: 'Kustomize',
        spec: {
          store: {
            type: 'Github',
            spec: {
              connectorRef: '<+input>',
              folderPath: '<+input>',
              repoName: '<+input>',
              branch: '<+input>'
            }
          },
          pluginPath: '<+input>'
        }
      }
    }
  ]
}
