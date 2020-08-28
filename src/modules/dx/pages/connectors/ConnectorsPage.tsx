import React, { useState } from 'react'
import { Layout, Button, TextInput, Icon, Popover, IconName, Text, Color } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { IDialogProps, Position, Menu } from '@blueprintjs/core'
import { useGetConnectorList, ResponseDTONGPageResponseConnectorSummaryDTO } from 'services/cd-ng'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import useCreateConnectorModal from 'modules/dx/modals/ConnectorModal/useCreateConnectorModal'
import ConnectorsListView from './views/ConnectorsListView'
import i18n from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard.i18n'
import css from './ConnectorsPage.module.scss'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponseDTONGPageResponseConnectorSummaryDTO>
}

const enum View {
  GRID,
  LIST
}
interface OptionInterface {
  label: string
  value: string
  icon: IconName
  onClick?: () => void
  modalProps?: IDialogProps
}

const getMenuItem: React.FC<OptionInterface> = item => {
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between' }}>
      <Text font={{ weight: 'bold' }} margin="xsmall" color={Color.GREY_800}>
        {item.label}
      </Text>
      <Icon name={item.icon} size={24} margin={{ right: 'small' }} />
    </Layout.Horizontal>
  )
}

const ConnectorsPage: React.FC<ConnectorsListProps> = ({ mockData }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [view, setView] = useState(View.LIST)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  const { loading, data, refetch: reloadConnectorList } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: { page: page, size: 10, projectIdentifier, orgIdentifier, searchTerm },
    mock: mockData,
    debounce: 300
  })

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      reloadConnectorList()
    }
  })

  const items: OptionInterface[] = [
    {
      label: ConnectorInfoText.KUBERNETES_CLUSTER,
      value: Connectors.KUBERNETES_CLUSTER,
      icon: 'service-kubernetes'
    },
    { label: ConnectorInfoText.GIT, value: Connectors.GIT, icon: 'service-github' },
    {
      label: ConnectorInfoText.SECRET_MANAGER,
      value: Connectors.SECRET_MANAGER,
      icon: 'lock',
      modalProps: {
        isOpen: true,
        usePortal: true,
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        style: {
          width: 'fit-content',
          minWidth: 960,
          height: 650,
          borderLeft: 0,
          paddingBottom: 0,
          position: 'relative',
          overflow: 'hidden'
        }
      }
    },
    { label: ConnectorInfoText.APP_DYNAMICS, value: Connectors.APP_DYNAMICS, icon: 'service-appdynamics' },
    { label: ConnectorInfoText.SPLUNK, value: Connectors.SPLUNK, icon: 'service-splunk' },
    { label: ConnectorInfoText.DOCKER, value: Connectors.DOCKER, icon: 'service-dockerhub' }
  ]

  return (
    <Layout.Vertical height={'calc(100vh - 64px'}>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="55%">
          <Popover minimal position={Position.BOTTOM_RIGHT}>
            <Button intent="primary" text={i18n.NEW_CONNECTOR} icon="plus" rightIcon="chevron-down" />
            <Menu className={css.selectConnector}>
              {items.map((item, index) => {
                return (
                  <Menu.Item
                    onClick={() => {
                      openConnectorModal(item?.value, item?.modalProps)
                    }}
                    key={index}
                    text={getMenuItem(item)}
                  />
                )
              })}
            </Menu>
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
          <Button
            minimal
            icon="list"
            intent={view === View.LIST ? 'primary' : 'none'}
            onClick={() => {
              setView(View.LIST)
            }}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
      {!loading ? (
        view === View.LIST && data?.data?.content?.length ? (
          <ConnectorsListView
            data={data?.data}
            reload={reloadConnectorList}
            gotoPage={pageNumber => setPage(pageNumber)}
          />
        ) : null
      ) : (
        <PageSpinner />
      )}
    </Layout.Vertical>
  )
}

export default ConnectorsPage
