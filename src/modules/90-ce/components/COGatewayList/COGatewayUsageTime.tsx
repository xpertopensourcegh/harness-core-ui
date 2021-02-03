import React, { useEffect, useState } from 'react'
import { Text, Color } from '@wings-software/uicore'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Page } from '@common/components/Page/Page'
import Table from '@common/components/Table/Table'
import { Service, SessionReportRow, useGatewaySessionReport } from 'services/lw'
import css from './COGatewayList.module.scss'

interface COGatewayUsageTimeProps {
  service: Service
}
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
const today = () => moment()
const startOfDay = (time: moment.Moment) => time.startOf('day').toDate()
const endOfDay = (time: moment.Moment) => time.endOf('day').toDate()
function TableCell(tableProps: CellProps<SessionReportRow>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}
const COGatewayUsageTime: React.FC<COGatewayUsageTimeProps> = props => {
  const { orgIdentifier } = useParams<{
    orgIdentifier: string
  }>()
  const { mutate: getSessionReport } = useGatewaySessionReport({
    org_id: orgIdentifier // eslint-disable-line
  })
  const [sessionReportRows, setSessionReportRows] = useState<SessionReportRow[]>([])
  useEffect(() => {
    if (!props.service) return
    loadSessionReport()
  }, [props.service])
  const loadSessionReport = async (): Promise<void> => {
    try {
      const result = await getSessionReport({
        from: moment(startOfDay(today().subtract(7, 'days'))).format(DATE_FORMAT),
        to: moment(endOfDay(today())).format(DATE_FORMAT),
        report_name: 'GATEWAY-SESSION-WISE', // eslint-disable-line
        service_ids: [props.service.id as number], // eslint-disable-line
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
      if (result && result.response && result.response.rows) {
        setSessionReportRows(result.response.rows)
      }
    } catch (e) {
      //   modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }
  return (
    <Page.Body className={css.pageContainer}>
      <Table<SessionReportRow>
        data={sessionReportRows}
        className={css.table}
        columns={[
          {
            accessor: 'start',
            Header: 'Started At',
            width: '40%',
            Cell: TableCell
          },
          {
            accessor: 'end',
            Header: 'Ended At',
            width: '40%',
            Cell: TableCell
          },
          {
            accessor: 'hours',
            Header: 'Duration',
            width: '20%',
            Cell: TableCell
          }
        ]}
      />
    </Page.Body>
  )
}

export default COGatewayUsageTime
