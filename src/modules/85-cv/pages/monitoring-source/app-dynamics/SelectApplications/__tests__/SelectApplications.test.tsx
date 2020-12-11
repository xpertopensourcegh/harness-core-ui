import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SelectApplications from '../SelectApplications'

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    accountId: 'accountIdMock',
    projectIdentifier: 'projectIdMock',
    orgIdentifier: 'orgIdMock'
  })
}))

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useStrings: () => ({
    getString: () => 'xx'
  })
}))

jest.mock('services/cv', () => ({
  useGetAppDynamicsApplications: () => ({
    loading: false,
    data: {
      resource: {
        content: [
          {
            id: 1,
            name: 'app1'
          },
          {
            id: 2,
            name: 'app2'
          }
        ]
      }
    }
  })
}))

jest.mock('services/cd-ng', () => ({
  useGetEnvironmentListForProject: () => ({
    loading: false,
    data: {
      content: [
        {
          name: 'env1'
        },
        {
          name: 'env2'
        }
      ]
    }
  })
}))

jest.mock('../EnvironmentSelect', () => ({
  EnvironmentSelect: function MockSelect(props: any) {
    return (
      <div
        className="environment-select-mock"
        onClick={() =>
          props?.onSelect({
            label: 'env1',
            value: 'env1'
          })
        }
      />
    )
  }
}))

describe('SelectApplications', () => {
  test('Matches snapshot', () => {
    const { container } = render(<SelectApplications stepData={{}} onCompleteStep={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  test('Mantains state correctly and calls onCompleteStep callback', () => {
    const onCompleteStep = jest.fn()
    const { container } = render(<SelectApplications stepData={{}} onCompleteStep={onCompleteStep} />)
    fireEvent.click(container.querySelector('input[type=checkbox]')!)
    fireEvent.click(container.querySelector('.environment-select-mock')!)
    fireEvent.click(container.querySelector('button[type=submit]')!)
    expect(onCompleteStep).toHaveBeenCalled()
    const calledWithArg = onCompleteStep.mock.calls[0][0]
    expect(calledWithArg.applications['1'].id).toEqual(1)
    expect(calledWithArg.applications['1'].name).toEqual('app1')
    expect(calledWithArg.applications['1'].environment).toEqual('env1')
  })
})
