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

  test('works with link containing search text', () => {
    const { container } = render(
      <MultiLogLine
        text={{
          level: 'info',
          time: '20/08/2021 11:12:18',
          out: '+ echo @wings-software:registry=https://npm.pkg.github.com'
        }}
        searchIndices={{
          out: [0]
        }}
        lineNumber={1}
        limit={58}
        searchText="pk"
        currentSearchIndex={0}
      />
    )

    const link = container.querySelector<HTMLAnchorElement>('a.ansi-decoration-link')

    expect(link).toMatchInlineSnapshot(`
      <a
        class="ansi-decoration-link"
        href="https://npm.pkg.github.com"
        rel="noreferrer"
        target="_blank"
      >
        https://npm.
        <mark
          data-current-search-result="true"
          data-search-result-index="0"
        >
          pk
        </mark>
        g.github.com
      </a>
    `)
    expect(container).toMatchSnapshot()
  })
})
