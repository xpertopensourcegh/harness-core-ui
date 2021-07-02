import React from 'react'
import { act, findByText, fireEvent, queryByAttribute, render, waitFor } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType, StepFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '@pipeline/components/PipelineSteps/Steps/__tests__/StepTestUtil'
import { useGetMonitoredServiceFromServiceAndEnvironment } from 'services/cv'
import { ContinousVerificationStep } from '../ContinousVerificationStep'

const mockedMonitoredServiceAndHealthSources = {
  data: {
    orgIdentifier: 'default',
    projectIdentifier: 'Harshiltest',
    identifier: 'testtest',
    name: 'testtest',
    type: 'Application',
    description: null,
    serviceRef: 'test',
    environmentRef: 'test',
    sources: {
      healthSources: [
        {
          name: 'appd-healthsource',
          identifier: 'appd',
          type: 'AppDynamics',
          spec: {
            connectorRef: 'Testappd',
            feature: null,
            appdApplicationName: 'prod',
            appdTierName: 'cv-nextgen',
            metricPacks: [{ identifier: 'Errors' }]
          }
        }
      ]
    }
  }
}

const mockedMonitoredService = {
  data: {
    orgIdentifier: 'default',
    projectIdentifier: 'Harshiltest',
    identifier: 'testtest',
    name: 'testtest',
    type: 'Application',
    description: null,
    serviceRef: 'test',
    environmentRef: 'test',
    sources: {
      healthSources: []
    }
  }
}

const verifyStepInitialValues = {
  name: '',
  type: StepType.Verify,
  identifier: '',
  timeout: '2h',
  spec: {
    monitoredServiceRef: '',
    type: '',
    healthSources: [],
    spec: {
      sensitivity: '',
      duration: '',
      baseline: '',
      trafficsplit: '',
      deploymentTag: ''
    }
  }
}

jest.mock('services/cv', () => ({
  useGetMonitoredServiceFromServiceAndEnvironment: jest
    .fn()
    .mockImplementation(() => ({ loading: false, data: mockedMonitoredServiceAndHealthSources, error: false })),
  useCreateDefaultMonitoredService: jest.fn().mockImplementation(() => ({
    metaData: {},
    resource: {},
    responseMessages: []
  })),
  useListBaselineExecutions: jest.fn().mockImplementation(() => ({
    metaData: {},
    resource: [],
    responseMessages: []
  }))
}))

jest.mock('@common/components/YAMLBuilder/YamlBuilder')

describe('Test ContinousVerificationStep Step', () => {
  beforeEach(() => {
    factory.registerStep(new ContinousVerificationStep())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render editView when a new step is added', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.Verify} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })

  test('should render editView when current step is being edited', () => {
    const initialValues = {
      name: 'CV Step',
      type: 'ContinousVerification',
      identifier: 'ContinousVerification',
      timeout: '2h',
      spec: {
        monitoredServiceRef: 'monitored-service',
        type: 'Rolling',
        healthSources: [],
        spec: {
          sensitivity: 'Low',
          duration: '15min',
          baseline: 'Last successful job run',
          trafficsplit: '5%',
          deploymentTag: '1.2'
        }
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.Verify} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })

  test('should render editView when current step is being edited and runtime inputs are passed', () => {
    const initialValues = {
      name: 'CV Step',
      type: 'ContinousVerification',
      identifier: 'ContinousVerification',
      timeout: '2h',
      spec: {
        monitoredServiceRef: 'monitored-service',
        type: 'Rolling',
        healthSources: [],
        spec: {
          sensitivity: RUNTIME_INPUT_VALUE,
          duration: RUNTIME_INPUT_VALUE,
          baseline: RUNTIME_INPUT_VALUE,
          trafficsplit: RUNTIME_INPUT_VALUE,
          deploymentTag: '1.2'
        }
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.Verify} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })

  test('renders inputSetView', () => {
    const onUpdate = jest.fn()
    const initialValues = {
      name: 'CV Step',
      type: 'ContinousVerification',
      identifier: 'ContinousVerification',
      timeout: '2h',
      spec: {
        monitoredServiceRef: 'monitored-service',
        type: 'Rolling',
        healthSources: [],
        spec: {
          sensitivity: RUNTIME_INPUT_VALUE,
          duration: RUNTIME_INPUT_VALUE,
          baseline: RUNTIME_INPUT_VALUE,
          trafficsplit: RUNTIME_INPUT_VALUE,
          deploymentTag: '1.2'
        }
      }
    }
    const { container } = render(
      <TestStepWidget
        initialValues={{}}
        template={initialValues}
        type={StepType.Verify}
        stepViewType={StepViewType.InputSet}
        onUpdate={onUpdate}
      />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders empty inputSetView', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} template={{}} type={StepType.Verify} stepViewType={StepViewType.InputSet} />
    )
    expect(container).toMatchSnapshot()
  })

  test('Verify when Monitored service and HealthSource is present for a given service and environment and selected type is rolling update.', async () => {
    const onUpdate = jest.fn()
    const ref = React.createRef<StepFormikRef<unknown>>()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={verifyStepInitialValues}
        type={StepType.Verify}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
        ref={ref}
      />
    )

    // entering the step name
    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'CV Step' } })

    // Verify if correct monitoring service is present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.monitoredService.label')).toBeTruthy()
      const monitoredService = container.querySelector('input[name="spec.monitoredServiceRef"]') as HTMLInputElement
      expect(monitoredService).toBeTruthy()
      expect(monitoredService.value).toBe(mockedMonitoredServiceAndHealthSources.data.name)
    })

    // Verify if correct health source is present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.healthSources.label')).toBeTruthy()
      for (const healthSource of mockedMonitoredServiceAndHealthSources.data.sources.healthSources) {
        expect(getByText(healthSource.name)).toBeTruthy()
      }
    })

    //verify if the continous verification type is getting selected correctly.
    const verificationTypeDropdown = container.querySelector('input[name="spec.type"]') as HTMLInputElement
    const selectCaret = container
      .querySelector(`[name="spec.type"] + [class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="caret-down"]')
    await waitFor(() => {
      fireEvent.click(selectCaret!)
    })
    const typeToSelect = await findByText(container, 'Rolling Update')
    act(() => {
      fireEvent.click(typeToSelect)
    })
    expect(verificationTypeDropdown.value).toBe('Rolling Update')

    // verify if the correct fields are present for the selected verification type
    await waitFor(() => {
      const sensitivityDropdown = container.querySelector('input[name="spec.spec.sensitivity"]') as HTMLInputElement
      const durationDropdown = container.querySelector('input[name="spec.spec.duration"]') as HTMLInputElement
      const trafficsplitDropdown = container.querySelector('input[name="spec.spec.trafficsplit"]') as HTMLInputElement
      const deploymentTagField = container.querySelector('input[name="spec.spec.deploymentTag"]') as HTMLInputElement

      expect(sensitivityDropdown).toBeTruthy()
      expect(durationDropdown).toBeTruthy()
      expect(deploymentTagField).toBeTruthy()
      expect(trafficsplitDropdown).toBeTruthy()
    })
  })

  test('Verify when Monitored service and HealthSource is present for a given service and environment and selected type is Load Test.', async () => {
    const onUpdate = jest.fn()
    const ref = React.createRef<StepFormikRef<unknown>>()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={verifyStepInitialValues}
        type={StepType.Verify}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
        ref={ref}
      />
    )

    // entering the step name
    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'CV Step' } })

    // Verify if correct monitoring service is present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.monitoredService.label')).toBeTruthy()
      const monitoredService = container.querySelector('input[name="spec.monitoredServiceRef"]') as HTMLInputElement
      expect(monitoredService).toBeTruthy()
      expect(monitoredService.value).toBe(mockedMonitoredServiceAndHealthSources.data.name)
    })

    // Verify if the correct health sources are present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.healthSources.label')).toBeTruthy()
      for (const healthSource of mockedMonitoredServiceAndHealthSources.data.sources.healthSources) {
        expect(getByText(healthSource.name)).toBeTruthy()
      }
    })

    //verify if the continous verification type is getting selected correctly.
    const verificationTypeDropdown = container.querySelector('input[name="spec.type"]') as HTMLInputElement
    const selectCaret = container
      .querySelector(`[name="spec.type"] + [class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="caret-down"]')
    await waitFor(() => {
      fireEvent.click(selectCaret!)
    })
    const typeToSelect = await findByText(container, 'Load Test')
    act(() => {
      fireEvent.click(typeToSelect)
    })
    expect(verificationTypeDropdown.value).toBe('Load Test')

    // verify if the correct fields are present for the selected verification type
    await waitFor(() => {
      const sensitivityDropdown = container.querySelector('input[name="spec.spec.sensitivity"]') as HTMLInputElement
      const durationDropdown = container.querySelector('input[name="spec.spec.duration"]') as HTMLInputElement
      const baselineDropdown = container.querySelector('input[name="spec.spec.baseline"]') as HTMLInputElement
      const deploymentTagField = container.querySelector('input[name="spec.spec.deploymentTag"]') as HTMLInputElement

      expect(sensitivityDropdown).toBeTruthy()
      expect(durationDropdown).toBeTruthy()
      expect(deploymentTagField).toBeTruthy()
      expect(baselineDropdown).toBeTruthy()
    })
  })

  test('Verify when Monitored service is present and HealthSource is not present for a given service and environment ', async () => {
    ;(useGetMonitoredServiceFromServiceAndEnvironment as jest.Mock).mockImplementation(() => ({
      loading: false,
      data: mockedMonitoredService,
      error: false
    }))
    const onUpdate = jest.fn()
    const ref = React.createRef<StepFormikRef<unknown>>()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={verifyStepInitialValues}
        type={StepType.Verify}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
        ref={ref}
      />
    )

    // entering the step name
    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'CV Step' } })

    // Verify if correct monitoring service is present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.monitoredService.label')).toBeTruthy()
      const monitoredService = container.querySelector('input[name="spec.monitoredServiceRef"]') as HTMLInputElement
      expect(monitoredService).toBeTruthy()
      expect(monitoredService.value).toBe(mockedMonitoredService.data.name)
    })

    // Verify if no health sources are present.
    await waitFor(() => {
      expect(getByText('connectors.cdng.healthSources.label')).toBeTruthy()
      expect(getByText('connectors.cdng.healthSources.noHealthSourcesDefined')).toBeTruthy()
    })

    //verify if the continous verification type is getting selected correctly.
    const verificationTypeDropdown = container.querySelector('input[name="spec.type"]') as HTMLInputElement
    const selectCaret = container
      .querySelector(`[name="spec.type"] + [class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="caret-down"]')
    await waitFor(() => {
      fireEvent.click(selectCaret!)
    })
    const typeToSelect = await findByText(container, 'Load Test')
    act(() => {
      fireEvent.click(typeToSelect)
    })
    expect(verificationTypeDropdown.value).toBe('Load Test')

    // verify if the correct fields are present for the selected verification type
    await waitFor(() => {
      const sensitivityDropdown = container.querySelector('input[name="spec.spec.sensitivity"]') as HTMLInputElement
      const durationDropdown = container.querySelector('input[name="spec.spec.duration"]') as HTMLInputElement
      const baselineDropdown = container.querySelector('input[name="spec.spec.baseline"]') as HTMLInputElement
      const deploymentTagField = container.querySelector('input[name="spec.spec.deploymentTag"]') as HTMLInputElement

      expect(sensitivityDropdown).toBeTruthy()
      expect(durationDropdown).toBeTruthy()
      expect(deploymentTagField).toBeTruthy()
      expect(baselineDropdown).toBeTruthy()
    })
  })

  test('Verify when Monitored service and HealthSource both are not present for a given service and environment ', async () => {
    ;(useGetMonitoredServiceFromServiceAndEnvironment as jest.Mock).mockImplementation(() => ({
      loading: false,
      data: { data: null },
      error: false
    }))

    const onUpdate = jest.fn()
    const ref = React.createRef<StepFormikRef<unknown>>()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={verifyStepInitialValues}
        type={StepType.Verify}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
        ref={ref}
      />
    )

    // entering the step name
    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'CV Step' } })

    // Verify that no monitoring source is present
    await waitFor(() => {
      expect(getByText('connectors.cdng.monitoredService.label')).toBeTruthy()
      //Verify to see if autocreate Monitored service link is present.
      const autoCreateMonitoredServiceLink = getByText('connectors.cdng.monitoredService.autoCreateMonitoredService')
      expect(autoCreateMonitoredServiceLink).toBeTruthy()
    })
  })
})
