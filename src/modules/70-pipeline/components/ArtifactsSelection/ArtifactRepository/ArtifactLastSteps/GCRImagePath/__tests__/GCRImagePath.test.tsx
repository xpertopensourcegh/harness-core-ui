import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { TagTypes } from '@pipeline/components/ArtifactsSelection/ArtifactInterface'
import { GCRImagePath } from '../GCRImagePath'

const props = {
  name: 'Artifact details',
  expressions: [],
  context: 2,
  handleSubmit: jest.fn()
}

describe('GCR Image Path Artifact tests', () => {
  test(`renders without crashing`, () => {
    const initialValues = {
      identifier: '',
      imagePath: '',
      tag: '',
      tagType: TagTypes.Value,
      tagRegex: '',
      registryHostname: ''
    }

    const { container } = render(
      <TestWrapper>
        <GCRImagePath key={'key'} initialValues={initialValues} {...props} />
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
      registryHostname: ''
    }

    const { container } = render(
      <TestWrapper>
        <GCRImagePath key={'key'} initialValues={initialValues} {...props} />
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
        <GCRImagePath key={'key'} initialValues={initialValues} {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
