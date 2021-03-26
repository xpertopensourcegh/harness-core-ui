import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import HelmWithGcs from '../HelmWithGcs'

const props = {
  stepName: 'Manifest details',
  expressions: [],
  handleSubmit: jest.fn()
}
describe('helm with http tests', () => {
  test(`renders without crashing`, () => {
    const initialValues = {
      identifier: '',
      helmVersion: 'V2',
      chartName: '',
      chartVersion: '',
      skipResourceVersioning: false,
      bucketName: '',
      folderPath: '',
      commandFlags: [{ commandType: undefined, flag: undefined, id: 'id1' }]
    }
    const { container } = render(
      <TestWrapper>
        <HelmWithGcs {...props} initialValues={initialValues} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders while adding step first time`, () => {
    const initialValues = {
      identifier: '',
      helmVersion: 'V2',
      chartName: '',
      chartVersion: '',
      skipResourceVersioning: false,
      bucketName: '',
      folderPath: '',
      commandFlags: [{ commandType: undefined, flag: undefined, id: 'id2' }]
    }

    const { container } = render(
      <TestWrapper>
        <HelmWithGcs initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders correctly in edit case`, () => {
    const initialValues = {
      identifier: 'id3',
      helmVersion: 'V2',
      chartName: '',
      chartVersion: '',
      skipResourceVersioning: false,
      bucketName: '',
      folderPath: '',
      commandFlags: [{ commandType: undefined, flag: undefined, id: 'a1' }]
    }

    const { container } = render(
      <TestWrapper>
        <HelmWithGcs initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
