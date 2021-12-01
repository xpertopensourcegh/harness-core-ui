import React from 'react'
import { act, fireEvent, queryByAttribute, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'

import { ManifestDataType } from '@pipeline/components/ManifestSelection/Manifesthelper'
import type { ManifestTypes } from '@pipeline/components/ManifestSelection/ManifestInterface'
import KustomizePatchesDetails from '../KustomizePatchesDetails'

const initialValues = {
  identifier: '',
  spec: {},
  branch: undefined,
  type: ManifestDataType.KustomizePatches,
  commitId: undefined,
  gitFetchType: 'Branch',
  paths: [],
  repoName: ''
}

const props = {
  stepName: 'Manifest details',
  expressions: [],
  handleSubmit: jest.fn(),
  selectedManifest: 'Values' as ManifestTypes,
  manifestIdsList: [],
  initialValues
}

describe('Kustomizepatch Details tests', () => {
  test('initial rendering', () => {
    const { container } = render(
      <TestWrapper>
        <KustomizePatchesDetails {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('submits with right payload', async () => {
    const prevStepData = {
      connectorRef: {
        connector: {
          spec: {
            connectionType: 'Account',
            url: 'accounturl-test'
          }
        }
      },
      store: 'Git'
    }

    const { container } = render(
      <TestWrapper>
        <KustomizePatchesDetails {...props} prevStepData={prevStepData} />
      </TestWrapper>
    )

    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    await act(async () => {
      fireEvent.change(queryByNameAttribute('identifier')!, { target: { value: 'testidentifier' } })
      fireEvent.change(queryByNameAttribute('gitFetchType')!, { target: { value: 'Branch' } })
      fireEvent.change(queryByNameAttribute('branch')!, { target: { value: 'testBranch' } })
    })
    fireEvent.click(container.querySelector('button[type="submit"]')!)
    await waitFor(() => {
      expect(props.handleSubmit).toHaveBeenCalledWith({
        manifest: {
          identifier: 'testidentifier',
          type: ManifestDataType.KustomizePatches,
          spec: {
            store: {
              spec: {
                branch: 'testBranch',
                connectorRef: undefined,
                gitFetchType: 'Branch',
                paths: ['']
              },
              type: 'Git'
            }
          }
        }
      })
    })
  })

  test('renders form in edit mode', () => {
    const defaultProps = {
      stepName: 'Manifest details',
      manifestIdsList: [],
      expressions: [],
      initialValues: {
        identifier: 'testidentifier',
        type: ManifestDataType.KustomizePatches,
        spec: {
          store: {
            spec: {
              branch: 'testBranch',
              commitId: undefined,
              connectorRef: '',
              gitFetchType: 'Branch',
              paths: []
            },
            type: 'Git'
          }
        }
      },
      selectedManifest: ManifestDataType.KustomizePatches,
      prevStepData: {
        store: 'Git'
      },
      handleSubmit: jest.fn()
    }
    const { container } = render(
      <TestWrapper>
        <KustomizePatchesDetails {...defaultProps} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})