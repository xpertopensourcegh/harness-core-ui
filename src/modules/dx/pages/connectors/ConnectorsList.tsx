import React, { useEffect, useState } from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { DelegateSetupModal } from '../../../cd/modals/DelegateSetupModal/DelegateSetupModal'
import CustomTable from '../../../common/components/CustomTable/CustomTable'
import { columns } from '../../../cd/pages/Resources/SampleColumnsData'
import css from './ConnectorsList.module.scss'
import { ConnectorService } from '../../services'
import { useHistory, useParams } from 'react-router-dom'
import { fomatConnectListData } from './utils/ConnectorUtils'
import { routeConnectorDetails } from '../../routes'

interface ConnectorListState {
  rowData: any
  setRowData: (val: any) => void
}
const fetchConnectors = async (state: ConnectorListState) => {
  const { connectorList = {}, error } = await ConnectorService.fetchAllConnectors()
  if (!error) {
    // const rowData = fomatConnectListData(connectorList?.content)
    // removing temp
    const rowData = fomatConnectListData(connectorList)
    state.setRowData(rowData)
  }
}

const onClickRow = (history: any, accountId: string, connectorId: string) => {
  history.push(routeConnectorDetails.url({ accountId: accountId, connectorId: connectorId }))
}
const ConnectorsList: React.FC = () => {
  const [rowData, setRowData] = useState([])
  const { accountId } = useParams()
  const history = useHistory()
  const state: ConnectorListState = {
    rowData,
    setRowData
  }

  useEffect(() => {
    fetchConnectors(state)
  }, [])
  return (
    <Layout.Vertical style={{ background: 'var(--grey-100)', height: `100%` }}>
      <Container>
        <Layout.Horizontal id="layout-horizontal-sample" spacing="none" padding="xlarge" className={css.listWrapper}>
          <div style={{ width: 200 }}>
            <DelegateSetupModal />
          </div>
          {/* <div style={{ flexGrow: 1 }}></div> */}
        </Layout.Horizontal>
      </Container>
      <Container style={{ height: '100%' }}>
        <Layout.Horizontal className={css.tableContainer}>
          <CustomTable
            data={rowData}
            columns={columns}
            onClickRow={(connectorId: string) => onClickRow(history, accountId, connectorId)}
          />
        </Layout.Horizontal>
      </Container>
    </Layout.Vertical>
  )
}

export default ConnectorsList
