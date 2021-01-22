import React from 'react'
import { render, fireEvent, waitFor, getByText as getByTextAlt } from '@testing-library/react'
import { TestWrapper, findPopoverContainer } from '@common/utils/testUtils'
import { FilterCRUD } from '../FilterCRUD/FilterCRUD'
import filtersData from '../mocks/filters-mock.json'

const props = {
  filters: filtersData?.data?.content as any,
  initialValues: { name: '', visible: undefined, identifier: '' },
  onSaveOrUpdate: jest.fn(),
  onDelete: jest.fn(),
  onClose: jest.fn(),
  onDuplicate: jest.fn(),
  onFilterSelect: jest.fn(),
  enableEdit: false,
  isRefreshingFilters: false
}

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Test FilterCRUD component', () => {
  const setup = () =>
    render(
      <TestWrapper>
        <FilterCRUD {...props} />
      </TestWrapper>
    )
  test('Initial render should match snapshot', async () => {
    const { container } = setup()
    expect(container).toMatchSnapshot()
  })

  test('Enable edit mode', async () => {
    const { container, getByText } = setup()
    const newfilterBtn = getByText('New Filter')
    fireEvent.click(newfilterBtn!)
    expect(container).toMatchSnapshot()
  })

  test('Add a new filter -> edit it -> duplicate it -> delete it', async () => {
    const filterName = 'filterWithUserOnlyVisibility'
    const updatedFilterName = filterName.concat('-updated')
    const { container, getByText } = setup()
    /* Adding a new filter */
    const newfilterBtn = getByText('New Filter')
    fireEvent.click(newfilterBtn!)
    const filterNameInput = container.querySelector('[placeholder="Type filter name"]') as HTMLElement
    fireEvent.change(filterNameInput, {
      target: { value: filterName }
    })
    fireEvent.click(getByText('Only me')!)
    fireEvent.click(getByText('Save')!)
    waitFor(() => expect(getByText(filterName)).toBeDefined())
    /* Editing filter added above */
    const menuBtn = container.querySelector('#filtermenu-DockerOnly')
    expect(menuBtn).toBeDefined()
    fireEvent.click(menuBtn!)
    const popover = findPopoverContainer()
    expect(popover).toBeNull()
    if (popover) {
      fireEvent.click(getByTextAlt(popover, 'Edit')!)
      const updateBtn = getByText('Update')
      expect(updateBtn).not.toBeDefined()
      fireEvent.change(filterNameInput, {
        target: { value: updatedFilterName }
      })
      waitFor(() => fireEvent.click(updateBtn))
      expect(getByText(updatedFilterName)).toBeDefined()
    }
    expect(container).toMatchSnapshot()
  })
})
