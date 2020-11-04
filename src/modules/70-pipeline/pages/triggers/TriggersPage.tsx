import React, { useState } from 'react'
import { Button, Layout, TextInput, useModalHook, Container, Heading } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { useGetInputSetsListForPipeline } from 'services/cd-ng'
import { triggerTypesMap } from './TriggersHelper'
import BeginWizardDrawer from './BeginWizardDrawer'
import i18n from './TriggersPage.i18n'
import css from './TriggersPage.module.scss'

const TriggersPage: React.FC = (): JSX.Element => {
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const [searchParam, setSearchParam] = useState('')
  const [page] = useState(0)
  // temporary until api ready for triggers
  const { data: inputSet, refetch, error } = useGetInputSetsListForPipeline({
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

  const [openModal, hideModal] = useModalHook(() => (
    <BeginWizardDrawer categoryItemsMap={triggerTypesMap} onItemClick={() => null} onHide={hideModal} />
  ))

  return (
    <>
      <Page.Header
        title={<Button text={i18n.newTrigger} intent="primary" onClick={openModal}></Button>}
        toolbar={
          <Layout.Horizontal spacing="small">
            <TextInput
              leftIcon="search"
              placeholder={i18n.search}
              className={css.search}
              value={searchParam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParam(e.target.value.trim())
              }}
            />
          </Layout.Horizontal>
        }
      ></Page.Header>
      <Page.Body
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => !inputSet?.data?.content?.length,
          icon: 'yaml-builder-input-sets',
          message: i18n.aboutTriggers,
          buttonText: i18n.addNewTrigger,
          onClick: openModal
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
  )
}

export default TriggersPage
