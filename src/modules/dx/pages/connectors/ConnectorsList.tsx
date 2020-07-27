import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { ConnectorSetupModal } from '../../modals/ConnectorModal/ConnectorSetupModal'
import CustomTable from '../../../common/components/CustomTable/CustomTable'
import { columns } from '../../../cd/pages/Resources/SampleColumnsData'
import css from './ConnectorsList.module.scss'
import { useHistory, useParams } from 'react-router-dom'
import { formatConnectorListData } from './utils/ConnectorUtils'
import { routeConnectorDetails } from '../../routes'
import { useGetConnectorList, useDeleteConnector, ResponseDTOPageConnectorSummaryDTO } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import type { UseGetMockData } from 'modules/common/utils/testUtils'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponseDTOPageConnectorSummaryDTO>
}
const ConnectorsList: React.FC<ConnectorsListProps> = ({ mockData }) => {
  const { accountId } = useParams()
  const history = useHistory()

  const { loading, data, refetch: reloadConnectorList } = useGetConnectorList({
    accountIdentifier: accountId,
    mock: mockData
  })
  const { mutate: deleteConnector } = useDeleteConnector({ accountIdentifier: accountId })

  const formatedData = formatConnectorListData(data?.data?.content)

  const onDeleteRow = async (connectorId: string) => {
    if (!connectorId) return
    try {
      const deleted = await deleteConnector(connectorId, { headers: { 'content-type': 'application/json' } })
      if (deleted?.data) {
        reloadConnectorList()
      } else {
        // Handle error
      }
    } catch (e) {
      // To handle error
    }
  }

  const onClickRow = (connectorId: string) => {
    history.push(routeConnectorDetails.url({ accountId: accountId, connectorId: connectorId }))
  }

  return (
    <Layout.Vertical className={css.listPage}>
      <Container>
        <Layout.Horizontal id="layout-horizontal-sample" spacing="none" className={css.listWrapper}>
          <ConnectorSetupModal />
        </Layout.Horizontal>
      </Container>
      {!loading ? (
        <Container className={css.listContainer}>
          <Layout.Horizontal className={css.tableContainer}>
            <CustomTable
              data={formatedData || []}
              columns={columns}
              onClickRow={(connectorId: string) => onClickRow(connectorId)}
              onDeleteRow={(connectorId: string) => onDeleteRow(connectorId)}
            />
          </Layout.Horizontal>
        </Container>
      ) : (
        <PageSpinner />
      )}
    </Layout.Vertical>
  )
}

export default ConnectorsList
