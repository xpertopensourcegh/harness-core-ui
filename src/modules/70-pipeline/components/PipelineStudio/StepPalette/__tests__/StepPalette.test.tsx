import React from 'react'
import type { UseGetReturn } from 'restful-react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import type { IconName } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import * as pipelinesNgService from 'services/pipeline-ng'
import { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { Step, StepProps } from '@pipeline/components/AbstractSteps/Step'
import { StageType } from '@pipeline/utils/stageHelpers'
import type { StringsMap } from 'framework/strings/StringsContext'
import { StepPalette } from '../StepPalette'

class StepFactory extends AbstractStepFactory {
  protected type = 'test-factory'
  protected stepName = 'stepOne'
  protected stepIcon: IconName = 'cross'
}

class StepOne extends Step<any> {
  protected type = StepType.KubernetesDirect
  protected stepName = 'stepOne'
  protected stepIcon: IconName = 'cross'
  protected stepDescription: keyof StringsMap = 'Awesome description about step s1' as keyof StringsMap
  validateInputSet(): any {
    return {}
  }
  protected defaultValues = { a: 'a' }
  renderStep(props: StepProps<any>): JSX.Element {
    return <div onClick={() => props.onUpdate?.(props.initialValues)}>{JSON.stringify(props.initialValues)}</div>
  }
}

const stepFactory = new StepFactory()
stepFactory.registerStep(new StepOne())

const getProps = () => ({
  onSelect: jest.fn(),
  onClose: jest.fn(),
  stepsFactory: stepFactory,
  selectedStage: {},
  stageType: StageType.DEPLOY
})

describe('Step Palette tests', () => {
  const spy = jest.spyOn(pipelinesNgService, 'useGetSteps')
  spy.mockReturnValue({
    loading: false,
    error: null,
    data: {
      status: 'SUCCESS',
      data: {
        name: 'Library',
        stepCategories: [
          {
            name: 'K8',
            stepCategories: [],
            stepsData: [
              {
                name: 's1',
                type: StepType.KubernetesDirect
              },
              {
                name: 's2',
                type: 't2'
              }
            ]
          },
          {
            name: 'Utilities',
            stepCategories: [
              {
                name: 'Scripted',
                stepsData: [
                  {
                    name: 's3',
                    type: 't3'
                  },
                  {
                    name: 's4',
                    type: 't4'
                  }
                ]
              }
            ],
            stepsData: []
          }
        ],
        stepsData: []
      },
      metaData: null as unknown as undefined,
      correlationId: 'someId'
    }
  } as UseGetReturn<any, pipelinesNgService.Failure, any, unknown>)

  test('Show all steps count and filters correctly', async () => {
    const props = getProps()
    const { container, queryByText } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )

    expect(queryByText('Show All Steps (4)')).toBeDefined()
    expect(container.getElementsByClassName('paletteCard')).toHaveLength(4)
    fireEvent.change(container.querySelector('input[type="search"]')!, { target: { value: 'tttt' } })
    await waitFor(() => expect(queryByText('stepPalette.noSearchResultsFound')).not.toBeNull())
  })

  test('clicking on category should display steps which are falling under that category', async () => {
    const props = getProps()
    const { container, queryByText, getByText } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )

    expect(queryByText('Show All Steps (4)')).toBeDefined()
    expect(container.getElementsByClassName('paletteCard')).toHaveLength(4)
    // Click on K8 category
    const k8Category = queryByText('K8 (2)')
    act(() => {
      fireEvent.click(k8Category!)
    })
    expect(getByText('K8')).toBeDefined()
    expect(container.getElementsByClassName('paletteCard')).toHaveLength(2)
  })

  test('clicking on step category should display steps which are falling under that step category', async () => {
    const props = getProps()
    const { container, queryByText, getByText } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )

    expect(queryByText('Show All Steps (4)')).toBeDefined()
    expect(container.getElementsByClassName('paletteCard')).toHaveLength(4)
    // Click on K8 category
    const scriptedStepCategory = queryByText('Scripted (2)')
    act(() => {
      fireEvent.click(scriptedStepCategory!)
    })
    expect(getByText('Utilities')).toBeDefined()
    expect(container.getElementsByClassName('paletteCard')).toHaveLength(2)
  })

  test('Hover over step and select it', async () => {
    const props = getProps()
    const { getByText, queryByText, getByTestId } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )
    expect(queryByText('Show All Steps (4)')).toBeDefined()

    const stepLibraryHeader = getByText('stepPalette.title')
    expect(stepLibraryHeader).toBeInTheDocument()

    // Hover over step card
    const stepCard = getByTestId('step-card-s1')
    act(() => {
      fireEvent.mouseEnter(stepCard!)
    })
    await waitFor(() => expect(getByText('Awesome description about step s1')).toBeInTheDocument())

    // Click on step card
    const stepSection = getByText('s1').closest('section')?.parentElement
    act(() => {
      fireEvent.click(stepSection!)
    })
    await waitFor(() => expect(props.onSelect).toBeCalled())
    expect(props.onSelect).toBeCalledWith({ icon: 'cross', name: 's1', type: 'KubernetesDirect' })
  })

  test('Loading indicator', () => {
    const props = getProps()
    spy.mockReturnValue({
      loading: true,
      error: null,
      data: {
        status: 'SUCCESS',
        data: {
          name: 'Library',
          stepCategories: [],
          stepsData: []
        },
        metaData: null as unknown as undefined,
        correlationId: 'someId'
      }
    } as UseGetReturn<any, pipelinesNgService.Failure, any, unknown>)
    const { queryByText } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )

    expect(queryByText('stepPalette.noSearchResultsFound')).toBeNull()
    expect(queryByText('Loading steps...')).toBeDefined()
    expect(queryByText('Show All Steps (0)')).toBeDefined()
  })

  test('No data indicator', () => {
    const props = getProps()
    spy.mockReturnValue({
      loading: false,
      error: null,
      data: {
        status: 'SUCCESS',
        data: {
          name: 'Library',
          stepCategories: [],
          stepsData: []
        },
        metaData: null as unknown as undefined,
        correlationId: 'someId'
      }
    } as UseGetReturn<any, pipelinesNgService.Failure, any, unknown>)
    const { queryByText } = render(
      <TestWrapper>
        <StepPalette {...props} />
      </TestWrapper>
    )

    expect(queryByText('stepPalette.noSearchResultsFound')).toBeDefined()
    expect(queryByText('Show All Steps (0)')).toBeDefined()
  })
})
