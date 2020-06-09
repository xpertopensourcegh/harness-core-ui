import React from 'react'

import { render, queryByText } from '@testing-library/react'
import i18n from '../ResourcesPage.i18n'
import ResourcesPage from '../ResourcesPage'
import moment from 'moment-timezone'

jest.spyOn(Date, 'now').mockImplementation(() => 1588885751000)

describe('ResourcesPage Snapshot', () => {
  moment.tz.setDefault('PST')
  test('should render ResourcesPage', () => {
    const { container } = render(<ResourcesPage />)
    expect(queryByText(container, i18n.title)).toBeDefined()
    expect(queryByText(container, i18n.newConnectorButton)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
