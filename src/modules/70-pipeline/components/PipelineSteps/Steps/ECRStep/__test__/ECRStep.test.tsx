import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { ECRStep } from '../ECRStep'

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

describe('ECR Step', () => {
  beforeAll(() => {
    factory.registerStep(new ECRStep())
  })

  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.ECR} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders runtime inputs', async () => {
    const initialValues = {
      identifier: 'My_ECR_Step',
      name: 'My ECR Step',
      timeout: '${input}',
      spec: {
        connectorRef: '${input}',
        region: '${input}',
        account: '${input}',
        imageName: '${input}',
        tags: '${input}',
        dockerfile: '${input}',
        context: '${input}',
        labels: '${input}',
        buildArgs: '${input}',
        target: '${input}',
        // TODO: Right now we do not support Image Pull Policy but will do in the future
        // pull: '${input}',
        resources: {
          limits: {
            cpu: '${input}',
            memory: '${input}'
          }
        }
      }
    }
    const onUpdate = jest.fn()
    const { container, getByTestId } = render(
      <TestStepWidget
        initialValues={initialValues}
        type={StepType.ECR}
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
      identifier: 'My_ECR_Step',
      name: 'My ECR Step',
      timeout: '10s',
      spec: {
        connectorRef: 'account.connectorRef',
        region: 'Region',
        account: 'Account',
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
        type={StepType.ECR}
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
