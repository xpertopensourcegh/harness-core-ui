import React from 'react'
import { render, queryByText } from '@testing-library/react'
import i18n from '../ServiceSpecifications.i18n'
import ServiceSpecifications from '../ServiceSpecifications'

describe('ServiceSpecifications Snapshot', () => {
  test('should render ServiceSpecifications component', () => {
    const { container } = render(<ServiceSpecifications />)
    expect(queryByText(container, i18n.artifacts)).toBeDefined()
    expect(queryByText(container, i18n.manifests)).toBeDefined()
    expect(queryByText(container, i18n.variables)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
