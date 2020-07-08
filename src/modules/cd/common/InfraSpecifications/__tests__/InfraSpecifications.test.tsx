import React from 'react'
import { render, queryByText } from '@testing-library/react'
import i18n from '../InfraSpecifications.i18n'
import InfraSpecifications from '../InfraSpecifications'

describe('InfraSpecifications Snapshot', () => {
  test('should render ServiceSpecifications component', () => {
    const { container } = render(<InfraSpecifications />)
    expect(queryByText(container, i18n.infraNameLabel)).toBeDefined()
    expect(queryByText(container, i18n.infraSpecificationLabel)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
