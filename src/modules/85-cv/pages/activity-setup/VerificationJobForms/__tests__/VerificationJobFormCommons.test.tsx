import React from 'react'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { FormControlButtons, basicValidation, useFormSubmit } from '../VerificationJobFormCommons'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useRouteParams: () => ({
    params: {
      accountId: 'testAcc',
      projectIdentifier: 'projectId',
      orgIdentifier: 'orgId'
    }
  })
}))

jest.mock('react-router', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))

const callSaveVerification = jest.fn()
jest.mock('services/cv', () => ({
  useSaveVerificationJob: jest.fn().mockImplementation(() => ({
    mutate: callSaveVerification
  }))
}))

describe('VerificationJobFormCommons', () => {
  test('check api is called', async () => {
    const { result } = renderHook(() => useFormSubmit())

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

  test('formControllerBtn render', async () => {
    const { container, getByText } = render(<FormControlButtons />)
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
