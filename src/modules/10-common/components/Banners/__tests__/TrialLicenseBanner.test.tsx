import React from 'react'
import moment from 'moment'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { ModuleName } from 'framework/types/ModuleName'

import { TrialLicenseBanner } from '../TrialLicenseBanner'

const props = {
  module: 'ci' as ModuleName,
  licenseType: 'TRIAL',
  expiryTime: moment().add(15, 'days').unix()
}
describe('TrialLicenseBanner', () => {
  test('should render banner if api call returns TRIAL', () => {
    const { container, getByText } = render(
      <TestWrapper>
        <TrialLicenseBanner {...props} />
      </TestWrapper>
    )
    expect(getByText('common.banners.trial.contactSales')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('should NOT render banner if api call returns NOT TRIAL', () => {
    const localProps = {
      ...props,
      licenseType: 'PAID'
    }
    const { container, queryByText } = render(
      <TestWrapper>
        <TrialLicenseBanner {...localProps} />
      </TestWrapper>
    )
    expect(queryByText('common.banners.trial.contactSales')).toBeNull()
    expect(container).toMatchSnapshot()
  })
})
