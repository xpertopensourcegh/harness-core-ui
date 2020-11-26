import React, { useState, useEffect } from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color } from '@wings-software/uikit'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { useGetListApplications, Application, RestResponsePageResponseApplication } from 'services/portal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import type { UseGetMockData } from '@common/utils/testUtils'
import css from './SelectApplication.module.scss'

export interface HarnessCDActivitySourceDetailsProps {
  stepData: any
  onSubmit?: (data: any) => void
  onPrevious: () => void
  mockData?: UseGetMockData<RestResponsePageResponseApplication>
}
interface TableData {
  id: string
  name: string
  serviceCount: number
  selected: boolean
}

const RenderColumnServicesCount: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return <Container className={css.serviceCol}>{data.serviceCount}</Container>
}
const SelectApplication: React.FC<HarnessCDActivitySourceDetailsProps> = props => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  const [disable, setDisable] = useState<boolean>(true)
  const [tableData, setTableData] = useState<Array<TableData>>()
  const { data, loading, error, refetch } = useGetListApplications({
    queryParams: { accountId },
    mock: props.mockData
  })

  const onUpdateData = (index: number, value: object) => {
    setTableData(old =>
      old?.map((row, i) => {
        if (index === i) {
          return {
            ...row,
            ...value
          }
        } else {
          return row
        }
      })
    )
  }
  useEffect(() => {
    if ((data?.resource as any)?.response) {
      const apps = props.stepData.applications ?? {}

      const formatData = (data?.resource as any)?.response?.map((item: Application) => {
        return {
          name: item.name,
          id: item.uuid,

          selected: !!apps[String(item.uuid)],
          serviceCount: item.services?.length
        }
      })

      setTableData(formatData)
    }
  }, [(data?.resource as any)?.response])

  useEffect(() => {
    let visited = false
    tableData?.forEach(item => {
      if (!visited && item.selected) {
        visited = true
        setDisable(false)
      }
    })
    if (!visited) setDisable(true)
  }, [tableData])

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
        <PageError message={error.message} onClick={() => refetch()} />
      </Container>
    )
  }

  if (!tableData?.length) {
    return (
      <Container className={css.loadingErrorNoData}>
        <NoDataCard
          icon="warning-sign"
          message={getString('cv.activitySources.harnessCD.application.noData')}
          buttonText={getString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }

  const onNext = () => {
    const applications = tableData.reduce((acc: any, curr) => {
      if (curr.selected) {
        acc[curr.id] = {
          id: curr.id,
          name: curr.name,
          serviceCount: curr.serviceCount
        }
      }
      return acc
    }, {})
    if (Object.keys(applications).length) {
      props.onSubmit?.({ applications })
    }
  }

  return (
    <Container>
      <Layout.Vertical spacing="small">
        <Text margin={{ left: 'large' }}>{getString('cv.activitySources.harnessCD.application.infoTextOne')}</Text>
        <Text margin={{ left: 'large' }}>{getString('cv.activitySources.harnessCD.application.infoTextTwo')}</Text>
      </Layout.Vertical>
      <Formik
        initialValues={{
          selectedApplications: props.stepData.applications || []
        }}
        onSubmit={onNext}
      >
        {(formik: FormikProps<{ selectedApplications: Array<Application> }>) => {
          return (
            <FormikForm>
              <Container width={'60%'} style={{ margin: 'auto' }} padding={{ top: 'xxxlarge' }}>
                <Table<TableData>
                  columns={[
                    {
                      Header: getString('cv.activitySources.harnessCD.harnessApps') || '',
                      accessor: 'selected',

                      width: '50%',
                      Cell: function RenderApplications(tableProps) {
                        const rowData: TableData = tableProps.row?.original as TableData

                        return (
                          <Layout.Horizontal spacing="small">
                            <input
                              style={{ cursor: 'pointer' }}
                              type="checkbox"
                              checked={rowData.selected}
                              onChange={e => {
                                onUpdateData(tableProps.row.index, { selected: e.target.checked })
                              }}
                            />
                            <Icon name="cd-main" />
                            <Text color={Color.BLACK}>{rowData.name}</Text>
                          </Layout.Horizontal>
                        )
                      },

                      disableSortBy: true
                    },
                    {
                      Header: (
                        <div className={css.serviceColHeader}>
                          {getString('cv.activitySources.harnessCD.application.servicesToBeImported')}
                        </div>
                      ),
                      id: 'serviceCount',

                      width: '50%',
                      Cell: RenderColumnServicesCount,

                      disableSortBy: true
                    }
                  ]}
                  data={tableData}
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
                nextButtonProps={{ disabled: disable }}
                onPreviousClick={props.onPrevious}
                onNextClick={() => {
                  formik.submitForm()
                }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SelectApplication
