import React from 'react'
import { render } from '@testing-library/react'

import { MultiLogLine, MultiLogLineProps } from './MultiLogLine'

const props: MultiLogLineProps = {
  lineNumber: 100,
  limit: 100,
  currentSearchIndex: 0,
  searchText: '',
  text: {
    level: 'INFO',
    time: '12:30 AM',
    out: 'Error: something went wrong'
  }
}

jest.mock('@common/utils/dateUtils', () => ({ formatDatetoLocale: jest.fn(() => 'Mock Date') }))
describe('<MultiLogLine /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(<MultiLogLine {...props} />)
    expect(container).toMatchSnapshot()
  })

  test('search works', () => {
    const { container } = render(<MultiLogLine {...props} searchText="wrong" searchIndices={{ out: [1] }} />)
    expect(container).toMatchSnapshot()

    expect(container.querySelector('[data-search-result-index="1"]')?.innerHTML).toBe('wrong')
  })

  test('search with highlight works', () => {
    const { container } = render(
      <MultiLogLine {...props} searchText="wrong" searchIndices={{ out: [1] }} currentSearchIndex={1} />
    )
    expect(container).toMatchSnapshot()
    expect(container.querySelector('[data-current-search-result="true"]')?.innerHTML).toBe('wrong')
    expect(container.querySelector('[data-search-result-index="1"]')?.innerHTML).toBe('wrong')
  })
})
