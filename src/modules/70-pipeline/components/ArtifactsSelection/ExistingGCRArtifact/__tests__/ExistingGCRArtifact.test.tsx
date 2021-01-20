import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import ExistingGCRArtifact from '../ExistingGCRArtifact'
describe('ExistingDockerArtifact tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <ExistingGCRArtifact
          initialValues={{}}
          handleSubmit={(): void => undefined}
          handleViewChange={(): void => undefined}
          context={{} as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip(`renders artifact creation modal without crashing`, async () => {
    render(
      <TestWrapper>
        <ExistingGCRArtifact
          initialValues={{}}
          handleSubmit={(): void => undefined}
          handleViewChange={(): void => undefined}
          context={{} as any}
        />
      </TestWrapper>
    )
    const imagePath = 'lib/nginx'
    const imageInput = document.querySelector("input[placeholder='Enter path here']")
    expect(imageInput).toBeDefined()
    await act(async () => {
      fireEvent.change(imageInput!, {
        target: { value: imagePath }
      })
    })
  })
})
