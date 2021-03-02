import React from 'react'
import { render, findByText, fireEvent } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import ManifestSelection from '../ManifestSelection'
// import connectorsData from './connectors_mock.json'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

const fetchConnectors = () => Promise.resolve({})

jest.mock('services/cd-ng', () => ({
  useGetConnectorListV2: jest.fn().mockImplementation(() => ({ mutate: fetchConnectors }))
}))
describe('ManifestSelection tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <ManifestSelection isForOverrideSets={false} isForPredefinedSets={false} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test(`renders add Manifest option without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <ManifestSelection isForOverrideSets={false} isForPredefinedSets={false} />
      </TestWrapper>
    )
    const addFileButton = await findByText(container, '+ Add Manifest/Config File')
    expect(addFileButton).toBeDefined()
    fireEvent.click(addFileButton)
    const createFileModal = findByText(document.body, 'Specify your manifest file repository type')
    expect(createFileModal).toBeDefined()
  })
})
