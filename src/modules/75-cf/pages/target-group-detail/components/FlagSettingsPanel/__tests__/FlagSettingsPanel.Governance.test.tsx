import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as uuid from 'uuid'
import * as cfServices from 'services/cf'
import type { Features } from 'services/cf'
import { TestWrapper } from '@common/utils/testUtils'
import { CF_DEFAULT_PAGE_SIZE } from '@cf/utils/CFUtils'
import { FFGitSyncProvider } from '@cf/contexts/ff-git-sync-context/FFGitSyncContext'
import * as useFeatureFlagMock from '@common/hooks/useFeatureFlag'
import { mockFeatures, mockTargetGroup } from '@cf/pages/target-group-detail/__tests__/mocks'
import FlagSettingsPanel, { FlagSettingsPanelProps } from '../FlagSettingsPanel'
import * as useGetTargetGroupFlagsHook from '../../../hooks/useGetTargetGroupFlags'

const mockResponse = (): Features =>
  ({
    features: [
      {
        identifier: 'f1',
        name: 'Flag 1',
        variations: [
          { name: 'Variation 1', identifier: 'v1' },
          { name: 'Variation 2', identifier: 'v2' },
          { identifier: 'v3' }
        ],
        envProperties: {
          variationMap: [
            { variation: 'v1', targets: [{ identifier: mockTargetGroup.identifier, name: mockTargetGroup.name }] }
          ]
        }
      }
    ],
    pageIndex: 0,
    pageSize: CF_DEFAULT_PAGE_SIZE,
    itemCount: 1,
    pageCount: Math.ceil(1 / CF_DEFAULT_PAGE_SIZE),
    version: 1
  } as Features)

jest.mock('@governance/EvaluationModal', () => ({
  EvaluationModal: () => <div>GOVERNANCE MODAL</div>
}))

jest.mock('uuid')

const renderComponent = (props: Partial<FlagSettingsPanelProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <FFGitSyncProvider>
        <FlagSettingsPanel targetGroup={mockTargetGroup} {...props} />
      </FFGitSyncProvider>
    </TestWrapper>
  )

describe('Flag Settings Panel Governance', () => {
  const patchGitRepoMock = jest.fn()
  const patchTargetGroupMock = jest.fn()

  beforeAll(() => {
    jest.spyOn(useFeatureFlagMock, 'useFeatureFlag').mockReturnValue(true)
    jest.spyOn(uuid, 'v4').mockReturnValue('UUID')
  })

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(cfServices, 'useGetGitRepo').mockReturnValue({
      loading: false,
      refetch: jest.fn(),
      data: {
        repoDetails: {
          autoCommit: false,
          branch: 'main',
          enabled: false,
          filePath: '/flags.yaml',
          repoIdentifier: 'harnesstest',
          rootFolder: '/.harness/',
          yamlError: ''
        },
        repoSet: false
      }
    } as any)

    jest.spyOn(useGetTargetGroupFlagsHook, 'default').mockReturnValue({
      data: mockFeatures,
      loading: false,
      error: null,
      refetch: jest.fn()
    } as any)

    jest.spyOn(cfServices, 'useGetAllFeatures').mockReturnValue({
      data: mockResponse(),
      loading: false,
      error: null,
      refetch: jest.fn()
    } as any)

    jest.spyOn(cfServices, 'usePatchSegment').mockReturnValue({
      mutate: patchTargetGroupMock,
      loading: false,
      refetch: jest.fn()
    } as any)

    jest.spyOn(cfServices, 'useGetAllSegments').mockReturnValue({
      data: { segments: mockTargetGroup },
      loading: false,
      refetch: jest.fn()
    } as any)

    jest.spyOn(cfServices, 'usePatchGitRepo').mockReturnValue({
      mutate: patchGitRepoMock,
      loading: false,
      refetch: jest.fn()
    } as any)
  })

  test('it should show governance modal if governance data present in successful response', async () => {
    patchTargetGroupMock.mockResolvedValue({
      details: { governanceMetadata: { status: 'warning', message: 'governance warning' } }
    })

    renderComponent()

    const flag1Variation = document.querySelector('[name="flags.f1.variation"]')!

    // assert dropdown value = false
    await waitFor(() => expect(flag1Variation).toBeInTheDocument())

    expect(flag1Variation).toHaveValue('Variation 1')

    // change the variation value
    userEvent.click(flag1Variation)
    const variation2 = screen.getAllByText('Variation 2')[0]
    expect(variation2).toBeInTheDocument()
    userEvent.click(variation2)

    // click save and assert modal appears
    const saveButton = await waitFor(() => screen.getByRole('button', { name: 'saveChanges' }))
    expect(saveButton).toBeInTheDocument()
    userEvent.click(saveButton)

    await waitFor(() => expect(screen.getByText('GOVERNANCE MODAL')).toBeInTheDocument())
  })

  test('it should show governance modal on governance error response', async () => {
    patchTargetGroupMock.mockRejectedValue({
      data: { details: { governanceMetadata: { status: 'error', message: 'governance error' } } }
    })

    renderComponent()

    const flag1Variation = document.querySelector('[name="flags.f1.variation"]')!

    // assert dropdown value = false
    await waitFor(() => expect(flag1Variation).toBeInTheDocument())

    expect(flag1Variation).toHaveValue('Variation 1')

    // change the variation value
    userEvent.click(flag1Variation)
    const variation2 = screen.getAllByText('Variation 2')[0]
    expect(variation2).toBeInTheDocument()
    userEvent.click(variation2)

    // click save and assert modal appears
    const saveButton = await waitFor(() => screen.getByRole('button', { name: 'saveChanges' }))
    expect(saveButton).toBeInTheDocument()
    userEvent.click(saveButton)

    await waitFor(() => expect(screen.getByText('GOVERNANCE MODAL')).toBeInTheDocument())
  })
})