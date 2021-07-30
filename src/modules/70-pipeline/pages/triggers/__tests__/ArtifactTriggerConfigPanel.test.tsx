import React from 'react'
import { render } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uicore'

import { TestWrapper } from '@common/utils/testUtils'

import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, triggerPathProps } from '@common/utils/routeUtils'
import { ArtifactTriggerConfigPanel } from '../views'

jest.mock('@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService', () => ({
  getLanguageService: jest.fn()
}))

const params = {
  accountId: 'testAcc',
  orgIdentifier: 'testOrg',
  projectIdentifier: 'test',
  pipelineIdentifier: 'pipeline',
  triggerIdentifier: 'triggerIdentifier',
  module: 'cd'
}

const TEST_PATH = routes.toTriggersWizardPage({ ...accountPathProps, ...triggerPathProps, ...pipelineModuleParams })

const iValues = {
  identifier: 'test',
  name: 'test',
  stageId: 'stagea',
  originalPipeline: {
    identifier: 'pipe11',
    name: 'pipe11',
    orgIdentifier: 'default',
    projectIdentifier: 'test',
    stages: [
      {
        stage: {
          name: 'stagea',
          identifier: 'stagea',
          description: '',
          type: 'Deployment',
          spec: {
            serviceConfig: {
              serviceDefinition: {
                type: 'Kubernetes',
                spec: {
                  artifacts: {
                    sidecars: [
                      {
                        sidecar: {
                          type: 'Gcr',
                          spec: {
                            connectorRef: 'testgcp1a',
                            imagePath: 'kjlklk',
                            registryHostname: '<+input>',
                            tag: '<+input>'
                          },
                          identifier: 'klk'
                        }
                      }
                    ],
                    primary: {
                      type: 'DockerRegistry',
                      spec: {
                        connectorRef: '<+input>',
                        imagePath: 'jkjkj',
                        tag: '<+input>'
                      }
                    }
                  },
                  variables: [
                    {
                      name: 'test',
                      type: 'String',
                      value: 'test'
                    },
                    {
                      name: 'connectorRef',
                      type: 'String',
                      value: 'terraform_repo'
                    }
                  ],
                  manifestOverrideSets: [],
                  manifests: [
                    {
                      manifest: {
                        identifier: 'dsfds',
                        type: 'HelmChart',
                        spec: {
                          store: {
                            type: 'S3',
                            spec: {
                              connectorRef: 'awsconnectora',
                              bucketName: 'sdfdsfd',
                              folderPath: 'dsfd',
                              region: '<+input>'
                            }
                          },
                          chartName: 'dsfds',
                          chartVersion: 'dfds',
                          helmVersion: 'V2',
                          skipResourceVersioning: false
                        }
                      }
                    }
                  ]
                }
              },
              serviceRef: 'seveice'
            },
            infrastructure: {
              environmentRef: 'TestEnv',
              infrastructureDefinition: {
                type: 'KubernetesDirect',
                spec: {
                  connectorRef: 'testk8s',
                  namespace: 'test',
                  releaseName: 'sdfs'
                },
                provisioner: {
                  steps: [
                    {
                      step: {
                        type: 'TerraformPlan',
                        name: 'testtf-plan-1',
                        identifier: 'testtfplan1',
                        spec: {
                          configuration: {
                            command: 'Apply',
                            workspace: 'dsfds',
                            configFiles: {
                              store: {
                                type: 'Git',
                                spec: {
                                  gitFetchType: 'Branch',
                                  connectorRef: 'fghgfhg',
                                  branch: 'sdfds',
                                  folderPath: 'sdfds'
                                }
                              }
                            },
                            secretManagerRef: '<+input>',
                            varFiles: [
                              {
                                varFile: {
                                  type: 'Remote',
                                  identifier: 'dsfds',
                                  spec: {
                                    store: {
                                      type: 'Github',
                                      spec: {
                                        gitFetchType: 'Branch',
                                        branch: 'sdfds',
                                        paths: ['sdfds'],
                                        connectorRef: '<+input>'
                                      }
                                    }
                                  }
                                }
                              }
                            ],
                            targets: '<+input>'
                          },
                          provisionerIdentifier: '<+input>'
                        },
                        timeout: '10m'
                      }
                    },
                    {
                      step: {
                        type: 'TerraformApply',
                        name: 'tf-apply-a',
                        identifier: 'tfapplya',
                        spec: {
                          provisionerIdentifier: 'test',
                          configuration: {
                            type: 'Inline',
                            spec: {
                              workspace: 'sdfds',
                              configFiles: {
                                store: {
                                  type: 'Git',
                                  spec: {
                                    gitFetchType: 'Branch',
                                    connectorRef: 'dsfds',
                                    branch: 'sdfds',
                                    folderPath: 'sdfds'
                                  }
                                }
                              },
                              varFiles: [
                                {
                                  varFile: {
                                    type: 'Remote',
                                    identifier: 'testremoteid',
                                    spec: {
                                      store: {
                                        type: 'Github',
                                        spec: {
                                          gitFetchType: 'Branch',
                                          branch: 'sdfds',
                                          paths: ['dsfds'],
                                          connectorRef: '<+input>'
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        },
                        timeout: '10m'
                      }
                    },
                    {
                      step: {
                        type: 'TerraformPlan',
                        name: 'tf-plan-step2',
                        identifier: 'tfplanstep2',
                        spec: {
                          configuration: {
                            command: 'Apply',
                            configFiles: {
                              store: {
                                type: 'Git',
                                spec: {
                                  gitFetchType: 'Branch',
                                  connectorRef: 'dsfds',
                                  branch: 'testbrancht',
                                  folderPath: 'testfolder'
                                }
                              }
                            },
                            secretManagerRef: 'harnessSecretManager'
                          },
                          provisionerIdentifier: 'id-1'
                        },
                        timeout: '10m'
                      }
                    }
                  ]
                }
              },
              allowSimultaneousDeployments: false,
              infrastructureKey: 'sdfds'
            },
            execution: {
              steps: [
                {
                  step: {
                    type: 'K8sDelete',
                    name: 'delete-manifest',
                    identifier: 'deletemanifest',
                    spec: {
                      deleteResources: {
                        type: 'ManifestPath',
                        spec: {
                          manifestPaths: ['sdfdsfds', '', '']
                        }
                      }
                    },
                    timeout: '10m'
                  }
                }
              ],
              rollbackSteps: [
                {
                  step: {
                    name: 'Rollback Rollout Deployment',
                    identifier: 'rollbackRolloutDeployment',
                    type: 'K8sRollingRollback',
                    timeout: '10m',
                    spec: {}
                  }
                }
              ]
            },
            serviceDependencies: []
          },
          tags: {},
          failureStrategies: [
            {
              onFailure: {
                errors: ['AllErrors'],
                action: {
                  type: 'StageRollback'
                }
              }
            }
          ]
        }
      }
    ]
  },
  pipeline: {
    identifier: 'pipe11',
    name: 'pipe11',
    orgIdentifier: 'default',
    projectIdentifier: 'test',
    stages: [
      {
        stage: {
          name: 'stagea',
          identifier: 'stagea',
          description: '',
          type: 'Deployment',
          spec: {
            serviceConfig: {
              serviceDefinition: {
                type: 'Kubernetes',
                spec: {
                  artifacts: {
                    sidecars: [
                      {
                        sidecar: {
                          type: 'Gcr',
                          spec: {
                            connectorRef: 'testgcp1a',
                            imagePath: 'kjlklk',
                            registryHostname: '<+input>',
                            tag: '<+input>'
                          },
                          identifier: 'klk'
                        }
                      }
                    ],
                    primary: {
                      type: 'DockerRegistry',
                      spec: {
                        connectorRef: '<+input>',
                        imagePath: 'jkjkj',
                        tag: '<+input>'
                      }
                    }
                  },
                  variables: [
                    {
                      name: 'test',
                      type: 'String',
                      value: 'test'
                    },
                    {
                      name: 'connectorRef',
                      type: 'String',
                      value: 'terraform_repo'
                    }
                  ],
                  manifestOverrideSets: [],
                  manifests: [
                    {
                      manifest: {
                        identifier: 'dsfds',
                        type: 'HelmChart',
                        spec: {
                          store: {
                            type: 'S3',
                            spec: {
                              connectorRef: 'awsconnectora',
                              bucketName: 'sdfdsfd',
                              folderPath: 'dsfd',
                              region: '<+input>'
                            }
                          },
                          chartName: 'dsfds',
                          chartVersion: 'dfds',
                          helmVersion: 'V2',
                          skipResourceVersioning: false
                        }
                      }
                    }
                  ]
                }
              },
              serviceRef: 'seveice'
            },
            infrastructure: {
              environmentRef: 'TestEnv',
              infrastructureDefinition: {
                type: 'KubernetesDirect',
                spec: {
                  connectorRef: 'testk8s',
                  namespace: 'test',
                  releaseName: 'sdfs'
                },
                provisioner: {
                  steps: [
                    {
                      step: {
                        type: 'TerraformPlan',
                        name: 'testtf-plan-1',
                        identifier: 'testtfplan1',
                        spec: {
                          configuration: {
                            command: 'Apply',
                            workspace: 'dsfds',
                            configFiles: {
                              store: {
                                type: 'Git',
                                spec: {
                                  gitFetchType: 'Branch',
                                  connectorRef: 'fghgfhg',
                                  branch: 'sdfds',
                                  folderPath: 'sdfds'
                                }
                              }
                            },
                            secretManagerRef: '<+input>',
                            varFiles: [
                              {
                                varFile: {
                                  type: 'Remote',
                                  identifier: 'dsfds',
                                  spec: {
                                    store: {
                                      type: 'Github',
                                      spec: {
                                        gitFetchType: 'Branch',
                                        branch: 'sdfds',
                                        paths: ['sdfds'],
                                        connectorRef: '<+input>'
                                      }
                                    }
                                  }
                                }
                              }
                            ],
                            targets: '<+input>'
                          },
                          provisionerIdentifier: '<+input>'
                        },
                        timeout: '10m'
                      }
                    },
                    {
                      step: {
                        type: 'TerraformApply',
                        name: 'tf-apply-a',
                        identifier: 'tfapplya',
                        spec: {
                          provisionerIdentifier: 'test',
                          configuration: {
                            type: 'Inline',
                            spec: {
                              workspace: 'sdfds',
                              configFiles: {
                                store: {
                                  type: 'Git',
                                  spec: {
                                    gitFetchType: 'Branch',
                                    connectorRef: 'dsfds',
                                    branch: 'sdfds',
                                    folderPath: 'sdfds'
                                  }
                                }
                              },
                              varFiles: [
                                {
                                  varFile: {
                                    type: 'Remote',
                                    identifier: 'testremoteid',
                                    spec: {
                                      store: {
                                        type: 'Github',
                                        spec: {
                                          gitFetchType: 'Branch',
                                          branch: 'sdfds',
                                          paths: ['dsfds'],
                                          connectorRef: '<+input>'
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        },
                        timeout: '10m'
                      }
                    },
                    {
                      step: {
                        type: 'TerraformPlan',
                        name: 'tf-plan-step2',
                        identifier: 'tfplanstep2',
                        spec: {
                          configuration: {
                            command: 'Apply',
                            configFiles: {
                              store: {
                                type: 'Git',
                                spec: {
                                  gitFetchType: 'Branch',
                                  connectorRef: 'dsfds',
                                  branch: 'testbrancht',
                                  folderPath: 'testfolder'
                                }
                              }
                            },
                            secretManagerRef: 'harnessSecretManager'
                          },
                          provisionerIdentifier: 'id-1'
                        },
                        timeout: '10m'
                      }
                    }
                  ]
                }
              },
              allowSimultaneousDeployments: false,
              infrastructureKey: 'sdfds'
            },
            execution: {
              steps: [
                {
                  step: {
                    type: 'K8sDelete',
                    name: 'delete-manifest',
                    identifier: 'deletemanifest',
                    spec: {
                      deleteResources: {
                        type: 'ManifestPath',
                        spec: {
                          manifestPaths: ['sdfdsfds', '', '']
                        }
                      }
                    },
                    timeout: '10m'
                  }
                }
              ],
              rollbackSteps: [
                {
                  step: {
                    name: 'Rollback Rollout Deployment',
                    identifier: 'rollbackRolloutDeployment',
                    type: 'K8sRollingRollback',
                    timeout: '10m',
                    spec: {}
                  }
                }
              ]
            },
            serviceDependencies: []
          },
          tags: {},
          failureStrategies: [
            {
              onFailure: {
                errors: ['AllErrors'],
                action: {
                  type: 'StageRollback'
                }
              }
            }
          ]
        }
      }
    ]
  },
  inputSetTemplateYamlObj: {
    pipeline: {
      identifier: 'pipe11',
      stages: [
        {
          stage: {
            identifier: 'stagea',
            type: 'Deployment',
            spec: {
              serviceConfig: {
                serviceDefinition: {
                  type: 'Kubernetes',
                  spec: {
                    artifacts: {
                      sidecars: [
                        {
                          sidecar: {
                            identifier: 'klk',
                            type: 'Gcr',
                            spec: {
                              registryHostname: '<+input>',
                              tag: '<+input>'
                            }
                          }
                        }
                      ],
                      primary: {
                        type: 'DockerRegistry',
                        spec: {
                          connectorRef: '<+input>',
                          tag: '<+input>'
                        }
                      }
                    },
                    manifests: [
                      {
                        manifest: {
                          identifier: 'dsfds',
                          type: 'HelmChart',
                          spec: {
                            store: {
                              type: 'S3',
                              spec: {
                                region: '<+input>'
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              },
              infrastructure: {
                infrastructureDefinition: {
                  type: 'KubernetesDirect',
                  provisioner: {
                    steps: [
                      {
                        step: {
                          identifier: 'testtfplan1',
                          type: 'TerraformPlan',
                          spec: {
                            configuration: {
                              secretManagerRef: '<+input>',
                              varFiles: [
                                {
                                  varFile: {
                                    identifier: 'dsfds',
                                    type: 'Remote',
                                    spec: {
                                      store: {
                                        type: 'Github',
                                        spec: {
                                          connectorRef: '<+input>'
                                        }
                                      }
                                    }
                                  }
                                }
                              ],
                              targets: '<+input>'
                            },
                            provisionerIdentifier: '<+input>'
                          }
                        }
                      },
                      {
                        step: {
                          identifier: 'tfapplya',
                          type: 'TerraformApply',
                          spec: {
                            configuration: {
                              type: 'Inline',
                              spec: {
                                varFiles: [
                                  {
                                    varFile: {
                                      identifier: 'testremoteid',
                                      type: 'Remote',
                                      spec: {
                                        store: {
                                          type: 'Github',
                                          spec: {
                                            connectorRef: '<+input>'
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      ]
    }
  },
  tags: {},
  triggerType: 'NewArtifact'
}

jest.mock('@pipeline/factories/ArtifactTriggerInputFactory', () => ({
  getTriggerFormDetails: jest.fn().mockImplementation(() => () => {
    return {
      component: <div>ABC</div>
    }
  })
}))
function WrapperComponent(props: { initialValues: any; isEdit?: boolean }): JSX.Element {
  const { initialValues, isEdit = false } = props
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined} formName="artifactTriggerConfigPanel">
      {formikProps => (
        <FormikForm>
          <TestWrapper path={TEST_PATH} pathParams={params}>
            <ArtifactTriggerConfigPanel formikProps={formikProps} isEdit={isEdit} />
          </TestWrapper>
        </FormikForm>
      )}
    </Formik>
  )
}
describe('Artifact Trigger Config Panel  tests', () => {
  test('inital Render', () => {
    const { container } = render(<WrapperComponent initialValues={iValues} isEdit={false} />)
    expect(container).toMatchSnapshot()
  })

  test('edit render', () => {
    const initialValueObj = {
      ...iValues,

      artifactRef: 'dsfds'
    }
    const { container } = render(<WrapperComponent initialValues={initialValueObj} isEdit={true} />)
    expect(container).toMatchSnapshot()
  })
})
