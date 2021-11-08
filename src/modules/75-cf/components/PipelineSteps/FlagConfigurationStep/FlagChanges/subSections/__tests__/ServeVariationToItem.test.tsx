import React from 'react'
import { act, render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import type { Variation } from 'services/cf'
import ServeVariationToItem, { ServeVariationToItemProps } from '../ServeVariationToItem'
import * as ItemVariationDialog from '../ItemVariationDialog'

const getProfileInitials = (str: string): string =>
  str
    .split(' ')
    .map(([firstLetter]) => firstLetter.toUpperCase())
    .join('')

const mockItems: ServeVariationToItemProps['items'] = [
  { identifier: 'i1', name: 'Item 1' },
  { identifier: 'i2', name: 'Item 2' },
  { identifier: 'i3', name: 'Item 3' }
]

const mockVariations: Partial<Variation>[] = [
  { identifier: 'v1', name: 'Variation 1' },
  { identifier: 'v2' },
  { identifier: 'v3', name: 'Variation 3' }
]

const renderComponent = (props: Partial<ServeVariationToItemProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <ServeVariationToItem
        dialogTitle="Add item"
        itemLabel="item label"
        itemPlaceholder="item placeholder"
        itemFieldName="items"
        specPrefix="spec.prefix"
        serveItemString="item"
        serveItemsString="items"
        clearField={jest.fn()}
        setField={jest.fn()}
        items={mockItems}
        selectedItems={[]}
        variations={mockVariations as Variation[]}
        {...props}
      />
    </TestWrapper>
  )

describe('ServeVariationToItem', () => {
  let dialogSpy: jest.SpyInstance
  beforeEach(() => {
    dialogSpy = jest.spyOn(ItemVariationDialog, 'default').mockReturnValue(<span />)
    jest.clearAllMocks()
  })

  test('it should open the dialog when the add button is pressed', async () => {
    const dialogTitle = 'TEST BUTTON TEXT'

    renderComponent({ dialogTitle })

    expect(dialogSpy).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }), {})

    const btn = screen.getByRole('button', { name: dialogTitle })
    expect(btn).toBeInTheDocument()

    userEvent.click(btn)

    await waitFor(() => {
      expect(dialogSpy).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }), {})
    })
  })

  test('it should clear the appropriate fields when unmounted', async () => {
    const clearFieldMock = jest.fn()
    const specPrefix = 'spec.prefix'
    const itemFieldName = 'itemFieldName'

    const { unmount } = renderComponent({ clearField: clearFieldMock, specPrefix, itemFieldName })

    expect(clearFieldMock).not.toHaveBeenCalled()

    unmount()

    await waitFor(() => {
      expect(clearFieldMock).toHaveBeenCalledWith(`${specPrefix}.variation`)
      expect(clearFieldMock).toHaveBeenCalledWith(`${specPrefix}.${itemFieldName}`)
    })
  })

  test('it should close the dialog when the handleCloseDialog function is invoked', async () => {
    const dialogTitle = 'TEST BUTTON TEXT'

    renderComponent({ dialogTitle })

    userEvent.click(screen.getByRole('button', { name: dialogTitle }))

    expect(dialogSpy).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), {})
    await act(dialogSpy.mock.calls[1][0].closeDialog)

    await waitFor(() => {
      expect(dialogSpy).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }), {})
    })
  })

  test('it should display the selected variation', async () => {
    const selectedItems = [mockItems[0], mockItems[2]]
    const selectedVariation = mockVariations[0] as Variation
    const serveItemsString = 'items'

    renderComponent({ selectedItems, selectedVariation, selectedVariationIndex: 0, serveItemsString })

    const variationParagraph = document.querySelector('.variationParagraph')
    expect(variationParagraph).toBeInTheDocument()
    expect(variationParagraph).toHaveTextContent(
      `cf.pipeline.flagConfiguration.serve${selectedVariation.name}${serveItemsString}:`
    )
  })

  test('it should display the selected items', async () => {
    const selectedItems = [mockItems[0], mockItems[2]]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ selectedItems, selectedVariation, selectedVariationIndex: 0 })

    selectedItems.forEach(({ name, identifier }) =>
      expect(screen.getByText(getProfileInitials(name || identifier))).toBeInTheDocument()
    )
  })

  test('it should display the count of selected items', async () => {
    const selectedItems = [mockItems[0], mockItems[2]]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ selectedItems, selectedVariation, selectedVariationIndex: 0 })

    expect(screen.getByText(`(${selectedItems.length})`)).toBeInTheDocument()
  })

  test('it should display the singular for a single item', async () => {
    const selectedItems = [mockItems[0]]
    const selectedVariation = mockVariations[0] as Variation
    const serveItemString = 'SINGLE ITEM'

    const { container } = renderComponent({
      selectedItems,
      selectedVariation,
      selectedVariationIndex: 0,
      serveItemString
    })

    expect(container).toHaveTextContent(serveItemString)
  })

  test('it should display the plural for multiple items', async () => {
    const selectedItems = [mockItems[0], mockItems[1], mockItems[2]]
    const selectedVariation = mockVariations[0] as Variation
    const serveItemsString = 'MULTIPLE ITEMS'

    const { container } = renderComponent({
      selectedItems,
      selectedVariation,
      selectedVariationIndex: 0,
      serveItemsString
    })

    expect(container).toHaveTextContent(serveItemsString)
  })

  test('it should call the setField function when the handleIncludeChange function is invoked', async () => {
    const newItems = [mockItems[0], mockItems[2]]
    const newVariation = mockVariations[0] as Variation
    const specPrefix = 'spec.prefix'
    const itemFieldName = 'itemFieldName'

    const setFieldMock = jest.fn()
    renderComponent({ setField: setFieldMock, specPrefix, itemFieldName })

    await act(() => dialogSpy.mock.calls[0][0].onChange(newItems, newVariation))

    await waitFor(() => {
      expect(setFieldMock).toHaveBeenCalledWith(`${specPrefix}.variation`, newVariation.identifier)
      expect(setFieldMock).toHaveBeenCalledWith(
        `${specPrefix}.${itemFieldName}`,
        newItems.map(({ identifier }) => identifier)
      )
    })
  })
})
