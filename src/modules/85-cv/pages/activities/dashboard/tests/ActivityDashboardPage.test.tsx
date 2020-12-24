import React from 'react'
import { render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import ActivityDashboardPage from '../ActivityDashBoardPage'

const MockResponse = {
  metaData: {},
  resource: [
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_1',
      activityName: 'Infrastructure Failover',
      activityStartTime: 1608258600000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608257700000,
        durationMs: 900000,
        riskScore: 0.023056990846069485,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_2',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608256560000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608255900000,
        durationMs: 600000,
        riskScore: 0.0,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_3',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608256560000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_4',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608259740000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608258900000,
        durationMs: 600000,
        riskScore: 0.056783056739160606,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_5',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608259740000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_6',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608259800000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608259200000,
        durationMs: 600000,
        riskScore: 0.05783438328521656,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_7',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608259800000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_8',
      activityName: '3 Normal kubernetes events',
      activityStartTime: 1608259920000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_9',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608260100000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608259500000,
        durationMs: 600000,
        riskScore: 0.05320143825990746,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_10',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608257940000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_11',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608257940000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_12',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608258000000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_13',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608258000000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_14',
      activityName: '3 Normal kubernetes events',
      activityStartTime: 1608258120000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_15',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608258240000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_16',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608258360000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_17',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608258360000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_18',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608256560000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_19',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608257940000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_20',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608258360000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_21',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608259740000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_22',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608169740000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'DEPLOYMENT',
      activityId: 'activity_23',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608169740000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_24',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608170160000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'DEPLOYMENT',
      activityId: 'activity_25',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608170160000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_26',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608260160000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_27',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608260160000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_28',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608260160000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_29',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608261180000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608260400000,
        durationMs: 600000,
        riskScore: 0.02252724777716169,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_30',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608261180000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_31',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608261180000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_32',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608261240000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_33',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608261240000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_34',
      activityName: '3 Normal kubernetes events',
      activityStartTime: 1608261300000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608260700000,
        durationMs: 600000,
        riskScore: 0.02353248502737243,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_35',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608261480000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_36',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608234180000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'DEPLOYMENT',
      activityId: 'activity_37',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608234180000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'INFRASTRUCTURE',
      activityId: 'activity_38',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608261540000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_39',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608261540000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_40',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608261540000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_41',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608261600000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'VERIFICATION_PASSED',
      activityVerificationSummary: {
        total: 1,
        passed: 1,
        failed: 0,
        errors: 0,
        progress: 0,
        notStarted: 0,
        remainingTimeMs: 0,
        progressPercentage: 100,
        startTime: 1608261000000,
        durationMs: 600000,
        riskScore: 0.02627106828355504,
        aggregatedStatus: 'VERIFICATION_PASSED'
      }
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_42',
      activityName: '1 Warning kubernetes events',
      activityStartTime: 1608261600000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_43',
      activityName: '1 Normal kubernetes events',
      activityStartTime: 1608261660000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_44',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608261720000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    },
    {
      activityType: 'OTHER',
      activityId: 'activity_45',
      activityName: '2 Normal kubernetes events',
      activityStartTime: 1608261720000,
      environmentIdentifier: 'Prod',
      environmentName: null,
      serviceIdentifier: 'Manager',
      verificationStatus: 'NOT_STARTED',
      activityVerificationSummary: null
    }
  ],
  responseMessages: []
}

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVActivitySourceSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG'
  }
}

describe('Unit test for ActivityDashboardPage', () => {
  let originalObserver: any
  beforeAll(() => {
    originalObserver = window.IntersectionObserver
    window.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    })) as any
  })
  afterAll(() => {
    window.IntersectionObserver = originalObserver
  })

  test('Ensure data is rendered when api  returns value', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1608788674245)
    const useListActivitiesForDashboardSpy = jest.spyOn(cvService, 'useListActivitiesForDashboard')
    useListActivitiesForDashboardSpy.mockReturnValue({ data: MockResponse } as UseGetReturn<any, any, any, any>)
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')))
    expect(container.querySelectorAll('[class*="activityCard"]').length).toBe(2)
  })
})
