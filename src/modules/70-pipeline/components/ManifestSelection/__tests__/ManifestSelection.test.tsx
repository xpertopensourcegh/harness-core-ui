import React from 'react'
import { render, findByText, fireEvent, findAllByText, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ManifestSelection from '../ManifestSelection'
import ManifestListView from '../ManifestListView'
import pipelineContextMock from './pipeline_mock.json'
import connectorsData from './connectors_mock.json'

const fetchConnectors = (): Promise<unknown> => Promise.resolve(connectorsData)

jest.mock('@common/components/YAMLBuilder/YamlBuilder')

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
    const addFileButton = await findByText(container, 'pipelineSteps.serviceTab.manifestList.addManifest')
    expect(addFileButton).toBeDefined()
    fireEvent.click(addFileButton)
    const portal = document.getElementsByClassName('bp3-dialog')[0]
    const manifestLabel = await waitFor(() =>
      findByText(portal as HTMLElement, 'pipeline.manifestType.manifestRepoType')
    )
    expect(manifestLabel).toBeDefined()
    const closeButton = portal.querySelector("button[class*='crossIcon']") as Element
    fireEvent.click(closeButton)
    expect(container).toMatchSnapshot()
  })

  test(`renders Manifest Wizard popover`, async () => {
    const { container } = render(
      <TestWrapper>
        <ManifestSelection isForOverrideSets={false} isForPredefinedSets={false} />
      </TestWrapper>
    )
    const addFileButton = await findByText(container, 'pipelineSteps.serviceTab.manifestList.addManifest')
    expect(addFileButton).toBeDefined()
    fireEvent.click(addFileButton)
    const portal = document.getElementsByClassName('bp3-dialog')[0]
    const manifestLabel = await waitFor(() =>
      findByText(portal as HTMLElement, 'pipeline.manifestType.manifestRepoType')
    )
    expect(manifestLabel).toBeDefined()
    const manifestTypes = await waitFor(() =>
      findAllByText(portal as HTMLElement, 'pipeline.manifestTypeLabels.K8sManifest')
    )
    expect(manifestTypes).toBeDefined()
    fireEvent.click(manifestTypes[0])
    const continueButton = await findByText(portal as HTMLElement, 'continue')
    expect(continueButton).toBeDefined()
  })

  test(`renders Manifest Listview without crashing`, () => {
    const props = {
      isPropagating: false,
      pipeline: pipelineContextMock,
      updateStage: jest.fn(),
      stage: pipelineContextMock.stages[0],
      isForOverrideSets: false,
      identifierName: '',
      isForPredefinedSets: false,
      overrideSetIdentifier: '',
      connectors: undefined,
      refetchConnectors: jest.fn(),
      isReadonly: false,
      listOfManifests: []
    }
    const { container } = render(
      <TestWrapper>
        <ManifestListView {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders Manifest Listview with connectors Data`, () => {
    const props = {
      isPropagating: false,
      pipeline: pipelineContextMock,
      updateStage: jest.fn(),
      stage: pipelineContextMock.stages[0],
      isForOverrideSets: false,
      identifierName: '',
      isForPredefinedSets: false,
      overrideSetIdentifier: '',
      connectors: connectorsData.data as any,
      refetchConnectors: jest.fn(),
      isReadonly: false,
      listOfManifests: []
    }
    const { container } = render(
      <TestWrapper>
        <ManifestListView {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders Manifest Listview with overrideSetIdentifier, isPropagating, isForOverrideSets`, () => {
    const props = {
      isPropagating: true,
      pipeline: pipelineContextMock,
      updateStage: jest.fn(),
      stage: pipelineContextMock.stages[0],
      isForOverrideSets: true,
      identifierName: '',
      isForPredefinedSets: false,
      overrideSetIdentifier: 'overrideSetIdentifier',
      connectors: connectorsData.data as any,
      refetchConnectors: jest.fn(),
      isReadonly: false,
      listOfManifests: []
    }
    const { container } = render(
      <TestWrapper>
        <ManifestListView {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`delete manifest list works correctly`, async () => {
    const props = {
      isPropagating: false,
      pipeline: pipelineContextMock,
      updateStage: jest.fn(),
      stage: pipelineContextMock.stages[0],
      isForOverrideSets: false,
      identifierName: '',
      isForPredefinedSets: false,
      overrideSetIdentifier: '',
      connectors: connectorsData.data as any,
      refetchConnectors: jest.fn(),
      isReadonly: false,
      listOfManifests: [
        {
          manifest: {
            identifier: 'idtest',
            type: 'K8sManifest',
            spec: {
              store: {
                type: 'Git',
                spec: {
                  connectorRef: 'account.Rohan_Github_ALL_HANDS',
                  gitFetchType: 'Branch',
                  paths: ['path'],
                  branch: 'master'
                }
              },
              skipResourceVersioning: false
            }
          }
        }
      ]
    }
    const { container } = render(
      <TestWrapper>
        <ManifestListView {...props} />
      </TestWrapper>
    )

    const deleteManifestBtn = container.querySelector('[data-icon="main-trash"]') as Element
    expect(deleteManifestBtn).toBeDefined()
    fireEvent.click(deleteManifestBtn)

    expect(container).toMatchSnapshot()
  })

  test(`edit manifest list works correctly`, async () => {
    const props = {
      isPropagating: false,
      pipeline: pipelineContextMock,
      updateStage: jest.fn(),
      stage: pipelineContextMock.stages[0],
      isForOverrideSets: false,
      identifierName: '',
      isForPredefinedSets: false,
      overrideSetIdentifier: '',
      connectors: connectorsData.data as any,
      refetchConnectors: jest.fn(),
      isReadonly: false,
      listOfManifests: [
        {
          manifest: {
            identifier: 'id77',
            type: 'Kustomize',
            spec: {
              store: {
                type: 'Bitbucket',
                spec: {
                  connectorRef: 'account.Testbitbucke',
                  gitFetchType: 'Branch',
                  folderPath: 'test',
                  branch: 'master'
                }
              },
              pluginPath: 'path',
              skipResourceVersioning: false
            }
          }
        }
      ]
    }
    const { container } = render(
      <TestWrapper>
        <ManifestListView {...props} />
      </TestWrapper>
    )

    const editManifestBtn = container.querySelectorAll('[data-icon="edit"]')[0]
    expect(editManifestBtn).toBeDefined()
    fireEvent.click(editManifestBtn)
    const portal = document.getElementsByClassName('bp3-dialog')[0]
    const manifestLabel = await waitFor(() =>
      findByText(portal as HTMLElement, 'pipeline.manifestType.manifestRepoType')
    )
    expect(manifestLabel).toBeDefined()
    const closeButton = portal.querySelector("button[class*='crossIcon']") as Element
    fireEvent.click(closeButton)
    expect(container).toMatchSnapshot()
  })
})
