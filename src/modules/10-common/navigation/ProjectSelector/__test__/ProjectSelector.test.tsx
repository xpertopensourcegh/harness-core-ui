import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ModuleName } from 'framework/types/ModuleName'
import { ProjectSelector } from '../ProjectSelector'

import projects from './projects.json'

describe('ProjectSelector', () => {
  test('render without projects', () => {
    const handleSelect = jest.fn()

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/cd/home" pathParams={{ accountId: 'dummy' }}>
        <ProjectSelector onSelect={handleSelect} moduleFilter={ModuleName.CD} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Select Project'))
    })

    expect(container).toMatchSnapshot()
  })

  test('render with projects', () => {
    const handleSelect = jest.fn()

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/cd/home" pathParams={{ accountId: 'dummy' }} projects={projects as any}>
        <ProjectSelector onSelect={handleSelect} moduleFilter="CD" />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Select Project'))
    })

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('fdfder32432'))
    })

    expect(getByText('fdfder32432')).toBeDefined()
    expect(handleSelect).toHaveBeenCalled()
  })
})
