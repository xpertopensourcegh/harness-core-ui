import React from 'react'

import { render } from '@testing-library/react'
import FilterDrawer from '../FilterDrawer'

describe('FilterDrawer Snapshot', () => {
  test('should render FilterDrawer', () => {
    const { container } = render(<FilterDrawer isFilterPanelOpen={true} />)
    expect(container).toMatchSnapshot()
  })
})
