import React, { useState } from 'react'

import { Button, Text, Color, Container, ExpandingSearchInput } from '@wings-software/uikit'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetPipelineList } from 'services/cd-ng'
import { Page } from '@common/exports'
import { String } from 'framework/exports'
import RunPipelineListView from './RunPipelineListView'
import css from './PipelineModalListView.module.scss'
export interface PipelineModalListViewProps extends ProjectPathProps, AccountPathProps {
  onClose: () => void
}

export default function PipelineModalListView({
  accountId,
  orgIdentifier,
  projectIdentifier,
  onClose
}: PipelineModalListViewProps): React.ReactElement {
  const [page, setPage] = useState(0)
  const [searchParam, setSearchParam] = React.useState('')

  const { data, loading, refetch } = useGetPipelineList({
    queryParams: {
      page,
      size: 10,
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      searchTerm: searchParam
    }
  })

  const handleSearch = (query: string): void => {
    setSearchParam(query)
  }

  return (
    <>
      <Page.Header
        title={
          <Text color={Color.GREY_800} font="medium">
            <String stringID="runPipelineText" />
          </Text>
        }
        toolbar={
          <Container>
            <Button icon="cross" minimal onClick={onClose} />
          </Container>
        }
      />
      <Page.Body className={css.main} loading={loading}>
        <div className={css.searchContainer}>
          <ExpandingSearchInput defaultValue={searchParam} className={css.search} onChange={handleSearch} />
        </div>

        {!data?.data?.content?.length ? (
          <div className={css.noResultSection}>
            <Text font="medium">
              <String stringID="noSearchResultsFoundPeriod" />
            </Text>
          </div>
        ) : null}

        <RunPipelineListView
          data={data?.data}
          refetch={refetch}
          gotoPage={pageNumber => setPage(pageNumber)}
          hideHeaders={true}
        />
      </Page.Body>
    </>
  )
}
