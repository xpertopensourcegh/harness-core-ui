import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { useUpdateAccountDefaultExperienceNG } from 'services/cd-ng'
import { PurposePage } from '../PurposePage'

jest.mock('services/cd-ng')
const useUpdateAccountDefaultExperienceNGMock = useUpdateAccountDefaultExperienceNG as jest.MockedFunction<any>

const featureFlags = {
  CDNG_ENABLED: true,
  CVNG_ENABLED: true,
  CING_ENABLED: true,
  CENG_ENABLED: true,
  CFNG_ENABLED: true
}

describe('PurposePage', () => {
  test('should render module description and continue button when select module', async () => {
    useUpdateAccountDefaultExperienceNGMock.mockImplementation(() => {
      return {
        mutate: () => void 0
      }
    })
    const { container, getByText } = render(
      <TestWrapper defaultAppStoreValues={{ featureFlags }}>
        <PurposePage />
      </TestWrapper>
    )
    fireEvent.click(getByText('common.purpose.ci.integration'))
    await waitFor(() => expect(container).toMatchSnapshot())
  })
})
