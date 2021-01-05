import React from 'react'
import { render, waitFor, fireEvent, queryByText } from '@testing-library/react'
import { ModalProvider, useModalHook, Container } from '@wings-software/uicore'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { getTriggerListDefaultProps } from './mockConstants'
import AddDrawer from '../AddDrawer'

const value: AppStoreContextProps = {
  strings,
  updateAppStore: jest.fn()
}
const defaultAddDrawerTriggersProps = getTriggerListDefaultProps()

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

function WrapperComponent(): JSX.Element {
  const [openDrawer, hideDrawer] = useModalHook(() => (
    <StringsContext.Provider value={value}>
      <AddDrawer {...defaultAddDrawerTriggersProps} />
    </StringsContext.Provider>
  ))

  return (
    <Container>
      <button
        onClick={() => {
          openDrawer()
        }}
        className="openModal"
      />
      <button className="closeModal" onClick={() => hideDrawer()} />
    </Container>
  )
}

describe('AddDrawer Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Trigger List Add Drawer', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      const openButton = container.querySelector('.openModal')
      if (!openButton) {
        throw Error('open button was not found.')
      }
      fireEvent.click(openButton)
      await waitFor(() => expect(document.body.querySelector(`.stepPalette`)).not.toBeNull())
      expect(document.body).toMatchSnapshot()

      // Should properly hide/close
      const closeButton = container.querySelector('.closeModal')
      if (!closeButton) {
        throw Error('close button was not found.')
      }
      fireEvent.click(closeButton)

      await waitFor(() => expect(container.querySelector(`.stepPalette`)).toBeNull())
    })
  })

  describe('Interactivity', () => {
    test('Filter by clicking on a category', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      const openButton = container.querySelector('.openModal')
      if (!openButton) {
        throw Error('open button was not found.')
      }
      fireEvent.click(openButton)

      const webhookCategoryButton = queryByText(
        document.body,
        `${result.current.getString('execution.triggerType.WEBHOOK')} (3)`
      )
      const categories = document.body.querySelectorAll('[class*="categorySteps"]')
      expect(categories.length).toEqual(3) // New Artifact/Manifest, Scheduled, Webhook
      await waitFor(() => expect(webhookCategoryButton).not.toBeNull())

      webhookCategoryButton && fireEvent.click(webhookCategoryButton)
      await waitFor(() => expect(document.body.querySelector('[class*="active"]')).not.toBeNull())
      const newCategories = document.body.querySelectorAll('[class*="categorySteps"]')

      expect(newCategories.length).toEqual(1)

      //   Show all again
      const showAllButton = queryByText(
        document.body,
        `${result.current.getString('pipeline-triggers.showAllTriggers')} (3)`
      )
      if (!showAllButton) {
        throw Error('open button was not found.')
      }
      fireEvent.click(showAllButton)
      await waitFor(() =>
        expect(
          queryByText(document.body, result.current.getString('pipeline-triggers.newArtifactLabel'))
        ).not.toBeNull()
      )
      const resetCategories = document.body.querySelectorAll('[class*="categorySteps"]')

      expect(resetCategories.length).toEqual(3)
    })

    test('Filter by Searching for a Trigger Name', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      const openButton = container.querySelector('.openModal')
      if (!openButton) {
        throw Error('open button was not found.')
      }
      fireEvent.click(openButton)
      const searchButton = document.body.querySelector('[class*="ExpandingSearchInput"]')
      expect(queryByText(document.body, result.current.getString('repo-provider.bitbucketLabel'))).not.toBeNull()
      await waitFor(() => expect(searchButton).not.toBeNull())
      if (!searchButton) {
        throw Error('no search button found')
      }
      fireEvent.click(searchButton)
      const searchButtonInput = searchButton.querySelector('input')
      if (!searchButtonInput) {
        throw Error('no search input')
      }
      fireEvent.change(searchButtonInput, { target: { value: result.current.getString('repo-provider.githubLabel') } })
      await waitFor(() =>
        expect(queryByText(document.body, result.current.getString('repo-provider.bitbucketLabel'))).toBeNull()
      )
      const triggerCards = document.body.querySelectorAll('[class*="stepsRenderer"] [class*="card"]')

      expect(triggerCards.length).toEqual(1)
    })

    test('Selecting an item triggers event', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      const openButton = container.querySelector('.openModal')
      if (!openButton) {
        throw Error('open button was not found.')
      }
      fireEvent.click(openButton)
      await waitFor(() => expect(document.body.querySelector(`.stepPalette`)).not.toBeNull())
      const bitBucketCard = queryByText(document.body, result.current.getString('repo-provider.bitbucketLabel'))
      if (!bitBucketCard) {
        throw Error('no BitBucket card')
      }

      fireEvent.click(bitBucketCard)

      expect(defaultAddDrawerTriggersProps.onSelect).toBeCalled()
    })
  })
})
