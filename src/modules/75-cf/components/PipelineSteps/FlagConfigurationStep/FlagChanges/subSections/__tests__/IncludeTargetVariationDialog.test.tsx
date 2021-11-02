import React, { FC } from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import type { Target, Variation } from 'services/cf'
import IncludeTargetVariationDialog, { IncludeTargetVariationDialogProps } from '../IncludeTargetVariationDialog'

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

const renderComponent = (props: Partial<IncludeTargetVariationDialogProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <IncludeTargetVariationDialog
        isOpen={true}
        closeDialog={jest.fn()}
        targets={mockTargets as Target[]}
        variations={mockVariations as Variation[]}
        onChange={jest.fn()}
        {...props}
      />
    </TestWrapper>
  )

describe('IncludeTargetVariationDialog', () => {
  test('it should display the dialog when isOpen is true', async () => {
    const title = 'cf.pipeline.flagConfiguration.addEditVariationToSpecificTargets'
    const Subject: FC<{ isOpen: boolean }> = ({ isOpen }) => (
      <TestWrapper>
        <IncludeTargetVariationDialog
          isOpen={isOpen}
          closeDialog={jest.fn()}
          targets={mockTargets as Target[]}
          variations={mockVariations as Variation[]}
          onChange={jest.fn()}
        />
      </TestWrapper>
    )

    const { rerender } = render(<Subject isOpen={false} />)
    expect(screen.queryByText(title)).not.toBeInTheDocument()

    rerender(<Subject isOpen={true} />)
    expect(screen.queryByText(title)).toBeInTheDocument()
  })

  test('it should display a select to choose targets', async () => {
    renderComponent()

    expect(screen.getByText('cf.shared.targets')).toBeInTheDocument()

    const inputEl = document.querySelector('[name="targets"]')
    expect(inputEl).toBeInTheDocument()

    userEvent.click(inputEl as HTMLInputElement)

    await waitFor(() => {
      mockTargets.forEach(({ name }) => expect(screen.getByText(name as string)).toBeInTheDocument())
    })
  })

  test('it should display a select to choose variation', async () => {
    renderComponent()

    expect(screen.getByText('cf.pipeline.flagConfiguration.variationServed')).toBeInTheDocument()

    const inputEl = document.querySelector('[name="variation"]')
    expect(inputEl).toBeInTheDocument()

    userEvent.click(inputEl as HTMLInputElement)

    await waitFor(() => {
      mockVariations.forEach(({ name, identifier }) =>
        expect(screen.getByText((name || identifier) as string)).toBeInTheDocument()
      )
    })
  })

  test('it should call the closeDialog function when the cancel button is clicked', async () => {
    const closeDialogMock = jest.fn()
    renderComponent({ closeDialog: closeDialogMock })

    const btn = screen.getByRole('button', { name: 'cancel' })
    expect(btn).toBeInTheDocument()
    expect(closeDialogMock).not.toHaveBeenCalled()

    userEvent.click(btn)

    await waitFor(() => expect(closeDialogMock).toHaveBeenCalled())
  })

  test('it should call the onChange function when the form is filled out and submitted', async () => {
    const onChangeMock = jest.fn()
    const closeDialogMock = jest.fn()
    renderComponent({ onChange: onChangeMock, closeDialog: closeDialogMock })

    expect(onChangeMock).not.toHaveBeenCalled()
    expect(closeDialogMock).not.toHaveBeenCalled()

    userEvent.click(document.querySelector('[name="targets"]') as HTMLInputElement)
    await waitFor(() => {
      expect(screen.getByText(mockTargets[0].name as string)).toBeInTheDocument()
      expect(screen.getByText(mockTargets[1].name as string)).toBeInTheDocument()
    })
    userEvent.click(screen.getByText(mockTargets[0].name as string))
    userEvent.click(screen.getByText(mockTargets[1].name as string))

    userEvent.click(document.querySelector('[name="variation"]') as HTMLInputElement)
    await waitFor(() =>
      expect(screen.getByText((mockVariations[0].name || mockVariations[0].identifier) as string)).toBeInTheDocument()
    )
    userEvent.click(screen.getByText((mockVariations[0].name || mockVariations[0].identifier) as string))

    userEvent.click(screen.getByRole('button', { name: 'done' }))

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith([mockTargets[0], mockTargets[1]], mockVariations[0])
      expect(closeDialogMock).toHaveBeenCalled()
    })
  })

  test('it should not call the onChange function when the form is not filled out and submit button is clicked', async () => {
    const onChangeMock = jest.fn()
    renderComponent({ onChange: onChangeMock })

    expect(onChangeMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'done' }))

    await waitFor(() => expect(onChangeMock).not.toHaveBeenCalled())
  })

  test('it should pre-select selectedTargets', async () => {
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]
    renderComponent({ selectedTargets })

    selectedTargets.forEach(({ name }) => expect(screen.getByText(name)).toBeInTheDocument())
  })

  test('it should pre-select selectedVariation', async () => {
    const selectedVariation = mockVariations[1] as Variation
    renderComponent({ selectedVariation })

    expect(document.querySelector('[name="variation"]')).toHaveValue(
      selectedVariation.name || selectedVariation.identifier
    )
  })
})
