import React, { useState } from 'react'
import { Button, TextInput, useModalHook } from '@wings-software/uikit'
import { useParams, useHistory } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useGetTriggerListForTarget } from 'services/cd-ng'
import { AddDrawer } from '@common/components'
import { DrawerContext } from '@common/components/AddDrawer/AddDrawer'
import { TriggersListSection, GoToEditWizardInterface } from './TriggersListSection'
import { getCategoryItems, ItemInterface } from '../utils/TriggersListUtils'
import css from './TriggersList.module.scss'
interface TriggerDataInterface {
  triggerType: string
  sourceRepo: string
  // all else optional
}

interface TriggersListPropsInterface {
  onNewTriggerClick: (val: TriggerDataInterface) => void
}
export default function TriggersList(props: TriggersListPropsInterface): JSX.Element {
  const { onNewTriggerClick } = props

  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()

  const [searchParam, setSearchParam] = useState('')
  const { getString } = useStrings()

  const { data: triggerListResponse, error, refetch, loading } = useGetTriggerListForTarget({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      targetIdentifier: pipelineIdentifier,
      searchTerm: searchParam
    },
    debounce: 300
  })
  const triggerList = triggerListResponse?.data?.content || undefined
  const history = useHistory()

  const goToEditWizard = ({ triggerIdentifier, triggerType }: GoToEditWizardInterface): void => {
    history.push(
      routes.toCDTriggersWizardPage({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier,
        triggerIdentifier,
        triggerType
      })
    )
  }

  const [openDrawer, hideDrawer] = useModalHook(() => {
    const onSelect = (val: ItemInterface): void => {
      if (val?.categoryValue) {
        hideDrawer()
        onNewTriggerClick({ triggerType: val.categoryValue, sourceRepo: val.value })
      }
    }

    return (
      <AddDrawer
        addDrawerMap={getCategoryItems(getString)}
        onSelect={onSelect}
        onClose={hideDrawer}
        drawerContext={DrawerContext.STUDIO}
      />
    )
  })

  return (
    <>
      <Page.Header
        title={<Button text={getString('pipeline-triggers.newTrigger')} intent="primary" onClick={openDrawer}></Button>}
        toolbar={
          <TextInput
            leftIcon="search"
            placeholder={getString('search')}
            data-name="search"
            className={css.search}
            value={searchParam}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParam(e.target.value.trim())
            }}
          />
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => Array.isArray(triggerList) && triggerList.length === 0,
          icon: 'yaml-builder-trigger',
          message: getString('pipeline-triggers.aboutTriggers'),
          buttonText: getString('pipeline-triggers.addNewTrigger'),
          onClick: openDrawer
        }}
      >
        <TriggersListSection data={triggerList} refetchTriggerList={refetch} goToEditWizard={goToEditWizard} />
      </Page.Body>
    </>
  )
}
