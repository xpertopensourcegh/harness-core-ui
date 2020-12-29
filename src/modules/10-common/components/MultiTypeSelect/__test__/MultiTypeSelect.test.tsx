import React from 'react'
import { render } from '@testing-library/react'
import { MultiTypeSelectField } from '../MultiTypeSelect'

describe('<MultiTypeSelect /> tests', () => {
  test('Should render properly', () => {
    const { container } = render(
      <MultiTypeSelectField
        name="test"
        label=""
        multiTypeInputProps={{
          selectItems: []
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
