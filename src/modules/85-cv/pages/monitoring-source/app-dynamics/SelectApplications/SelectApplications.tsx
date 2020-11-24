import React, { useState, useEffect } from 'react'
import { Container, Button, Layout, Text, Icon } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import { useRouteParams } from 'framework/exports'
import { AppDynamicsApplication, useGetAppDynamicsApplications } from 'services/cv'
import { useGetEnvironmentListForProject } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import EnvironmentSelect from './EnvironmentSelect'
import styles from './SelectApplications.module.scss'

interface SelectApplicationsProps {
  stepData?: { [key: string]: any }
  onCompleteStep: (data: object) => void
}

interface AppEntry {
  id: number
  name: string
  selected: boolean
  environment?: string
}

export default function SelectApplications({ stepData, onCompleteStep }: SelectApplicationsProps): React.ReactElement {
  const history = useHistory()
  const { getString } = useStrings()
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const { data } = useGetAppDynamicsApplications({
    queryParams: {
      accountId,
      connectorIdentifier: 'AppdUiTest',
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })

  const { data: environmentsResponse } = useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })

  const [environmentOptions, setEnvironmentOptions] = useState<any>([])

  const [tableData, setTableData] = useState<Array<AppEntry>>([])

  useEffect(() => {
    if (environmentsResponse?.data?.content?.length) {
      setEnvironmentOptions(
        environmentsResponse?.data?.content?.map(env => ({
          label: env.name,
          value: env.name
        }))
      )
    }
  }, [environmentsResponse])

  useEffect(() => {
    if (data?.resource?.length) {
      const apps = stepData?.applications ?? {}
      setTableData(
        data.resource?.map((app: AppDynamicsApplication) => ({
          id: app.id!,
          name: app.name!,
          selected: !!apps[String(app.id)],
          environment: apps[String(app.id)]?.environment ?? ''
        }))
      )
    }
  }, [data, stepData])

  const onUpdateData = (index: number, value: object) => {
    setTableData(old =>
      old.map((row, i) => {
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

  const onNext = () => {
    const applications = tableData.reduce((acc: any, curr) => {
      if (curr.selected && curr.environment) {
        acc[curr.id] = {
          id: curr.id,
          name: curr.name,
          environment: curr.environment
        }
      }
      return acc
    }, {})
    if (Object.keys(applications).length) {
      onCompleteStep({ applications })
    }
  }

  return (
    <Container className={styles.main}>
      <Container className={styles.mainPanel}>
        <Table
          className={styles.table}
          columns={[
            {
              Header: '',
              accessor: 'selected',
              disableSortBy: true,
              width: '40px',
              Cell: function CheckApplicationCellWrapper({ row, value }: any) {
                return (
                  <CheckApplicationCell
                    value={value}
                    onSelect={(selected: boolean) => onUpdateData(row.index, { selected })}
                  />
                )
              }
            },
            {
              Header: getString('cv.monitoringSources.appD.appDApplications'),
              accessor: 'name',
              disableSortBy: true,
              width: '45%',
              Cell: ApplicationNameCell
            },
            {
              Header: getString('cv.monitoringSources.appD.harnessEnv'),
              accessor: 'environment',
              disableSortBy: true,
              width: '45%',
              Cell: function EnvironmentCell({ row, value }: any) {
                return (
                  <Container className={styles.selectEnvironmentCell}>
                    <Icon name="harness" margin={{ right: 'small' }} />
                    <EnvironmentSelect
                      value={value}
                      options={environmentOptions}
                      onSelect={val => onUpdateData(row.index, { environment: val })}
                      onNewCreated={(val: any) => {
                        setEnvironmentOptions([{ label: val.name, value: val.name }, ...environmentOptions])
                        onUpdateData(row.index, { environment: val.name })
                      }}
                    />
                  </Container>
                )
              }
            }
          ]}
          data={tableData}
        />
        <Layout.Horizontal>
          <Button
            text="Previous"
            margin="large"
            icon="chevron-left"
            onClick={() =>
              history.push(
                routeCVAdminSetup.url({
                  projectIdentifier: projectIdentifier as string,
                  orgIdentifier: orgIdentifier as string
                })
              )
            }
          />
          <Button text="Next" intent="primary" margin="large" rightIcon="chevron-right" onClick={onNext} />
        </Layout.Horizontal>
      </Container>
      <Container className={styles.infoPanel}>
        <Text icon="info" font={{ weight: 'bold' }} margin={{ bottom: 'small' }}>
          {getString('cv.monitoringSources.appD.mapDashboards')}
        </Text>
        <Text>{getString('cv.monitoringSources.appD.mapDashboardsMsg')}</Text>
      </Container>
    </Container>
  )
}

function CheckApplicationCell({ value, onSelect }: any): React.ReactElement {
  return <input type="checkbox" checked={value} onChange={e => onSelect(e.target.checked)} />
}

function ApplicationNameCell({ value }: any): React.ReactElement {
  return <Text icon="service-appdynamics">{value}</Text>
}
