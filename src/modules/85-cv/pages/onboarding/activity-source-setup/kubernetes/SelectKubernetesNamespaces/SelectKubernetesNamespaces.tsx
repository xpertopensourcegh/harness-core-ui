import React, { useState } from 'react'
import { Color, Container, Heading, Text } from '@wings-software/uikit'
import type { CellProps } from 'react-table'
import { useParams } from 'react-router-dom'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { PageError } from '@common/components/Page/PageError'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useGetNamespaces } from 'services/cv'
import { PageSpinner, Table } from '@common/components'
import i18n from './SelectKubernetesNamespaces.i18n'
import css from './SelectKubernetesNamespaces.module.scss'

interface SelectKubernetesNamespacesProps {
  onSubmit: (data: any) => void
  onPrevious: () => void
  data?: any
}

type TableData = { selected: boolean; namespace: string }

export const SelectKubernetesNamespaceFieldNames = {
  SELECTED_NAME_SPACES: 'selectedNamespaces'
}

function validate(selectedNamespaces: Set<string>): boolean {
  return selectedNamespaces?.size > 0
}

function generateTableData(apiData: string[], selectedNamespaces?: Set<string>): TableData[] {
  const tableData = []
  for (const namespace of apiData) {
    tableData.push({
      selected: Boolean(selectedNamespaces?.has(namespace)),
      namespace
    })
  }

  return tableData
}

function NamespaceValue(tableProps: CellProps<TableData>): JSX.Element {
  const namespace = tableProps.value
  return (
    <Text
      icon="service-kubernetes"
      iconProps={{ size: 20, style: { marginRight: 'var(--spacing-small)' } }}
      color={Color.BLACK}
    >
      {namespace}
    </Text>
  )
}

export function SelectKubernetesNamespaces(props: SelectKubernetesNamespacesProps): JSX.Element {
  const { onSubmit, onPrevious, data: propsData } = props
  const [selectedNamespaces, setSelectedNamespaces] = useState(new Set<string>(propsData?.selectedNamespaces || []))
  const [isValid, setIsValid] = useState(true)
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [{ pageOffset, filteredNamespace }, setFilterAndPageOffset] = useState<{
    pageOffset: number
    filteredNamespace?: string
  }>({
    pageOffset: 0,
    filteredNamespace: undefined
  })
  const { loading, error, data, refetch: refetchNamespaces } = useGetNamespaces({
    queryParams: {
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      accountId,
      connectorIdentifier: propsData?.connectorRef?.value || '',
      pageSize: 8,
      filter: filteredNamespace,
      offset: pageOffset
    }
  })

  if (loading) {
    return (
      <Container className={css.loadingErrorNoData}>
        <PageSpinner />
      </Container>
    )
  }

  if (error?.message) {
    return (
      <Container className={css.loadingErrorNoData}>
        <PageError message={error.message} onClick={() => refetchNamespaces()} />
      </Container>
    )
  }

  const { content, pageIndex = 0, totalItems = 0, totalPages = 0, pageSize = 0 } = data?.resource || {}

  if (!content?.length) {
    return (
      <Container className={css.loadingErrorNoData}>
        <NoDataCard
          icon="warning-sign"
          message={i18n.noDataMessage}
          buttonText={i18n.retry}
          onClick={() => refetchNamespaces()}
        />
      </Container>
    )
  }

  const nameSpaces = generateTableData(content, selectedNamespaces)

  return (
    <Container>
      <Container className={css.main}>
        <Heading level="3" color={Color.BLACK}>
          {i18n.headingText}
        </Heading>
        <Table<TableData>
          className={css.table}
          columns={[
            {
              accessor: 'selected',
              width: '5%',
              Cell: function CheckColumn(tableProps: CellProps<TableData>) {
                const namespace = tableProps.row.original?.namespace
                const isChecked = selectedNamespaces.has(namespace)
                return (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={e => {
                      if (isChecked && !e.currentTarget.checked) {
                        selectedNamespaces.delete(namespace)
                      } else if (!isChecked && e.currentTarget.checked) {
                        selectedNamespaces.add(namespace)
                      }
                      setSelectedNamespaces(new Set(selectedNamespaces))
                    }}
                  />
                )
              },
              disableSortBy: true
            },
            {
              Header: function TableHeaderWrapper() {
                return (
                  <TableColumnWithFilter
                    appliedFilter={filteredNamespace}
                    onFilter={namespaceSubstring =>
                      setFilterAndPageOffset({ pageOffset: 0, filteredNamespace: namespaceSubstring })
                    }
                    columnName={i18n.tableColumnName.kubernetesNamespace}
                  />
                )
              },
              accessor: 'namespace',
              width: '95%',
              Cell: NamespaceValue,
              disableSortBy: true
            }
          ]}
          data={nameSpaces}
          onRowClick={rowData => {
            const { namespace } = rowData
            if (selectedNamespaces.has(namespace)) selectedNamespaces.delete(namespace)
            else selectedNamespaces.add(namespace)
            setSelectedNamespaces(new Set(selectedNamespaces))
          }}
          sortable={true}
          pagination={{
            pageSize: pageSize || 0,
            pageIndex: pageIndex,
            pageCount: totalPages,
            itemCount: totalItems,
            gotoPage: newPageIndex => setFilterAndPageOffset({ pageOffset: newPageIndex, filteredNamespace })
          }}
        />
        {!isValid ? (
          <Text data-name="validation" intent="danger">
            {i18n.validationText.namespace}
          </Text>
        ) : null}
      </Container>
      <SubmitAndPreviousButtons
        onPreviousClick={onPrevious}
        onNextClick={() => {
          if (!validate(selectedNamespaces)) setIsValid(false)
          else
            onSubmit({
              ...propsData,
              [SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES]: Array.from(selectedNamespaces.values())
            })
        }}
      />
    </Container>
  )
}
