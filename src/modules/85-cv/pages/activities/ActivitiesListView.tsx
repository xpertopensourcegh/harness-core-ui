import React from 'react'
import { Container, Table } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { useGetVerificationJobs } from 'services/cv'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import i18n from './ActivitiesPage.i18n'
import styles from './ActivitiesPage.module.scss'

const columns = [
  {
    Header: i18n.identifier,
    accessor: 'identifier'
  },
  {
    Header: i18n.jobName,
    accessor: 'jobName'
  },
  {
    Header: i18n.type,
    accessor: 'type'
  },
  {
    Header: i18n.sensitivity,
    accessor: 'sensitivity'
  },
  {
    Header: i18n.duration,
    accessor: 'duration'
  }
]

export default function ActivitiesListView(): React.ReactElement {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { data } = useGetVerificationJobs({
    queryParams: {
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string
    }
  })
  return (
    <Container>
      {data?.resource?.length && (
        <Table columns={columns as any} data={data?.resource!} bpTableProps={{}} className={styles.activitiesTable} />
      )}
      {data?.resource?.length === 0 && <NoDataCard message={i18n.emptyMessage} icon="warning-sign" />}
    </Container>
  )
}
