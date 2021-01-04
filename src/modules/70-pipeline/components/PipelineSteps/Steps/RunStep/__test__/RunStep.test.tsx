import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
// import { render, queryByAttribute, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uikit'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { RunStep } from '../RunStep'

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

describe('Run Step', () => {
  beforeAll(() => {
    factory.registerStep(new RunStep())
  })

  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.Run} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders runtime inputs', async () => {
    const initialValues = {
      identifier: 'My_Run_Step',
      name: 'My Run Step',
      description: RUNTIME_INPUT_VALUE,
      timeout: RUNTIME_INPUT_VALUE,
      spec: {
        connectorRef: RUNTIME_INPUT_VALUE,
        image: RUNTIME_INPUT_VALUE,
        command: RUNTIME_INPUT_VALUE,
        reports: {
          type: 'JUnit',
          spec: {
            paths: RUNTIME_INPUT_VALUE
          }
        },
        envVariables: RUNTIME_INPUT_VALUE,
        outputVariables: RUNTIME_INPUT_VALUE,
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
        type={StepType.Run}
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
      name: 'My Run Step',
      description: 'Description',
      timeout: '10s',
      spec: {
        connectorRef: 'account.connectorRef',
        image: 'image',
        command: 'command',
        reports: {
          type: 'JUnit',
          spec: {
            paths: ['path1.xml', 'path2.xml', 'path3.xml', 'path4.xml', 'path5.xml']
          }
        },
        envVariables: {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3'
        },
        outputVariables: ['variable1', 'variable2', 'variable3', 'variable4'],
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
        type={StepType.Run}
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

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('form produces correct data for fixed inputs', async () => {
  //   const onUpdate = jest.fn()
  //   const { container, getByTestId } = render(
  //     <TestStepWidget
  //       initialValues={{ spec: { connectorRef: 'account.connectorRef' } }}
  //       type={StepType.Run}
  //       stepViewType={StepViewType.Edit}
  //       onUpdate={onUpdate}
  //     />
  //   )

  //   const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)

  //   const addPath = getByTestId('add-path')
  //   const addEnvVariable = getByTestId('add-envVariable')
  //   const addOutputVariable = getByTestId('add-outputVariable')

  //   await act(async () => {
  //     fireEvent.click(addPath)
  //     fireEvent.click(addPath)
  //     fireEvent.click(addPath)
  //     fireEvent.click(addPath)

  //     fireEvent.click(addEnvVariable)
  //     fireEvent.click(addEnvVariable)

  //     fireEvent.click(addOutputVariable)
  //     fireEvent.click(addOutputVariable)
  //     fireEvent.click(addOutputVariable)
  //   })

  //   await act(async () => {
  //     fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'My Run Step' } })
  //     fireEvent.change(queryByNameAttribute('description')!, { target: { value: 'Description' } })
  //     // fireEvent.change(queryByNameAttribute('spec.connectorRef')!, { target: { value: 'account.connectorRef' } })
  //     fireEvent.change(queryByNameAttribute('spec.image')!, { target: { value: 'image' } })
  //     fireEvent.change(queryByNameAttribute('spec.command')!, { target: { value: 'command' } })

  //     fireEvent.change(queryByNameAttribute('spec.paths[0].value')!, { target: { value: 'path1.xml' } })
  //     fireEvent.change(queryByNameAttribute('spec.paths[1].value')!, { target: { value: 'path2.xml' } })
  //     fireEvent.change(queryByNameAttribute('spec.paths[2].value')!, { target: { value: 'path3.xml' } })
  //     fireEvent.change(queryByNameAttribute('spec.paths[3].value')!, { target: { value: 'path4.xml' } })
  //     fireEvent.change(queryByNameAttribute('spec.paths[4].value')!, { target: { value: 'path5.xml' } })

  //     fireEvent.change(queryByNameAttribute('spec.envVariables[0].key')!, { target: { value: 'key1' } })
  //     fireEvent.change(queryByNameAttribute('spec.envVariables[0].value')!, { target: { value: 'value1' } })
  //     fireEvent.change(queryByNameAttribute('spec.envVariables[1].key')!, { target: { value: 'key2' } })
  //     fireEvent.change(queryByNameAttribute('spec.envVariables[1].value')!, { target: { value: 'value2' } })
  //     fireEvent.change(queryByNameAttribute('spec.envVariables[2].key')!, { target: { value: 'key3' } })
  //     fireEvent.change(queryByNameAttribute('spec.envVariables[2].value')!, { target: { value: 'value3' } })

  //     fireEvent.change(queryByNameAttribute('spec.outputVariables[0].value')!, { target: { value: 'variable1' } })
  //     fireEvent.change(queryByNameAttribute('spec.outputVariables[1].value')!, { target: { value: 'variable2' } })
  //     fireEvent.change(queryByNameAttribute('spec.outputVariables[2].value')!, { target: { value: 'variable3' } })
  //     fireEvent.change(queryByNameAttribute('spec.outputVariables[3].value')!, { target: { value: 'variable4' } })

  //     fireEvent.change(queryByNameAttribute('spec.limitMemory')!, { target: { value: '128Mi' } })
  //     fireEvent.change(queryByNameAttribute('spec.limitCPU')!, { target: { value: '1' } })
  //     fireEvent.change(queryByNameAttribute('timeout')!, { target: { value: '10s' } })

  //     fireEvent.click(getByTestId('submit'))
  //   })

  //   expect(onUpdate).toHaveBeenCalledWith({
  //     identifier: 'My_Run_Step',
  //     name: 'My Run Step',
  //     description: 'Description',
  //     spec: {
  //       connectorRef: 'account.connectorRef',
  //       image: 'image',
  //       command: 'command',
  //       paths: ['path1.xml', 'path2.xml', 'path3.xml', 'path4.xml', 'path5.xml'],
  //       envVariables: {
  //         key1: 'value1',
  //         key2: 'value2',
  //         key3: 'value3'
  //       },
  //       outputVariables: ['variable1', 'variable2', 'variable3', 'variable4'],
  //       // TODO: Right now we do not support Image Pull Policy but will do in the future
  //       // pull: 'ifNotExists',
  //       limitMemory: '128Mi',
  //       limitCPU: '1',
  //       timeout: '10s'
  //     }
  //   })
  // })
})
