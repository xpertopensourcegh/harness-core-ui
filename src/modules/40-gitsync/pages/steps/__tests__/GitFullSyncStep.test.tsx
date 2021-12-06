import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { noop } from 'lodash-es'
import * as cdngServices from 'services/cd-ng'
import { TestWrapper } from '@common/utils/testUtils'
import { GitFullSyncStep } from '@gitsync/pages/steps/GitFullSyncStep/GitFullSyncStep'

const pathParams = { accountId: 'dummy', orgIdentifier: 'default', projectIdentifier: 'dummyProject' }

describe('Test GitFullSyncStep', () => {
  test('Should render GitFullSyncStep', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/admin/git-sync/repos"
        pathParams={pathParams}
      >
        <GitFullSyncStep name="" onClose={noop} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('Should have base branch hidden by default and it should appear when toggle is enabled', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/admin/git-sync/repos"
        pathParams={pathParams}
      >
        <GitFullSyncStep name="" onClose={noop} />
      </TestWrapper>
    )
    expect(container.querySelector('input[name="baseBranch"]')).toBeFalsy()
    const toggle = container.querySelector('input[name="startPullRequest"]')
    await act(async () => {
      fireEvent.click(toggle!)
    })
    expect(container.querySelector('input[name="baseBranch"]')).toBeTruthy()
  })
  test('Should have the start sync button disabled', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/admin/git-sync/repos"
        pathParams={pathParams}
      >
        <GitFullSyncStep name="" onClose={noop} />
      </TestWrapper>
    )
    const submitButton = container.querySelector('button[type="submit"]')
    expect(submitButton).toHaveAttribute('disabled')
  })
  test('Should enabled start sync button when data is entered and call appropriate apis', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/admin/git-sync/repos"
        pathParams={pathParams}
      >
        <GitFullSyncStep name="" onClose={noop} />
      </TestWrapper>
    )

    const mockCreateGitFullSyncConfigPromise = jest
      .spyOn(cdngServices, 'createGitFullSyncConfigPromise')
      .mockImplementation(() => {
        return Promise.resolve({})
      })

    const mockTriggerFullSyncPromise = jest
      .spyOn(cdngServices, 'createGitFullSyncConfigPromise')
      .mockImplementation(() => {
        return Promise.resolve({})
      })

    const branch = container.querySelector('input[name="branch"]')!
    const toggle = container.querySelector('input[name="startPullRequest"]')!
    const title = container.querySelector('input[name="title"]')!
    const getSubmitButton = (): Element => container.querySelector('button[type="submit"]')!

    expect(getSubmitButton()).toHaveAttribute('disabled')
    await act(async () => {
      fireEvent.change(branch, {
        target: { value: 'branch' }
      })
    })
    await act(async () => {
      fireEvent.change(title, {
        target: { value: 'title' }
      })
    })
    expect(getSubmitButton()).not.toHaveAttribute('disabled')
    await act(async () => {
      fireEvent.click(toggle!)
    })
    expect(getSubmitButton()).toHaveAttribute('disabled')
    const baseBranch = container.querySelector('input[name="baseBranch"]')!
    await act(async () => {
      fireEvent.change(baseBranch, {
        target: { value: 'baseBranch' }
      })
    })
    expect(getSubmitButton()).not.toHaveAttribute('disabled')

    expect(mockCreateGitFullSyncConfigPromise).not.toHaveBeenCalled()
    expect(mockTriggerFullSyncPromise).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.click(getSubmitButton()!)
    })

    expect(mockCreateGitFullSyncConfigPromise).toHaveBeenCalled()
    expect(mockTriggerFullSyncPromise).toHaveBeenCalled()
  })
})
