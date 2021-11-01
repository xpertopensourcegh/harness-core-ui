import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { mockTemplatesInputYaml } from '@templates-library/TemplatesTestHelper'
import MonacoEditor from '@common/components/MonacoEditor/__mocks__/MonacoEditor'
import { TemplateYaml } from '../TemplateYaml'

jest.mock('react-monaco-editor', () => ({
  MonacoDiffEditor: MonacoEditor
}))

jest.mock('@common/components/MonacoEditor/MonacoEditor', () => MonacoEditor)

describe('<TemplateYaml /> tests', () => {
  test('snapshot test', async () => {
    const { container } = render(
      <TestWrapper>
        <TemplateYaml templateYaml={mockTemplatesInputYaml.data} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
