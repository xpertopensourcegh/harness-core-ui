import React from 'react'
import { omit, set } from 'lodash-es'
import { render, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { S3Step } from '../S3Step'

const runtimeValues = {
  identifier: 'My_S3_Step',
  name: 'My S3 Step',
  timeout: RUNTIME_INPUT_VALUE,
  spec: {
    connectorRef: RUNTIME_INPUT_VALUE,
    region: RUNTIME_INPUT_VALUE,
    bucket: RUNTIME_INPUT_VALUE,
    sourcePath: RUNTIME_INPUT_VALUE,
    endpoint: RUNTIME_INPUT_VALUE,
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
const fixedValues = {
  identifier: 'My_S3_Step',
  name: 'My S3 Step',
  timeout: '10s',
  spec: {
    connectorRef: 'account.connectorRef',
    region: 'Region',
    bucket: 'Bucket',
    sourcePath: 'Source Path',
    endpoint: 'Endpoint',
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

describe('S3 Step', () => {
  beforeAll(() => {
    factory.registerStep(new S3Step())
  })
  describe('Edit View', () => {
    test('should render properly', () => {
      const { container } = render(
        <TestStepWidget initialValues={{}} type={StepType.S3} stepViewType={StepViewType.Edit} />
      )

      expect(container).toMatchSnapshot()
    })

    test('renders runtime inputs', async () => {
      const onUpdate = jest.fn()
      const { container, getByTestId } = render(
        <TestStepWidget
          initialValues={runtimeValues}
          type={StepType.S3}
          stepViewType={StepViewType.Edit}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()

      await act(async () => {
        fireEvent.click(getByTestId('submit'))
      })
      expect(onUpdate).toHaveBeenCalledWith(runtimeValues)
    })

    test('edit mode works', async () => {
      const onUpdate = jest.fn()
      const { container, getByTestId } = render(
        <TestStepWidget
          initialValues={fixedValues}
          type={StepType.S3}
          stepViewType={StepViewType.Edit}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()

      await act(async () => {
        fireEvent.click(getByTestId('submit'))
      })
      expect(onUpdate).toHaveBeenCalledWith(fixedValues)
    })
  })
  describe('InputSet View', () => {
    test('should render properly', () => {
      const { container } = render(
        <TestStepWidget initialValues={{}} type={StepType.S3} stepViewType={StepViewType.InputSet} />
      )

      expect(container).toMatchSnapshot()
    })

    test('should render all fields', async () => {
      const allValues = set(runtimeValues, 'type', StepType.S3)
      const template = omit(allValues, 'name')

      const onUpdate = jest.fn()

      const { container } = render(
        <TestStepWidget
          initialValues={{}}
          type={StepType.S3}
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
        type: StepType.S3,
        identifier: 'My_S3_Step'
      }

      const allValues = set(fixedValues, 'type', StepType.S3)

      const onUpdate = jest.fn()

      const { container } = render(
        <TestStepWidget
          initialValues={{}}
          type={StepType.S3}
          template={template}
          allValues={allValues}
          stepViewType={StepViewType.InputSet}
          onUpdate={onUpdate}
        />
      )

      expect(container).toMatchSnapshot()
    })
  })
})
