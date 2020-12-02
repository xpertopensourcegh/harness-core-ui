import React from 'react'
import { render } from '@testing-library/react'
import { YamlEntity } from '@common/constants/YamlConstants'
import SnippetSection from '../SnippetSection'

describe('SnippetSection Test', () => {
  test('Initial render should match snapshots', () => {
    const { container } = render(<SnippetSection entityType={YamlEntity.CONNECTOR} showIconMenu={true} />)
    expect(container).toMatchSnapshot()
  })
})
