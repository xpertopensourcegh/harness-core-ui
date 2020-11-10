import React, { useState } from 'react'
import { Button, TextInput, useModalHook, Container, Heading } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { useGetInputSetsListForPipeline } from 'services/cd-ng'
import { AddDrawer } from '@common/components'
import { DrawerContext } from '@common/components/AddDrawer/AddDrawer'
import { getCategoryItems, ItemInterface } from './TriggersListUtils'
import css from './TriggersList.module.scss'

interface TriggerDataInterface {
  triggerType: string
  source: string
  // all else optional
}

interface TriggersListPropsInterface {
  isTriggerWizardOpen: boolean
  onTriggerClick: (val: TriggerDataInterface) => void
}
export default function TriggersList(props: TriggersListPropsInterface): JSX.Element {
  const { isTriggerWizardOpen, onTriggerClick } = props

  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()

  const [searchParam, setSearchParam] = useState('')
  //
  const [page] = useState(0)
  const { getString: getGlobalString } = useStrings()
  const { getString: getTriggersString } = useStrings('pipeline-triggers')

  // temporary until api ready for triggers
  const { refetch, error } = useGetInputSetsListForPipeline({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      pipelineIdentifier,
      pageIndex: page,
      pageSize: 10,
      searchTerm: searchParam
    }
  })

  const [openDrawer, hideDrawer] = useModalHook(() => {
    const onSelect = (val: ItemInterface) => {
      if (val?.categoryLabel) {
        hideDrawer()
        onTriggerClick({ triggerType: val.categoryLabel, source: val.value })
      }
    }

    return (
      <AddDrawer
        addDrawerMap={getCategoryItems()}
        onSelect={onSelect}
        onClose={hideDrawer}
        drawerContext={DrawerContext.STUDIO}
      />
    )
  })

  return !isTriggerWizardOpen ? (
    <>
      <Page.Header
        title={<Button text={getTriggersString('newTrigger')} intent="primary" onClick={openDrawer}></Button>}
        toolbar={
          <TextInput
            leftIcon="search"
            placeholder={getGlobalString('search')}
            className={css.search}
            value={searchParam}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParam(e.target.value.trim())
            }}
          />
        }
      />
      <Page.Body
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => !isTriggerWizardOpen,
          icon: 'yaml-builder-input-sets',
          message: getTriggersString('aboutTriggers'),
          buttonText: getTriggersString('addNewTrigger'),
          onClick: openDrawer
        }}
      >
        <Container
          style={{ borderTop: '1px solid var(--grey-300)', maxWidth: 900, margin: '0 auto' }}
          padding={{ bottom: 'small' }}
        >
          <Heading level={2}>TBD</Heading>
        </Container>
      </Page.Body>
    </>
  ) : (
    null!
  )
}
