import React from 'react'
import {
  render,
  queryAllByAttribute,
  queryAllByText,
  queryByAttribute,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import snippets from 'modules/dx/services/mocks/snippets/connector/kubernetes/snippets.json'
import type { SnippetSectionProps, SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import SnippetSection from '../SnippetSection'

const props: SnippetSectionProps = {
  snippets: snippets.response as SnippetInterface[],
  onSnippetSearch: jest.fn(),
  entityType: YamlEntity.CONNECTOR
}

describe('Snippets tests', () => {
  const { container } = render(<SnippetSection {...props} />)
  const snippetsList = queryAllByAttribute('class', container, /flexCenter snippet/)
  expect(snippetsList.length).toBe(6)

  test('Initial render should match snapshot', () => {
    expect(queryAllByText(snippetsList[0], 'K8s Cluster with Username and Password').length).toBe(2)
    expect(container).toMatchSnapshot()
  })

  test('Copy snippet', async () => {
    const copyBtn = queryByAttribute('class', snippetsList[0], /copy/)
    expect(copyBtn).not.toBeNull()
    await waitFor(() => fireEvent.click(copyBtn!))
    expect(container).toMatchSnapshot()
  })
})
