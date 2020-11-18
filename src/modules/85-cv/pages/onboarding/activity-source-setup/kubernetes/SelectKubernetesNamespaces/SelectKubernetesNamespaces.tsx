import React from 'react'
import { Color, Container, Formik, FormikForm, Heading, Text } from '@wings-software/uikit'
import type { CellProps } from 'react-table'
import type { FormikProps } from 'formik'
import { useRouteParams } from 'framework/exports'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { PageError } from '@common/components/Page/PageError'
import { useGetNamespaces } from 'services/cv'
import { PageSpinner, Table } from '@common/components'
import i18n from './SelectKubernetesNamespaces.i18n'
import css from './SelectKubernetesNamespaces.module.scss'

interface SelectKubernetesNamespacesProps {
  onSubmit: (data: string[]) => void
}

interface CheckedNamespaceProps {
  tableProps: CellProps<object>
  selectedNamespaces: Set<string>
  setFieldValue: (fieldName: string, value: Set<string>) => void
}

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

function NamespaceValue(tableProps: CellProps<object>): JSX.Element {
  const { original } = tableProps?.row || { original: '' }
  const namespace = (original as unknown) as string
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

function CheckedNamespace(props: CheckedNamespaceProps): JSX.Element {
  const { tableProps, selectedNamespaces, setFieldValue } = props
  const { original } = tableProps?.row || { original: '' }
  const namespace = (original as unknown) as string
  const selectedNamespace = selectedNamespaces.has(namespace)
  return (
    <input
      type="checkbox"
      checked={selectedNamespace}
      onClick={e => {
        if (selectedNamespace && !e.currentTarget.checked) {
          selectedNamespaces.delete(namespace)
        } else if (!selectedNamespace && e.currentTarget.checked) {
          selectedNamespaces.add(namespace)
        }
        setFieldValue(SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES, new Set(selectedNamespaces))
      }}
    />
  )
}

export function SelectKubernetesNamespaces(props: SelectKubernetesNamespacesProps): JSX.Element {
  const { onSubmit } = props
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const { loading, error, data, refetch: refetchNamespaces } = useGetNamespaces({
    queryParams: {
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      accountId,
      connnectorIdentifier: '1342'
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

  const nameSpaces = data?.resource

  if (!nameSpaces?.length) {
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

  return (
    <Container className={css.main}>
      <Heading level="3" color={Color.BLACK}>
        {i18n.headingText}
      </Heading>
      <Formik
        initialValues={{ selectedNamespaces: new Set<string>() }}
        onSubmit={values => onSubmit(Array.from(values.selectedNamespaces.keys()))}
        validate={validate}
      >
        {(formikProps: FormikProps<{ selectedNamespaces: Set<string> }>) => {
          const { selectedNamespaces } = formikProps.values
          return (
            <FormikForm id="onBoardingForm">
              <Table
                className={css.table}
                columns={[
                  {
                    accessor: 'entityName',
                    width: '5%',
                    Cell: function CheckColumn(tableProps) {
                      return (
                        <CheckedNamespace
                          tableProps={tableProps}
                          selectedNamespaces={selectedNamespaces}
                          setFieldValue={formikProps.setFieldValue}
                        />
                      )
                    },
                    disableSortBy: true
                  },
                  {
                    Header: i18n.tableColumnName.kubernetesNamespace,
                    accessor: 'repositoryName',
                    width: '85%',
                    Cell: NamespaceValue,
                    disableSortBy: true
                  }
                ]}
                data={(nameSpaces as unknown) as object[]}
                onRowClick={rowData => {
                  const namespace = (rowData as unknown) as string
                  if (selectedNamespaces.has(namespace)) selectedNamespaces.delete(namespace)
                  else selectedNamespaces.add(namespace)
                  formikProps.setFieldValue(
                    SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES,
                    new Set(selectedNamespaces)
                  )
                }}
                sortable={true}
                pagination={{
                  itemCount: nameSpaces.length,
                  pageSize: nameSpaces.length,
                  pageCount: 1,
                  pageIndex: 0,
                  gotoPage: () => undefined
                }}
              />
              {formikProps.errors.selectedNamespaces ? (
                <Text data-name="validation" intent="danger">
                  {formikProps.errors.selectedNamespaces}
                </Text>
              ) : null}
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}
