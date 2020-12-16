import React, { useState } from 'react'
import { Layout, Button, TextInput, useModalHook } from '@wings-software/uikit'
import { useParams, useHistory } from 'react-router-dom'
import {
  useGetConnectorList,
  ResponsePageConnectorResponse,
  useGetConnectorCatalogue,
  ConnectorCatalogueItem,
  ResponseConnectorCatalogueResponse
} from 'services/cd-ng'
import { PageSpinner } from 'modules/10-common/components/Page/PageSpinner'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import { PageError } from 'modules/10-common/components/Page/PageError'
import { Page } from 'modules/10-common/exports'
import { AddDrawer } from '@common/components'
import {
  AddDrawerMapInterface,
  DrawerContext,
  CategoryInterface,
  ItemInterface
} from '@common/components/AddDrawer/AddDrawer'
import routes from '@common/RouteDefinitions'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import ConnectorsListView from './views/ConnectorsListView'
import i18n from '../../components/CreateConnectorWizard/CreateConnectorWizard.i18n'
import { ConnectorCatalogueNames } from './ConnectorsPage.i18n'
import { getIconByType, getConnectorDisplayName } from './utils/ConnectorUtils'
import css from './ConnectorsPage.module.scss'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponsePageConnectorResponse>
  catalogueMockData?: UseGetMockData<ResponseConnectorCatalogueResponse>
}

const ConnectorsPage: React.FC<ConnectorsListProps> = ({ mockData, catalogueMockData }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
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

  const computeDrawerMap = (catalogueData: ResponseConnectorCatalogueResponse | null): AddDrawerMapInterface => {
    const originalData = catalogueData?.data?.catalogue || []
    originalData.map(value => {
      value.category == 'SECRET_MANAGER' ? (value.connectors = ['Vault']) : null
    })
    const catalogueWithYAMLBuilderOption:
      | ConnectorCatalogueItem[]
      | { category: string; connectors: string[] } = originalData.slice()
    const createViaYAMLBuilderOption = { category: 'CREATE_VIA_YAML_BUILDER' as any, connectors: ['YAML'] as any }
    if (catalogueWithYAMLBuilderOption.length === originalData.length) {
      catalogueWithYAMLBuilderOption.push(createViaYAMLBuilderOption)
    }
    return Object.assign(
      {},
      {
        drawerLabel: 'Connectors',
        categories:
          catalogueWithYAMLBuilderOption
            ?.filter(item => item.category !== 'CONNECTOR')
            .map((item: ConnectorCatalogueItem) => {
              const obj: CategoryInterface = {
                categoryLabel: ConnectorCatalogueNames.get(item['category']) || '',
                items:
                  item.connectors?.map(entry => {
                    const name = entry.valueOf() || ''
                    return {
                      itemLabel: getConnectorDisplayName(entry) || name,
                      iconName: getIconByType(entry),
                      value: name
                    }
                  }) || []
              }
              return obj
            }) || []
      }
    )
  }

  const { data: catalogueData, loading: loadingCatalogue } = useGetConnectorCatalogue({
    queryParams: { accountIdentifier: accountId },
    mock: catalogueMockData
  })

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      reloadConnectorList()
    },
    onClose: () => {
      reloadConnectorList()
    }
  })

  const [openDrawer, hideDrawer] = useModalHook(() => {
    const onSelect = (val: ItemInterface): void => {
      if (val.value === 'YAML') {
        history.push(routes.toCreateConnectorFromYaml({ accountId }))
      }
      openConnectorModal(false, val?.value as ConnectorInfoDTO['type'], undefined)
      hideDrawer()
    }

    return loadingCatalogue ? null : (
      <AddDrawer
        addDrawerMap={computeDrawerMap(catalogueData)}
        onSelect={onSelect}
        onClose={hideDrawer}
        drawerContext={DrawerContext.PAGE}
        showRecentlyUsed={false}
      />
    )
  }, [loadingCatalogue])

  return (
    <Layout.Vertical height={'calc(100vh - 64px'} className={css.listPage}>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="55%">
          <Button
            intent="primary"
            text={i18n.NEW_CONNECTOR}
            icon="plus"
            rightIcon="chevron-down"
            onClick={openDrawer}
          />
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
