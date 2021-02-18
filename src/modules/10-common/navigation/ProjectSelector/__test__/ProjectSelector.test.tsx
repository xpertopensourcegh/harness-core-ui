import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ProjectSelector } from '../ProjectSelector'

import projects from './projects.json'

jest.mock('services/cd-ng', () => ({
  useGetProjectList: jest.fn().mockImplementation(() => {
    return { data: { data: { content: projects } }, refetch: jest.fn(), error: null }
  })
}))

describe('ProjectSelector', () => {
  test('render with projects', () => {
    const handleSelect = jest.fn()

    const { container, getByText, getByTestId } = render(
      <TestWrapper path="/account/:accountId/cd/home" pathParams={{ accountId: 'dummy' }} projects={projects as any}>
        <ProjectSelector onSelect={handleSelect} moduleFilter="CD" />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByTestId('project-select-dropdown'))
    })

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('fdfder32432'))
    })

    expect(getByText('fdfder32432')).toBeDefined()
    expect(handleSelect).toHaveBeenCalled()
  })
})
