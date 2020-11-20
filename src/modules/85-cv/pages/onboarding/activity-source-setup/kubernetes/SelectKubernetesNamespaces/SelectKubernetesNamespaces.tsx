import React, { useState } from 'react'
import { Color, Container, ExpandingSearchInput, Formik, FormikForm, Heading, Text } from '@wings-software/uikit'
import type { CellProps } from 'react-table'
import { useRouteParams } from 'framework/exports'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { PageError } from '@common/components/Page/PageError'
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

interface TableHeaderWithSearchProps {
  filteredNamespace?: string
  onFilter: (filterValue: string) => void
}

type TableData = { selected: boolean; namespace: string }

export const SelectKubernetesNamespaceFieldNames = {
  SELECTED_NAME_SPACES: 'selectedNamespaces'
}

function validate(values: { selectedNamespaces: Set<string> }): { [key: string]: string } {
  const errors = { [SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES]: '' }
  if (!values.selectedNamespaces?.size) {
    errors[SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES] = i18n.validationText.namespace
  }
  return errors
}

function generateTableData(apiData: string[], selectedNamespaces?: string[]): TableData[] {
  const tableData = []
  for (const namespace of apiData) {
    tableData.push({
      selected: Boolean(selectedNamespaces?.find(selectedNamespace => selectedNamespace === namespace)),
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

function TableHeaderWithSearch(props: TableHeaderWithSearchProps): JSX.Element {
  const { filteredNamespace, onFilter } = props
  return (
    <Container flex>
      <Text color={Color.BLACK}>{i18n.tableColumnName.kubernetesNamespace}</Text>{' '}
      <ExpandingSearchInput
        throttle={300}
        defaultValue={filteredNamespace}
        onChange={namespaceSubstring => onFilter(namespaceSubstring)}
      />
    </Container>
  )
}

export function SelectKubernetesNamespaces(props: SelectKubernetesNamespacesProps): JSX.Element {
  const { onSubmit, onPrevious, data: propsData } = props
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
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

  const nameSpaces = generateTableData(content, propsData?.selectedNamespaces)

  return (
    <Formik
      initialValues={{ ...propsData, selectedNamespaces: new Set<string>() }}
      onSubmit={values => onSubmit({ ...values, selectedNamespaces: Array.from(values.selectedNamespaces.keys()) })}
      validate={validate}
    >
      {formikProps => {
        const { selectedNamespaces } = formikProps.values
        return (
          <FormikForm>
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
                    Cell: function CheckColumn(tableProps) {
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
                            formikProps.setFieldValue(
                              SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES,
                              new Set(selectedNamespaces)
                            )
                          }}
                        />
                      )
                    },
                    disableSortBy: true
                  },
                  {
                    Header: function TableHeaderWrapper() {
                      return (
                        <TableHeaderWithSearch
                          filteredNamespace={filteredNamespace}
                          onFilter={namespaceSubstring =>
                            setFilterAndPageOffset({ pageOffset: 0, filteredNamespace: namespaceSubstring })
                          }
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
                  formikProps.setFieldValue(
                    SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES,
                    new Set(selectedNamespaces)
                  )
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
              {formikProps.errors.selectedNamespaces ? (
                <Text data-name="validation" intent="danger">
                  {formikProps.errors.selectedNamespaces}
                </Text>
              ) : null}
            </Container>
            <SubmitAndPreviousButtons onPreviousClick={onPrevious} />
          </FormikForm>
        )
      }}
    </Formik>
  )
}
