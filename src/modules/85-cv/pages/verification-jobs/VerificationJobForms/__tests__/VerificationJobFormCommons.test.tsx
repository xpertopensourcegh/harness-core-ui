import React from 'react'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TestWrapperProps, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import {
  FormControlButtons,
  basicValidation,
  useFormSubmit,
  sensitivityEnunToLabel,
  baselineEnumToLabel
} from '../VerificationJobFormCommons'
import { DefaultBaselineOptions, VerificationSensitivityOptions } from '../VerificationJobFields'
import type { VerificationSensitivity } from '../../VerificationJobsSetup'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVActivityDashboard({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: 'testAcc',
    projectIdentifier: 'projectId',
    orgIdentifier: 'orgId'
  }
}

const callSaveVerification = jest.fn()
jest.mock('services/cv', () => ({
  useSaveVerificationJob: jest.fn().mockImplementation(() => ({
    mutate: callSaveVerification
  }))
}))

describe('VerificationJobFormCommons', () => {
  test('check api is called', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: TestWrapper })

    result.current.onSubmit({
      identifier: 'id',
      jobName: 'jobName',
      projectIdentifier: 'projectIdentifier',
      orgIdentifier: 'orgIdentifier',
      environment: 'envIdentifier',
      service: { value: 'value' },
      dataSource: [{ value: 'datasource', label: 'label' }]
    })

    expect(callSaveVerification).toBeCalled()
  })

  test('Ensure sensitivity labels are correct', () => {
    expect(sensitivityEnunToLabel(VerificationSensitivityOptions[0].value as VerificationSensitivity)).toEqual(
      VerificationSensitivityOptions[0].label
    )
    expect(sensitivityEnunToLabel(VerificationSensitivityOptions[1].value as VerificationSensitivity)).toEqual(
      VerificationSensitivityOptions[1].label
    )
    expect(sensitivityEnunToLabel(VerificationSensitivityOptions[2].value as VerificationSensitivity)).toEqual(
      VerificationSensitivityOptions[2].label
    )
  })

  test('Ensure baseline labels are correct', () => {
    expect(baselineEnumToLabel(DefaultBaselineOptions[0].value as string)).toEqual(DefaultBaselineOptions[0].label)
    expect(baselineEnumToLabel(1612376957777))
  })

  test('formControllerBtn render', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <FormControlButtons />
      </TestWrapper>
    )
    expect(getByText('Save')).toBeDefined()

    expect(container).toMatchSnapshot()
  })

  test('basic validation', async () => {
    // when all required fields are filled
    expect(
      basicValidation({
        jobName: 'jobName',
        service: 'service',
        environment: 'environment',
        dataSource: 'dataSource',
        duration: 'duration'
      })
    ).toMatchObject({})

    // when duration is missed
    expect(
      basicValidation({
        jobName: 'jobName',
        service: 'service',
        environment: 'environment',
        dataSource: 'dataSource'
        //   duration: 'duration'
      })
    ).toMatchObject({ duration: 'Required' })

    // when no required field is available
    expect(basicValidation({})).toEqual({
      dataSource: 'Required',
      duration: 'Required',
      environment: 'Required',
      jobName: 'Required',
      service: 'Required'
    })
  })
})
