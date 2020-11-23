import React from 'react'
import { Container, Formik, FormikForm, Text, Layout, Icon, Color } from '@wings-software/uikit'
import type { CellProps, Renderer } from 'react-table'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import Table from '@common/components/Table/Table'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { useList, Application, RestResponsePageResponseApplication } from 'services/portal'
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
  selected: boolean
  application: Application
}

function generateTableData(apiData: Application[], selectedApplications?: Application[]): TableData[] {
  const tableData = []
  for (const application of apiData) {
    tableData.push({
      selected: Boolean(
        selectedApplications?.find(selectedApplication => selectedApplication.uuid === application.uuid)
      ),

      application
    })
  }
  return tableData
}

const RenderColumnServicesCount: Renderer<CellProps<TableData>> = ({ row }) => {
  const data = row.original
  return <Container className={css.serviceCol}>{data.application.services?.length}</Container>
}
const SelectApplication: React.FC<HarnessCDActivitySourceDetailsProps> = props => {
  const { getString: getGlobalString } = useStrings()
  const { getString } = useStrings('cv')
  const { accountId } = useParams()
  const { data, loading, error, refetch } = useList({ queryParams: { accountId }, mock: props.mockData })

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

  if (!(data?.resource as any)?.response?.length) {
    return (
      <Container className={css.loadingErrorNoData}>
        <NoDataCard
          icon="warning-sign"
          message={getString('activitySources.harnessCD.application.noData')}
          buttonText={getGlobalString('retry')}
          onClick={() => refetch()}
        />
      </Container>
    )
  }

  const applicationData = generateTableData((data?.resource as any)?.response, props.stepData?.selectedApplications)

  return (
    <Container>
      <Layout.Vertical spacing="small">
        <Text margin={{ left: 'large' }}>{getString('activitySources.harnessCD.application.infoTextOne')}</Text>
        <Text margin={{ left: 'large' }}>{getString('activitySources.harnessCD.application.infoTextTwo')}</Text>
      </Layout.Vertical>
      <Formik
        initialValues={{
          selectedApplications: props.stepData.selectedApplications || []
        }}
        onSubmit={values => {
          props.onSubmit?.({ ...values, selectedApplications: values.selectedApplications })
        }}
      >
        {(formik: FormikProps<{ selectedApplications: Array<Application> }>) => {
          const { selectedApplications } = formik.values

          return (
            <FormikForm>
              <Container width={'60%'} style={{ margin: 'auto' }} padding={{ top: 'xxxlarge' }}>
                <Table<TableData>
                  columns={[
                    {
                      Header: getString('activitySources.harnessCD.harnessApps') || '',
                      accessor: 'selected',

                      width: '50%',
                      Cell: function RenderApplications(tableProps) {
                        const selectedApps = selectedApplications
                        const application = tableProps.row.original?.application

                        const app =
                          selectedApps?.find(selectedApplication => selectedApplication.uuid === application.uuid) ||
                          application

                        const isChecked = Boolean(
                          selectedApps?.find(selectedApplication => selectedApplication.uuid === application.uuid)
                        )

                        return (
                          <Layout.Horizontal spacing="small">
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              checked={isChecked}
                              onChange={e => {
                                if (app && isChecked && !e.currentTarget.checked) {
                                  const index = selectedApps.indexOf(app)
                                  selectedApps.splice(index, 1)
                                } else if (app && !isChecked && e.currentTarget.checked) {
                                  selectedApps.push(app)
                                }
                                formik.setFieldValue('selectedApplications', selectedApps)
                              }}
                            />
                            <Icon name="cd-main" />
                            <Text color={Color.BLACK}>{application.name}</Text>
                          </Layout.Horizontal>
                        )
                      },

                      disableSortBy: true
                    },
                    {
                      Header: (
                        <div className={css.serviceColHeader}>
                          {getString('activitySources.harnessCD.application.servicesToBeImported')}
                        </div>
                      ),
                      id: 'services',

                      width: '50%',
                      Cell: RenderColumnServicesCount,

                      disableSortBy: true
                    }
                  ]}
                  data={applicationData || []}
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
