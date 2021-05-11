import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { useGetAccountLicenseInfo, useStartTrial } from 'services/portal'
import CETrialHomePage from '../CETrialHomePage'

jest.mock('services/portal')

const useGetAccountLicenseInfoMock = useGetAccountLicenseInfo as jest.MockedFunction<any>
const useStartTrialMock = useStartTrial as jest.MockedFunction<any>

describe('CETrialHomePage snapshot test', () => {
  beforeEach(() => {
    useStartTrialMock.mockImplementation(() => {
      return {
        cancel: jest.fn(),
        loading: false,
        mutate: jest.fn().mockImplementationOnce(() => {
          return {
            status: 'SUCCESS',
            data: {
              licenseType: 'TRIAL'
            }
          }
        })
      }
    })
  })

  test('it should render properly', async () => {
    useGetAccountLicenseInfoMock.mockImplementation(() => {
      return {}
    })

    const { container } = render(
      <TestWrapper pathParams={{ orgIdentifier: 'dummy' }}>
        <CETrialHomePage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('it should pass props to show the start trial modal', async () => {
    useGetAccountLicenseInfoMock.mockImplementation(() => {
      return {
        data: {
          data: {
            moduleLicenses: [true]
          }
        }
      }
    })

    const { container } = render(
      <TestWrapper pathParams={{ orgIdentifier: 'dummy' }}>
        <CETrialHomePage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('it should show a loading spinner', async () => {
    useGetAccountLicenseInfoMock.mockImplementation(() => {
      return {
        data: {
          data: {
            moduleLicenses: [true]
          }
        },
        loading: true
      }
    })

    const { container } = render(
      <TestWrapper pathParams={{ orgIdentifier: 'dummy' }}>
        <CETrialHomePage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
