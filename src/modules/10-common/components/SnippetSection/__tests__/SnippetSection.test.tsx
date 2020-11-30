import React from 'react'
import { render } from '@testing-library/react'
import { YamlEntity } from '@common/constants/YamlConstants'
import SnippetSection from '../SnippetSection'
import * as mockMetaData from './snippets.metadata.json'
import * as mockSnippetData from './snippet.json'

describe('SnippetSection Test', () => {
  test('Initial render should match snapshots', () => {
    const { container } = render(
      <SnippetSection
        entityType={YamlEntity.CONNECTOR}
        mockMetaData={mockMetaData as any}
        mockSnippetData={mockSnippetData as any}
        showIconMenu={true}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
