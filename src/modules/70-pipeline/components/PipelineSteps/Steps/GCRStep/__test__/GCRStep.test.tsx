import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { GCRStep } from '../GCRStep'

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

describe('GCR Step', () => {
  beforeAll(() => {
    factory.registerStep(new GCRStep())
  })

  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.GCR} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders runtime inputs', async () => {
    const initialValues = {
      identifier: 'My_GCR_Step',
      name: 'My GCR Step',
      timeout: RUNTIME_INPUT_VALUE,
      spec: {
        connectorRef: RUNTIME_INPUT_VALUE,
        host: RUNTIME_INPUT_VALUE,
        projectID: RUNTIME_INPUT_VALUE,
        imageName: RUNTIME_INPUT_VALUE,
        tags: RUNTIME_INPUT_VALUE,
        dockerfile: RUNTIME_INPUT_VALUE,
        context: RUNTIME_INPUT_VALUE,
        labels: RUNTIME_INPUT_VALUE,
        buildArgs: RUNTIME_INPUT_VALUE,
        target: RUNTIME_INPUT_VALUE,
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
        type={StepType.GCR}
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
      identifier: 'My_GCR_Step',
      name: 'My GCR Step',
      timeout: '10s',
      spec: {
        connectorRef: 'account.connectorRef',
        host: 'Host',
        projectID: 'Project ID',
        imageName: 'Image Name',
        tags: ['tag1', 'tag2', 'tag3'],
        dockerfile: 'Dockerfile',
        context: 'Context',
        labels: {
          label1: 'value1',
          label2: 'value2',
          label3: 'value3'
        },
        buildArgs: {
          buildArg1: 'value1',
          buildArg2: 'value2',
          buildArg3: 'value3'
        },
        target: 'Target',
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
        type={StepType.GCR}
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
