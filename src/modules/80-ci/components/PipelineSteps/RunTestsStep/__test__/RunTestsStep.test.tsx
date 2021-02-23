import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import { factory, TestStepWidget } from '@pipeline/components/PipelineSteps/Steps/__tests__/StepTestUtil'
import { RunTestsStep } from '../RunTestsStep'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

export const ConnectorResponse: UseGetReturnData<ResponseConnectorResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      connector: {
        name: 'connectorRef',
        identifier: 'connectorRef',
        description: '',
        tags: {},
        type: 'K8sCluster',
        spec: {
          credential: {
            type: 'ManualConfig',
            spec: {
              masterUrl: 'asd',
              auth: { type: 'UsernamePassword', spec: { username: 'asd', passwordRef: 'account.test1111' } }
            }
          }
        }
      },
      createdAt: 1602062958274,
      lastModifiedAt: 1602062958274
    },
    correlationId: 'e1841cfc-9ed5-4f7c-a87b-c9be1eeaae34'
  }
}

jest.mock('services/cd-ng', () => ({
  useGetConnector: jest.fn(() => ConnectorResponse)
}))

describe('RunTests Step', () => {
  beforeAll(() => {
    factory.registerStep(new RunTestsStep())
  })

  describe('Edit View', () => {
    test('should render properly', () => {
      const { container } = render(
        <TestStepWidget initialValues={{}} type={StepType.RunTests} stepViewType={StepViewType.Edit} />
      )

      expect(container).toMatchSnapshot()
    })

    test('renders runtime inputs', async () => {
      const initialValues = {
        identifier: 'My_Run_Step',
        name: 'My RunTests Step',
        description: RUNTIME_INPUT_VALUE,
        timeout: RUNTIME_INPUT_VALUE,
        spec: {
          connectorRef: RUNTIME_INPUT_VALUE,
          image: RUNTIME_INPUT_VALUE,
          args: RUNTIME_INPUT_VALUE,
          buildTool: RUNTIME_INPUT_VALUE,
          language: RUNTIME_INPUT_VALUE,
          packages: RUNTIME_INPUT_VALUE,
          testAnnotations: RUNTIME_INPUT_VALUE,
          runOnlySelectedTests: RUNTIME_INPUT_VALUE,
          reports: {
            type: 'JUnit',
            spec: {
              paths: RUNTIME_INPUT_VALUE
            }
          },
          // TODO: Right now we do not support Image Pull Policy but will do in the future
          // pull: RUNTIME_INPUT_VALUE,
          resources: {
            limits: {
              cpu: RUNTIME_INPUT_VALUE,
              memory: RUNTIME_INPUT_VALUE
            }
          }
        }
      }

      const onUpdate = jest.fn()

      const { container, getByTestId } = render(
        <TestStepWidget
          initialValues={initialValues}
          type={StepType.RunTests}
          stepViewType={StepViewType.Edit}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()

      await act(async () => {
        fireEvent.click(getByTestId('submit'))
      })

      expect(onUpdate).toHaveBeenCalledWith(initialValues)
    })

    test('edit mode works', async () => {
      const initialValues = {
        identifier: 'My_Run_Step',
        name: 'My RunTests Step',
        description: 'Description',
        timeout: '10s',
        spec: {
          connectorRef: 'account.connectorRef',
          image: 'image',
          args: '-Dmaven.test.failure.ignore=true -T 2C test -e -Dbuild.number=${BUILD_NUMBER}',
          buildTool: 'maven',
          language: 'java',
          packages: 'io.harness., software.wings., migrations.',
          testAnnotations: 'org.junit.Test, org.junit.jupiter.api.Test, org.testng.annotations.Test',
          runOnlySelectedTests: false,
          reports: {
            type: 'JUnit',
            spec: {
              paths: ['path1.xml', 'path2.xml', 'path3.xml', 'path4.xml', 'path5.xml']
            }
          },
          // TODO: Right now we do not support Image Pull Policy but will do in the future
          // pull: 'always',
          resources: {
            limits: {
              memory: '128Mi',
              cpu: '0.2'
            }
          }
        }
      }

      const onUpdate = jest.fn()

      const { container, getByTestId } = render(
        <TestStepWidget
          initialValues={initialValues}
          type={StepType.RunTests}
          stepViewType={StepViewType.Edit}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()

      await act(async () => {
        fireEvent.click(getByTestId('submit'))
      })

      expect(onUpdate).toHaveBeenCalledWith(initialValues)
    })
  })

  describe('InputSet View', () => {
    test('should render properly', () => {
      const { container } = render(
        <TestStepWidget initialValues={{}} type={StepType.RunTests} stepViewType={StepViewType.InputSet} />
      )

      expect(container).toMatchSnapshot()
    })

    test('should render all fields', async () => {
      const template = {
        type: StepType.RunTests,
        identifier: 'My_Run_Step',
        description: RUNTIME_INPUT_VALUE,
        timeout: RUNTIME_INPUT_VALUE,
        spec: {
          connectorRef: RUNTIME_INPUT_VALUE,
          image: RUNTIME_INPUT_VALUE,
          args: RUNTIME_INPUT_VALUE,
          buildTool: RUNTIME_INPUT_VALUE,
          language: RUNTIME_INPUT_VALUE,
          packages: RUNTIME_INPUT_VALUE,
          testAnnotations: RUNTIME_INPUT_VALUE,
          runOnlySelectedTests: RUNTIME_INPUT_VALUE,
          reports: {
            type: 'JUnit',
            spec: {
              paths: RUNTIME_INPUT_VALUE
            }
          },
          // TODO: Right now we do not support Image Pull Policy but will do in the future
          // pull: RUNTIME_INPUT_VALUE,
          resources: {
            limits: {
              cpu: RUNTIME_INPUT_VALUE,
              memory: RUNTIME_INPUT_VALUE
            }
          }
        }
      }

      const allValues = {
        type: StepType.RunTests,
        name: 'Test A',
        identifier: 'My_Run_Step',
        description: RUNTIME_INPUT_VALUE,
        timeout: RUNTIME_INPUT_VALUE,
        spec: {
          connectorRef: RUNTIME_INPUT_VALUE,
          image: RUNTIME_INPUT_VALUE,
          args: RUNTIME_INPUT_VALUE,
          buildTool: RUNTIME_INPUT_VALUE,
          language: RUNTIME_INPUT_VALUE,
          packages: RUNTIME_INPUT_VALUE,
          testAnnotations: RUNTIME_INPUT_VALUE,
          runOnlySelectedTests: RUNTIME_INPUT_VALUE,
          reports: {
            type: 'JUnit',
            spec: {
              paths: RUNTIME_INPUT_VALUE
            }
          },
          // TODO: Right now we do not support Image Pull Policy but will do in the future
          // pull: RUNTIME_INPUT_VALUE,
          resources: {
            limits: {
              cpu: RUNTIME_INPUT_VALUE,
              memory: RUNTIME_INPUT_VALUE
            }
          }
        }
      }

      const onUpdate = jest.fn()

      const { container } = render(
        <TestStepWidget
          initialValues={{}}
          type={StepType.RunTests}
          template={template}
          allValues={allValues}
          stepViewType={StepViewType.InputSet}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()
    })

    test('should not render any fields', async () => {
      const template = {
        type: StepType.RunTests,
        identifier: 'My_Run_Step'
      }

      const allValues = {
        type: StepType.RunTests,
        identifier: 'My_Run_Step',
        name: 'My RunTests Step',
        description: 'Description',
        timeout: '10s',
        spec: {
          connectorRef: 'account.connectorRef',
          image: 'image',
          args: '-Dmaven.test.failure.ignore=true -T 2C test -e -Dbuild.number=${BUILD_NUMBER}',
          buildTool: 'maven',
          language: 'java',
          packages: 'io.harness., software.wings., migrations.',
          testAnnotations: 'org.junit.Test, org.junit.jupiter.api.Test, org.testng.annotations.Test',
          runOnlySelectedTests: false,
          reports: {
            type: 'JUnit',
            spec: {
              paths: ['path1.xml', 'path2.xml', 'path3.xml', 'path4.xml', 'path5.xml']
            }
          },
          // TODO: Right now we do not support Image Pull Policy but will do in the future
          // pull: 'always',
          resources: {
            limits: {
              memory: '128Mi',
              cpu: '0.2'
            }
          }
        }
      }

      const onUpdate = jest.fn()

      const { container } = render(
        <TestStepWidget
          initialValues={{}}
          type={StepType.RunTests}
          template={template}
          allValues={allValues}
          stepViewType={StepViewType.InputSet}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()
    })
  })

  describe('InputVariable View', () => {
    test('should render properly', () => {
      const { container } = render(
        <TestStepWidget
          initialValues={{
            identifier: 'My_Run_Step',
            name: 'My RunTests Step',
            description: 'Description',
            timeout: '10s',
            spec: {
              connectorRef: 'account.connectorRef',
              image: 'image',
              args: '-Dmaven.test.failure.ignore=true -T 2C test -e -Dbuild.number=${BUILD_NUMBER}',
              buildTool: 'maven',
              language: 'java',
              packages: 'io.harness., software.wings., migrations.',
              testAnnotations: 'org.junit.Test, org.junit.jupiter.api.Test, org.testng.annotations.Test',
              runOnlySelectedTests: false,
              reports: {
                type: 'JUnit',
                spec: {
                  paths: ['path1.xml', 'path2.xml', 'path3.xml', 'path4.xml', 'path5.xml']
                }
              },
              // TODO: Right now we do not support Image Pull Policy but will do in the future
              // pull: 'always',
              resources: {
                limits: {
                  memory: '128Mi',
                  cpu: '0.2'
                }
              }
            }
          }}
          customStepProps={{
            stageIdentifier: 'qaStage',
            metadataMap: {
              'step-name': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.name',
                  localName: 'step.runTests.name'
                }
              },
              'step-description': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.description',
                  localName: 'step.runTests.description'
                }
              },
              'step-timeout': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.timeout',
                  localName: 'step.runTests.timeout'
                }
              },
              'step-connectorRef': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.connectorRef',
                  localName: 'step.runTests.spec.connectorRef'
                }
              },
              'step-image': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.image',
                  localName: 'step.runTests.spec.image'
                }
              },
              'step-args': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.args',
                  localName: 'step.runTests.spec.args'
                }
              },
              'step-buildTool': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.buildTool',
                  localName: 'step.runTests.spec.buildTool'
                }
              },
              'step-language': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.language',
                  localName: 'step.runTests.spec.language'
                }
              },
              'step-packages': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.packages',
                  localName: 'step.runTests.spec.packages'
                }
              },
              'step-testAnnotations': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.testAnnotations',
                  localName: 'step.runTests.spec.testAnnotations'
                }
              },
              'step-runOnlySelectedTests': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.runOnlySelectedTests',
                  localName: 'step.runTests.spec.runOnlySelectedTests'
                }
              },
              'step-reportPaths': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.reports.spec.paths',
                  localName: 'step.runTests.spec.reports.spec.paths'
                }
              },
              // TODO: Right now we do not support Image Pull Policy but will do in the future
              // 'step-pull': {
              //   yamlProperties: {
              //     fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.pull',
              //     localName: 'step.runTests.spec.pull'
              //   }
              // },
              'step-limitMemory': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.resources.limits.memory',
                  localName: 'step.runTests.spec.resources.limits.memory'
                }
              },
              'step-limitCPU': {
                yamlProperties: {
                  fqn: 'pipeline.stages.qaStage.execution.steps.runTests.spec.resources.limits.cpu',
                  localName: 'step.runTests.resources.spec.limits.cpu'
                }
              }
            },
            variablesData: {
              type: StepType.RunTests,
              identifier: 'runTests',
              name: 'step-name',
              description: 'step-description',
              timeout: 'step-timeout',
              spec: {
                connectorRef: 'step-connectorRef',
                image: 'step-image',
                args: 'step-args',
                buildTool: 'step-buildTool',
                language: 'step-language',
                packages: 'step-packages',
                testAnnotations: 'step-testAnnotations',
                runOnlySelectedTests: 'step-runOnlySelectedTests',
                reports: {
                  spec: {
                    paths: 'step-reportPaths'
                  }
                },
                // TODO: Right now we do not support Image Pull Policy but will do in the future
                // pull: 'step-pull',
                resources: {
                  limits: {
                    memory: 'step-limitMemory',
                    cpu: 'step-limitCPU'
                  }
                }
              }
            }
          }}
          type={StepType.RunTests}
          stepViewType={StepViewType.InputVariable}
        />
      )

      expect(container).toMatchSnapshot()
    })
  })
})
