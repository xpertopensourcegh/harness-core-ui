import React from 'react'
import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { FlagConfigurationStepWidget, FlagConfigurationStepWidgetProps } from '../FlagConfigurationStepWidget'

jest.mock('services/cf', () => ({
  useGetAllFeatures: jest.fn().mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() }),
  useGetAllSegments: jest.fn().mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() }),
  useGetAllTargetAttributes: jest.fn().mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() }),
  useGetAllTargets: jest.fn().mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() })
}))

jest.mock('@cf/hooks/useEnvironmentSelectV2', () => ({
  useEnvironmentSelectV2: jest.fn().mockReturnValue({
    EnvironmentSelect: jest.fn().mockReturnValue(<span />),
    loading: false,
    error: null,
    refetch: jest.fn(),
    environments: []
  })
}))

jest.mock('@pipeline/components/AbstractSteps/Step', () => ({
  setFormikRef: jest.fn()
}))

const renderComponent = (props: Partial<FlagConfigurationStepWidgetProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <FlagConfigurationStepWidget
        initialValues={{ spec: {} } as FlagConfigurationStepWidgetProps['initialValues']}
        readonly={false}
        {...props}
      />
    </TestWrapper>
  )

describe('FlagConfigurationStepWidget', () => {
  test('it should render', async () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
