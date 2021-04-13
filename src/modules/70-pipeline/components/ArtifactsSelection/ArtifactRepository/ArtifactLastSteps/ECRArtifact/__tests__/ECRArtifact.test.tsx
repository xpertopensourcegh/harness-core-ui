import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { TagTypes } from '@pipeline/components/ArtifactsSelection/ArtifactInterface'
import { ECRArtifact } from '../ECRArtifact'

const props = {
  name: 'Artifact details',
  expressions: [],
  context: 2,
  handleSubmit: jest.fn()
}

const mockRegions = {
  resource: [{ name: 'region1', value: 'region1' }]
}

jest.mock('services/portal', () => ({
  useListAwsRegions: jest.fn().mockImplementation(() => {
    return { data: mockRegions, refetch: jest.fn(), error: null, loading: false }
  })
}))

describe('ECR Artifact tests', () => {
  test(`renders without crashing`, () => {
    const initialValues = {
      identifier: '',
      imagePath: '',
      tag: '',
      tagType: TagTypes.Value,
      tagRegex: '',
      region: { name: '', value: '' }
    }

    const { container } = render(
      <TestWrapper>
        <ECRArtifact key={'key'} initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders while adding step first time`, () => {
    const initialValues = {
      identifier: 'id',
      imagePath: 'library/nginx',
      tag: '',
      tagType: TagTypes.Value,
      tagRegex: '',
      region: { name: '', value: '' }
    }

    const { container } = render(
      <TestWrapper>
        <ECRArtifact key={'key'} initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders correctly in edit case`, () => {
    const initialValues = {
      identifier: 'id',
      imagePath: 'library/nginx',
      tag: '',
      tagRegex: 'someregex',
      tagType: TagTypes.Regex,
      region: { name: 'region', value: 'region' }
    }

    const { container } = render(
      <TestWrapper>
        <ECRArtifact key={'key'} initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
