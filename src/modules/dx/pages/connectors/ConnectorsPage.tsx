import React, { useState } from 'react'
import { Layout, Button, TextInput, Icon, Popover, IconName, Text, Color } from '@wings-software/uikit'
import { useParams, useHistory } from 'react-router-dom'
import { IDialogProps, Position, Menu } from '@blueprintjs/core'
import { useGetConnectorList, ResponsePageConnectorResponse, ConnectorInfoDTO } from 'services/cd-ng'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import useCreateConnectorModal from 'modules/dx/modals/ConnectorModal/useCreateConnectorModal'
import { routeCreateConnectorFromYaml } from 'modules/dx/routes'
import { PageError } from 'modules/common/components/Page/PageError'
import { Page } from 'modules/common/exports'
import ConnectorsListView from './views/ConnectorsListView'
import i18n from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard.i18n'
import css from './ConnectorsPage.module.scss'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponsePageConnectorResponse>
}

// const enum View {
//   GRID,
//   LIST
// }
interface OptionInterface {
  label: string
  value: ConnectorInfoDTO['type']
  icon: IconName
  onClick?: () => void
  modalProps?: IDialogProps
}

const getMenuItem: React.FC<OptionInterface> = item => {
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between' }}>
      <Text font={{ weight: 'bold' }} margin="xsmall" color={Color.GREY_800} className={css.dropdownLabel}>
        {item.label}
      </Text>
      <Icon name={item.icon} size={24} margin={{ right: 'small' }} />
    </Layout.Horizontal>
  )
}

const ConnectorsPage: React.FC<ConnectorsListProps> = ({ mockData }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  // const [view, setView] = useState(View.LIST)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const history = useHistory()

  const { loading, data, refetch: reloadConnectorList, error } = useGetConnectorList({
    queryParams: {
      pageIndex: page,
      pageSize: 10,
      projectIdentifier,
      orgIdentifier,
      searchTerm,
      accountIdentifier: accountId
    },
    mock: mockData,
    debounce: 300
  })

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      reloadConnectorList()
    }
  })

  const getDropdownItems = (items: OptionInterface[]): JSX.Element[] => {
    const renderList = items.map((item, index) => {
      return (
        <Menu.Item
          onClick={() => {
            openConnectorModal(item?.value, item?.modalProps)
          }}
          key={`${item}${index}`}
          text={getMenuItem(item)}
        />
      )
    })
    renderList.push(
      <Menu.Item
        key={`yaml-builder`}
        text={getMenuItem({ label: ConnectorInfoText.YAML, value: Connectors.YAML, icon: 'main-code-yaml' })}
        onClick={() => {
          history.push(routeCreateConnectorFromYaml.url())
        }}
      />
    )
    return renderList
  }

  const items: OptionInterface[] = [
    {
      label: ConnectorInfoText.KUBERNETES_CLUSTER,
      value: Connectors.KUBERNETES_CLUSTER,
      icon: 'service-kubernetes'
    },
    { label: ConnectorInfoText.GIT, value: Connectors.GIT, icon: 'service-github' },
    {
      label: ConnectorInfoText.VAULT,
      value: Connectors.VAULT,
      icon: 'lock'
    },
    { label: ConnectorInfoText.APP_DYNAMICS, value: Connectors.APP_DYNAMICS, icon: 'service-appdynamics' },
    { label: ConnectorInfoText.SPLUNK, value: Connectors.SPLUNK, icon: 'service-splunk' },
    { label: ConnectorInfoText.DOCKER, value: Connectors.DOCKER, icon: 'service-dockerhub' },
    { label: ConnectorInfoText.AWS, value: Connectors.AWS, icon: 'service-aws' }
  ]

  return (
    <Layout.Vertical height={'calc(100vh - 64px'} className={css.listPage}>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="55%">
          <Popover minimal position={Position.BOTTOM_RIGHT}>
            <Button intent="primary" text={i18n.NEW_CONNECTOR} icon="plus" rightIcon="chevron-down" />
            <Menu className={css.selectConnector}>{getDropdownItems(items)}</Menu>
          </Popover>
        </Layout.Horizontal>
        <Layout.Horizontal width="45%" className={css.view}>
          <TextInput
            leftIcon="search"
            placeholder={i18n.Search}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value.trim())
            }}
          />
          {/* <Button
              minimal
              icon="grid-view"
              intent={view === View.GRID ? 'primary' : 'none'}
              onClick={() => {
                setView(View.GRID)
              }}
            /> */}
          {/* Enable once grid view is also supported:
           <Button
            minimal
            icon="list"
            intent={view === View.LIST ? 'primary' : 'none'}
            onClick={() => {
              setView(View.LIST)
            }}
          /> */}
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Page.Body className={css.listBody}>
        {loading ? (
          <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
            <PageSpinner />
          </div>
        ) : error ? (
          <div style={{ paddingTop: '200px' }}>
            <PageError message={error.message} onClick={() => reloadConnectorList()} />
          </div>
        ) : data?.data?.content?.length ? (
          <ConnectorsListView
            data={data?.data}
            reload={reloadConnectorList}
            gotoPage={pageNumber => setPage(pageNumber)}
          />
        ) : (
          <Page.NoDataCard icon="nav-dashboard" message={i18n.NoConnector} />
        )}
      </Page.Body>
    </Layout.Vertical>
  )
}

export default ConnectorsPage
