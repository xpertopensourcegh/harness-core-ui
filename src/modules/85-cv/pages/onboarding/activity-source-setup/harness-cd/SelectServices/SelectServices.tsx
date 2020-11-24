import React, { useEffect, useState } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color } from '@wings-software/uikit'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { useList, Application, Service } from 'services/portal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import css from '../SelectApplication/SelectApplication.module.scss'

export interface SelectServicesProps {
  initialValues?: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
}

interface RenderColumnHarnessServicesProps {
  tableProps: CellProps<object>
  selectedServices: Set<TableData>
  setFieldValue: (fieldName: string, value: Set<TableData>) => void
}

interface TableData {
  name: string
  uuid: string
  appName: string
  appId: string
}

const RenderColumnHarnessServices: React.FC<RenderColumnHarnessServicesProps> = props => {
  const data: TableData = props.tableProps?.row?.original as TableData

  const isApplicationSelected = props.selectedServices.has(data as TableData)

  return (
    <Layout.Horizontal spacing="small">
      <input
        type="checkbox"
        checked={isApplicationSelected}
        onClick={e => {
          if (!e.currentTarget.checked) {
            props.selectedServices?.delete(data)
          } else {
            props.selectedServices?.add(data)
          }
          props.setFieldValue('selectedServices', new Set(props.selectedServices))
        }}
      />
      <Icon name="cd-main" />
      <Text color={Color.BLACK}>{data.name}</Text>
    </Layout.Horizontal>
  )
}
const RenderColumnApplication: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return <Text>{data.appName}</Text>
}

const RenderColumnAddEnvironment: Renderer<CellProps<Application>> = ({ row }) => {
  const data = row.original
  // Temp
  return <Container>{data.appId}</Container>
}
const SelectServices: React.FC<SelectServicesProps> = props => {
  const { getString } = useStrings()
  const [tableData, setTableData] = useState<Array<TableData>>()
  const { accountId } = useParams()
  const { data, loading, error, refetch } = useList({
    lazy: true
  })

  useEffect(() => {
    const appIds = props.initialValues.selectedApplications?.map((item: Application) => item.uuid)
    refetch({ queryParams: { appIds, accountId } })
  }, [props.initialValues.selectedApplications])

  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const formatData = (data?.resource as any)?.response?.map((item: Application) => {
        const appName = item.name

        return item?.services?.map((services: Service) => {
          return {
            name: services.name,
            uuid: services.uuid,
            appName: appName,
            appId: item.appId
          }
        })
      })

      setTableData(formatData.flat())
    }
  }, [(data?.resource as any)?.response])

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
        <PageError message={error?.message} onClick={() => refetch()} />
      </Container>
    )
  }

  if (!tableData?.length) {
    return (
      <Container className={css.loadingErrorNoData}>
        <NoDataCard
          icon="warning-sign"
          message={getString('cv.activitySources.harnessCD.service.noData')}
          buttonText={getString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }

  return (
    <Container>
      <Formik
        initialValues={{ selectedServices: new Set<TableData>() }}
        onSubmit={values => {
          props.onSubmit?.({ selectedServices: Array.from(values.selectedServices.keys()) })
        }}
      >
        {(formik: FormikProps<{ selectedServices: Set<TableData> }>) => {
          const { selectedServices } = formik.values

          return (
            <FormikForm>
              <Container width={'60%'} style={{ margin: 'auto' }} padding={{ top: 'xxxlarge' }}>
                <Text margin={{ top: 'large', bottom: 'large' }}>
                  {' '}
                  {getString('cv.activitySources.harnessCD.service.infoText')}
                </Text>

                <Table<TableData>
                  columns={[
                    {
                      Header: getString('cv.activitySources.harnessCD.service.harnessServices'),
                      accessor: 'name',

                      width: '33%',
                      Cell: function RenderApplications(tableProps: CellProps<object>) {
                        return (
                          <RenderColumnHarnessServices
                            tableProps={tableProps}
                            selectedServices={selectedServices}
                            setFieldValue={formik.setFieldValue}
                          />
                        )
                      },
                      disableSortBy: true
                    },
                    {
                      Header: getString('cv.activitySources.harnessCD.harnessApps'),
                      accessor: 'appName',

                      width: '33%',
                      Cell: RenderColumnApplication,

                      disableSortBy: true
                    },
                    {
                      Header: getString('cv.activitySources.harnessCD.service.services'),
                      accessor: 'uuid',

                      width: '33%',
                      Cell: RenderColumnAddEnvironment,

                      disableSortBy: true
                    }
                  ]}
                  data={tableData || []}
                  pagination={{
                    itemCount: (data?.resource as any)?.total || 0,
                    pageSize: (data?.resource as any)?.pageSize || 10,
                    pageCount: (data?.resource as any)?.total || -1,
                    pageIndex: (data?.resource as any)?.offset || 0,
                    gotoPage: () => undefined
                  }}
                />
              </Container>
              <SubmitAndPreviousButtons
                onPreviousClick={props.onPrevious}
                onNextClick={() => {
                  formik.submitForm()
                  // Todo oncomplete oboarding integration
                }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SelectServices
