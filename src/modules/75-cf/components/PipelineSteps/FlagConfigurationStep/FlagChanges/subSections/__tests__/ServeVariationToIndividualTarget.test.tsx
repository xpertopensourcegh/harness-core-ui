import React from 'react'
import { act, render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import type { Target, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import ServeVariationToIndividualTarget, {
  ServeVariationToIndividualTargetProps
} from '../ServeVariationToIndividualTarget'
import * as IncludeTargetVariationDialog from '../IncludeTargetVariationDialog'

const getProfileInitials = (str: string): string =>
  str
    .split(' ')
    .map(([firstLetter]) => firstLetter.toUpperCase())
    .join('')

const mockTargets: Partial<Target>[] = [
  { identifier: 't1', name: 'Target 1' },
  { identifier: 't2', name: 'Target 2' },
  { identifier: 't3', name: 'Target 3' }
]

const mockVariations: Partial<Variation>[] = [
  { identifier: 'v1', name: 'Variation 1' },
  { identifier: 'v2' },
  { identifier: 'v3', name: 'Variation 3' }
]

const mockFieldValues = (targets: Target[], variation: Variation): FlagConfigurationStepFormDataValues =>
  ({
    spec: {
      serveVariationToIndividualTarget: {
        include: {
          variation: variation.identifier as string,
          targets: targets.map(({ identifier }) => identifier as string)
        }
      }
    }
  } as FlagConfigurationStepFormDataValues)

const renderComponent = (props: Partial<ServeVariationToIndividualTargetProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <ServeVariationToIndividualTarget
        clearField={jest.fn()}
        setField={jest.fn()}
        subSectionSelector={<span />}
        targets={mockTargets as Target[]}
        variations={mockVariations as Variation[]}
        {...props}
      />
    </TestWrapper>
  )

describe('ServeVariationToIndividualTarget', () => {
  let dialogSpy: jest.SpyInstance
  beforeEach(() => {
    dialogSpy = jest.spyOn(IncludeTargetVariationDialog, 'default').mockReturnValue(<span />)
    jest.clearAllMocks()
  })

  test('it should open the IncludeTargetVariationDialog when the add variation to specific targets button is pressed', async () => {
    renderComponent()

    expect(dialogSpy).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }), {})

    const btn = screen.getByRole('button', { name: 'cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets' })
    expect(btn).toBeInTheDocument()

    userEvent.click(btn)

    await waitFor(() => {
      expect(dialogSpy).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }), {})
    })
  })

  test('it should clear the appropriate fields when unmounted', async () => {
    const clearFieldMock = jest.fn()
    const { unmount } = renderComponent({ clearField: clearFieldMock })

    expect(clearFieldMock).not.toHaveBeenCalled()

    unmount()

    await waitFor(() => {
      expect(clearFieldMock).toHaveBeenCalledWith('spec.serveVariationToIndividualTarget.include.variation')
      expect(clearFieldMock).toHaveBeenCalledWith('spec.serveVariationToIndividualTarget.include.targets')
    })
  })

  test('it should close the dialog when the handleCloseDialog function is invoked', async () => {
    renderComponent()

    userEvent.click(
      screen.getByRole('button', { name: 'cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets' })
    )

    expect(dialogSpy).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), {})
    await act(dialogSpy.mock.calls[1][0].closeDialog)

    await waitFor(() => {
      expect(dialogSpy).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }), {})
    })
  })

  test('it should display the selected variation', async () => {
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    const variationParagraph = document.querySelector('.variationParagraph')
    expect(variationParagraph).toBeInTheDocument()
    expect(variationParagraph).toHaveTextContent(
      `cf.pipeline.flagConfiguration.serve${selectedVariation.name}cf.pipeline.flagConfiguration.toTargets:`
    )
  })

  test('it should display the selected targets', async () => {
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    selectedTargets.forEach(({ name, identifier }) =>
      expect(screen.getByText(getProfileInitials(name || identifier))).toBeInTheDocument()
    )
  })

  test('it should display the count of selected targets', async () => {
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    expect(screen.getByText(`(${selectedTargets.length})`)).toBeInTheDocument()
  })

  test('it should display target for a single target', async () => {
    const selectedTargets = [mockTargets[0]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    expect(screen.getByText(/toTarget:$/)).toBeInTheDocument()
  })

  test('it should display targets for a multiple targets', async () => {
    const selectedTargets = [mockTargets[0], mockTargets[1], mockTargets[2]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    expect(screen.getByText(/toTargets:$/)).toBeInTheDocument()
  })

  test('it should call the setField function when the handleIncludeChange function is invoked', async () => {
    const newTargets = [mockTargets[0], mockTargets[2]] as Target[]
    const newVariation = mockVariations[0] as Variation

    const setFieldMock = jest.fn()
    renderComponent({ setField: setFieldMock })

    await act(() => dialogSpy.mock.calls[0][0].onChange(newTargets, newVariation))

    await waitFor(() => {
      expect(setFieldMock).toHaveBeenCalledWith(
        'spec.serveVariationToIndividualTarget.include.variation',
        newVariation.identifier
      )
      expect(setFieldMock).toHaveBeenCalledWith(
        'spec.serveVariationToIndividualTarget.include.targets',
        newTargets.map(({ identifier }) => identifier)
      )
    })
  })

  test('it should not display targets that are not part of the known targets', async () => {
    const fakeTarget = { name: 'NOT REAL', identifier: 'NOT_REAL' }
    const selectedTargets = [fakeTarget, mockTargets[0]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    expect(screen.queryByText(getProfileInitials(selectedTargets[0].name))).not.toBeInTheDocument()
    expect(screen.queryByText(getProfileInitials(selectedTargets[1].name))).toBeInTheDocument()
  })

  test('it should not display the variation if it is not part of the known variations', async () => {
    const fakeVariation = { name: 'NOT REAL', identifier: 'NOT_REAL' } as Variation
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, fakeVariation) })

    expect(screen.queryByText(fakeVariation.name as string)).not.toBeInTheDocument()
  })
})
