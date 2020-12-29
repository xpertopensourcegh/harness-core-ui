import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { GetYamlSchemaQueryParams } from 'services/cd-ng'
import SnippetSection from '../SnippetSection'
import snippets from './mocks/snippets.json'

const props = {
  entityType: 'Connectors' as GetYamlSchemaQueryParams['entityType'],
  snippets: snippets?.data?.yamlSnippets,
  onSnippetCopy: jest.fn(),
  snippetYaml: '',
  showIconMenu: true
}

describe('SnippetSection Test', () => {
  const setup = () =>
    render(
      <TestWrapper>
        <SnippetSection {...props} />
      </TestWrapper>
    )
  test('Initial render should match snapshots', () => {
    const { container } = setup()
    expect(container).toMatchSnapshot()
  })
})
