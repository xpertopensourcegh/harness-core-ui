/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ModuleLicenseType } from '@common/constants/SubscriptionTypes'
import { TrialModalTemplate } from '../TrialModalTemplate'

const props = {
  iconName: 'cd-main',
  title: 'Continuous Delivery',
  description: 'Continuous Delivery description',
  imgSrc: '',
  children: <></>
}
describe('Rendering', () => {
  test('should render', () => {
    const { container, getByText } = render(
      <TestWrapper path="/path" queryParams={{ modal: ModuleLicenseType.TRIAL }}>
        <TrialModalTemplate {...props} />
      </TestWrapper>
    )
    expect(getByText('common.trialInProgress')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('should not render trial when hideTrialBadge is true', () => {
    const newProps = {
      ...props,
      hideTrialBadge: true
    }

    const { container, queryByText } = render(
      <TestWrapper path="/path" queryParams={{ modal: ModuleLicenseType.TRIAL }}>
        <TrialModalTemplate {...newProps} />
      </TestWrapper>
    )
    expect(queryByText('common.trialInProgress')).not.toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
