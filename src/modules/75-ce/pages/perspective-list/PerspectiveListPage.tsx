import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Layout, Button, Container, ExpandingSearchInput, FlexExpander } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitions'
import { Page } from '@common/components/Page/Page'
import { useToaster } from '@common/components'
import { useCreatePerspective, CEView } from 'services/ce'
import { QlceView, useFetchAllPerspectivesQuery, ViewState } from 'services/ce/services'
import { generateId, CREATE_CALL_OBJECT } from '@ce/utils/perspectiveUtils'
import PerspectiveListView from '@ce/components/PerspectiveViews/PerspectiveListView'
import PerspectiveGridView from '@ce/components/PerspectiveViews/PerspectiveGridView'
import css from './PerspectiveListPage.module.scss'

enum Views {
  LIST,
  GRID
}

const PerspectiveListPage: React.FC = () => {
  const [result] = useFetchAllPerspectivesQuery()
  const history = useHistory()
  const { accountId } = useParams<{
    accountId: string
  }>()
  const { data, fetching } = result
  const [searchParam, setSearchParam] = useState<string>('')
  const { getString } = useStrings()
  const { showError } = useToaster()
  const [view, setView] = useState(Views.GRID)

  const { mutate: createView } = useCreatePerspective({
    queryParams: {
      accountId: accountId
    }
  })

  const createNewPerspective: (values: Record<string, string>) => void = async (values = {}) => {
    let formData: Record<string, any> = {
      ...values,
      viewVersion: 'v1'
    }

    formData['name'] = `Perspective-${generateId(6).toUpperCase()}`
    formData = { ...CREATE_CALL_OBJECT, ...formData }

    const { resource } = await createView(formData as CEView)

    const uuid = resource?.uuid

    // Need to handle error states - Cloning as well

    if (uuid) {
      history.push(
        routes.toCECreatePerspective({
          accountId: accountId,
          perspectiveId: uuid
        })
      )
    } else {
      showError("Can't create perspective")
    }

    // if (error) {
    //   if (toBeCloned) {
    //     toBeCloned = null
    //     setError && setError(error)
    //   } else {
    //     toaster.show({ message: error, timeout: 3000, intent: 'danger' })
    //   }
    // } else if (createViews) {
    //   if (toBeCloned) {
    //     props?.hide()
    //     toBeCloned = null
    //   }
    //   if (createViews?.uuid) {
    //     props.router.push(
    //       props.path.toCreateCloudViews({
    //         accountId: props.urlParams.accountId,
    //         viewId: createViews?.uuid
    //       })
    //     )
    //   }
    // }
  }

  const navigateToPerspectiveDetailsPage: (perspectiveId: string, viewState?: ViewState) => void = (
    perspectiveId,
    viewState
  ) => {
    if (viewState !== ViewState.Draft) {
      history.push(
        routes.toPerspectiveDetails({
          accountId: accountId,
          perspectiveId: perspectiveId,
          perspectiveName: perspectiveId
        })
      )
    } else {
      history.push(
        routes.toCECreatePerspective({
          accountId,
          perspectiveId
        })
      )
    }
  }

  const pespectiveList = data?.perspectives?.customerViews || []

  const filteredPerspectiveData = pespectiveList.filter(per => {
    if (!per?.name) {
      return false
    }
    if (per.name.toLowerCase().indexOf(searchParam.toLowerCase()) < 0) {
      return false
    }
    return true
  }) as QlceView[]
  return (
    <>
      <Page.Header title="Perspectives" />
      <Layout.Horizontal spacing="large" className={css.header}>
        <Button
          intent="primary"
          text="New Perspective"
          icon="plus"
          onClick={() => {
            createNewPerspective({})
          }}
        />
        <FlexExpander />

        <ExpandingSearchInput
          placeholder={getString('ce.perspectives.searchPerspectives')}
          onChange={text => {
            setSearchParam(text.trim())
          }}
          className={css.search}
        />
        <Layout.Horizontal>
          <Button
            minimal
            icon="grid-view"
            intent={view === Views.GRID ? 'primary' : undefined}
            onClick={() => {
              setView(Views.GRID)
            }}
          />
          <Button
            minimal
            icon="list"
            intent={view === Views.LIST ? 'primary' : undefined}
            onClick={() => {
              setView(Views.LIST)
            }}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Page.Body>
        {fetching && <Page.Spinner />}
        <Container padding="xxxlarge">
          {pespectiveList ? (
            view === Views.GRID ? (
              <PerspectiveGridView
                pespectiveData={filteredPerspectiveData}
                navigateToPerspectiveDetailsPage={navigateToPerspectiveDetailsPage}
              />
            ) : (
              <PerspectiveListView
                pespectiveData={filteredPerspectiveData}
                navigateToPerspectiveDetailsPage={navigateToPerspectiveDetailsPage}
              />
            )
          ) : null}
        </Container>
      </Page.Body>
    </>
  )
}

export default PerspectiveListPage
