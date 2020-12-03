import React, { useState, useMemo } from 'react'
import { Container, Color, Text, Icon, SelectOption } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import { useGetAppDynamicsApplications } from 'services/cv'
import { useGetEnvironmentListForProject, ResponsePageEnvironmentResponseDTO } from 'services/cd-ng'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import EnvironmentSelect from './EnvironmentSelect'
import type { ApplicationRecord } from '../AppDOnboardingUtils'
import styles from './SelectApplications.module.scss'

interface SelectApplicationsProps {
  stepData?: { [key: string]: any }
  onCompleteStep: (data: object) => void
}

interface InternalState {
  [id: string]: ApplicationRecord
}

interface CellProps {
  appId: number
  appData: ApplicationRecord
  onUpdate?(tierId: number, data: Partial<ApplicationRecord> | null): void
  options?: Array<SelectOption>
  onUpdateOptions?(options: Array<SelectOption>): void
}

const PAGE_SIZE = 7

export function updateApplication(
  updater: (params: (val: InternalState) => InternalState) => void,
  appId: number,
  update: object | null
) {
  updater?.(old => {
    const newState = { ...old }
    if (update === null) {
      delete newState[appId]
    } else {
      newState[appId] = {
        ...old[appId],
        ...update
      }
    }
    return newState
  })
}

export default function SelectApplications({ stepData, onCompleteStep }: SelectApplicationsProps) {
  const { getString } = useStrings()
  const [state, setState] = useState<InternalState>(stepData?.applications || {})
  const [environmentOptions, setEnvironmentOptions] = useState<Array<SelectOption>>([])
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [pageIndex, setPageIndex] = useState(0)
  const [textFilter, setTextFilter] = useState('')

  const { data, loading } = useGetAppDynamicsApplications({
    queryParams: {
      accountId,
      connectorIdentifier: stepData?.connectorIdentifier,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      offset: pageIndex,
      pageSize: PAGE_SIZE,
      filter: textFilter
    }
  })

  useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    },
    resolve: (res: ResponsePageEnvironmentResponseDTO) => {
      if (res?.data?.content?.length) {
        setEnvironmentOptions(
          res?.data?.content?.map(env => ({
            label: env.name as string,
            value: env.name as string
          }))
        )
      }
      return res
    }
  })

  const onAppUpdate = (appId: number, update: Partial<ApplicationRecord>) => updateApplication(setState, appId, update)

  const onNext = () => {
    const applications = { ...state }
    for (const appId of Object.keys(applications)) {
      if (!applications[appId].environment) {
        delete applications[appId]
      }
    }
    if (Object.keys(applications).length) {
      onCompleteStep({ applications })
    }
  }

  return (
    <Container className={styles.main}>
      <Container className={styles.mainPanel}>
        {loading && <PageSpinner />}
        <Table
          className={styles.table}
          columns={[
            {
              id: '1',
              Header: '',
              disableSortBy: true,
              width: '40px',
              Cell: function SelectApplicationCellWrapper({ row }: any) {
                return (
                  <SelectApplicationCell
                    appId={row.original.id}
                    appData={state[row.original.id]}
                    onUpdate={(appId: number, update: ApplicationRecord) => {
                      onAppUpdate(
                        appId,
                        update
                          ? {
                              ...update,
                              name: row.original.name
                            }
                          : update
                      )
                    }}
                  />
                )
              }
            },
            {
              id: '2',
              Header: (
                <Text font={{ size: 'small', weight: 'bold' }} color={Color.BLACK}>
                  {getString('cv.monitoringSources.appD.appDApplications')}
                </Text>
              ),
              disableSortBy: true,
              width: '45%',
              Cell: function ApplicationNameWrapper({ row }: any) {
                return <Text icon="service-appdynamics">{row.original.name}</Text>
              }
            },
            {
              id: '3',
              Header: (
                <TableColumnWithFilter
                  className={styles.columnHeaderWithFilter}
                  onFilter={val => {
                    setPageIndex(0)
                    setTextFilter(val)
                  }}
                  columnName={getString('cv.monitoringSources.appD.harnessEnv')}
                />
              ),
              disableSortBy: true,
              width: '45%',
              Cell: function EnvironmentCellWrapper({ row }: any) {
                return (
                  <EnvironmentCell
                    appId={row.original.id}
                    appData={state[row.original.id]}
                    onUpdate={onAppUpdate}
                    options={environmentOptions}
                    onUpdateOptions={setEnvironmentOptions}
                  />
                )
              }
            }
          ]}
          data={data?.resource?.content ?? []}
          pagination={{
            itemCount: data?.resource?.totalItems || 0,
            pageSize: data?.resource?.pageSize || PAGE_SIZE,
            pageCount: data?.resource?.totalPages || 0,
            pageIndex: data?.resource?.pageIndex || 0,
            gotoPage: (page: number) => setPageIndex(page)
          }}
        />
        <SubmitAndPreviousButtons onNextClick={onNext} />
      </Container>
      <Container className={styles.infoPanel}>
        <Container className={styles.infoPanelItem}>
          <Text icon="info" font={{ weight: 'bold' }} margin={{ bottom: 'small' }}>
            {getString('cv.monitoringSources.appD.infoPanel.mapDashboards')}
          </Text>
          <Text>{getString('cv.monitoringSources.appD.infoPanel.mapDashboardsMsg')}</Text>
        </Container>
      </Container>
    </Container>
  )
}

function SelectApplicationCell({ appId, appData, onUpdate }: CellProps) {
  return (
    <input
      type="checkbox"
      checked={!!appData}
      onChange={e => {
        const isChecked = e.target.checked
        onUpdate?.(
          appId,
          isChecked
            ? {
                id: appId
              }
            : null
        )
      }}
    />
  )
}

function EnvironmentCell({ appId, appData, onUpdate, options = [], onUpdateOptions }: CellProps) {
  const item = useMemo(() => options?.find((opt: SelectOption) => opt.value === appData?.environment), [
    options,
    appData
  ])
  return (
    <Container className={styles.selectEnvironmentCell}>
      <Icon name="harness" margin={{ right: 'small' }} />
      <EnvironmentSelect
        item={item}
        disabled={!appData}
        options={options}
        onSelect={opt => {
          onUpdate?.(appId, { environment: opt.value as string })
        }}
        onNewCreated={opt => {
          onUpdateOptions?.([{ label: opt.name!, value: opt.name! }, ...options])
          onUpdate?.(appId, { environment: opt.name })
        }}
      />
    </Container>
  )
}
