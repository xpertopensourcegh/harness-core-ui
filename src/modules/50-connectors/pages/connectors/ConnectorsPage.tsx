import React, { useState, useEffect, useCallback } from 'react'
import {
  Layout,
  Button,
  TextInput,
  useModalHook,
  Select,
  SelectOption,
  FormInput,
  MultiSelectOption
} from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import { isEmpty, isUndefined, omitBy, omit, debounce } from 'lodash-es'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import {
  useGetConnectorListV2,
  ResponsePageConnectorResponse,
  useGetConnectorCatalogue,
  ConnectorCatalogueItem,
  ResponseConnectorCatalogueResponse,
  useGetConnectorStatistics,
  ConnectorStatusStatistics,
  ConnectorTypeStatistics,
  useGetFilterList,
  FilterDTO,
  usePostFilter,
  useUpdateFilter,
  ConnectorFilterProperties,
  PageConnectorResponse,
  useDeleteFilter,
  ResponsePageFilterDTO
} from 'services/cd-ng'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import { PageError } from 'modules/10-common/components/Page/PageError'
import { Page, useToaster, StringUtils } from 'modules/10-common/exports'
import { AddDrawer, PageSpinner } from '@common/components'
import {
  AddDrawerMapInterface,
  DrawerContext,
  CategoryInterface,
  ItemInterface
} from '@common/components/AddDrawer/AddDrawer'
import routes from '@common/RouteDefinitions'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import { Filter } from '@common/components/Filter/Filter'
import { useStrings } from 'framework/exports'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import type { FilterInterface, FilterDataInterface } from '@common/components/Filter/Constants'
import ConnectorsListView from './views/ConnectorsListView'
import i18n from '../../components/CreateConnectorWizard/CreateConnectorWizard.i18n'
import { ConnectorCatalogueNames } from './ConnectorsPage.i18n'
import { getIconByType, getConnectorDisplayName } from './utils/ConnectorUtils'
import {
  createRequestBodyPayload,
  ConnectorFormType,
  getValidFilterArguments,
  renderItemByType
} from './utils/RequestUtils'
import css from './ConnectorsPage.module.scss'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponsePageConnectorResponse>
  catalogueMockData?: UseGetMockData<ResponseConnectorCatalogueResponse>
  statisticsMockData?: UseGetMockData<ConnectorStatusStatistics>
  filtersMockData?: UseGetMockData<ResponsePageFilterDTO>
}

const enum ConnectorStatCategories {
  STATUS = 'STATUS',
  TYPE = 'TYPE',
  TAGS = 'TAGS'
}

const removeNullAndEmpty = (object: Record<string, any>) => omitBy(omitBy(object, isUndefined), isEmpty)

const UNSAVED_FILTER = 'Unsaved Filter'

const ConnectorsPage: React.FC<ConnectorsListProps> = ({ catalogueMockData, statisticsMockData, filtersMockData }) => {
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<FilterDTO[]>()
  const [appliedFilter, setAppliedFilter] = useState<FilterDTO | null>()
  const { showSuccess, showError } = useToaster()
  const [fetchedConnectorResponse, setFetchedConnectorResponse] = useState<PageConnectorResponse | undefined>()
  const [isFetchingConnectors, setIsFetchingConnectors] = useState<boolean>(false)
  const [errorWhileFetchingConnectors, setErrorWhileFetchingConnectors] = useState<Error>()
  const [isRefreshingFilters, setIsRefreshingFilters] = useState<boolean>(false)
  const defaultQueryParams = {
    pageIndex: page,
    pageSize: 10,
    projectIdentifier,
    orgIdentifier,
    searchTerm,
    accountIdentifier: accountId
  }
  const history = useHistory()

  /* #region Connector CRUD section */

  const { mutate: fetchConnectors } = useGetConnectorListV2({
    queryParams: defaultQueryParams
  })

  const refetchConnectorList = async (filter?: ConnectorFilterProperties, needsRefinement?: boolean) => {
    setIsFetchingConnectors(true)

    const { connectorNames, connectorIdentifiers, description, types, connectivityStatuses, tags } = filter || {}

    const requestBodyPayload = Object.assign(
      filter
        ? {
            connectorNames: typeof connectorNames === 'string' ? [connectorNames] : connectorNames,
            connectorIdentifiers:
              typeof connectorIdentifiers === 'string' ? [connectorIdentifiers] : connectorIdentifiers,
            description,
            types: needsRefinement ? types?.map(type => type?.toString()) : types,
            connectivityStatuses: needsRefinement
              ? connectivityStatuses?.map(status => status?.toString())
              : connectivityStatuses,
            tags
          }
        : {},
      {
        filterType: 'Connector'
      }
    ) as ConnectorFilterProperties
    const sanitizedFilterRequest = removeNullAndEmpty(requestBodyPayload)
    try {
      const { status, data } = await fetchConnectors(sanitizedFilterRequest)
      if (status === 'SUCCESS') {
        setFetchedConnectorResponse(data)
      }
    } catch (e) {
      /* istanbul ignore next */
      showError(e.data?.message)
      setErrorWhileFetchingConnectors(e)
    }
    setIsFetchingConnectors(false)
  }

  useEffect(() => {
    ;(async () => {
      await refetchConnectorList()
    })()
  }, [page])

  const handleConnectorSearchByName = (query: string) => {
    if (query) {
      refetchConnectorList({ connectorNames: [query] })
    } else {
      refetchConnectorList()
    }
  }

  const handler = useCallback(debounce(handleConnectorSearchByName, 300), [])

  const onSearch = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const query = (event.target as HTMLInputElement).value
    handler(query)
    setSearchTerm(query)
  }

  /* #endregion */

  /* #region Create Connector Catalogue section */

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
          catalogueWithYAMLBuilderOption.map((item: ConnectorCatalogueItem) => {
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

  const { data: metaData } = useGetConnectorStatistics({
    queryParams: {
      accountIdentifier: accountId,
      scope: getScopeFromDTO({ accountId, projectIdentifier, orgIdentifier })
    },
    mock: statisticsMockData
  })

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      refetchConnectorList()
    },
    onClose: () => {
      refetchConnectorList()
    }
  })

  const rerouteBasedOnContext = (): void => {
    if (orgIdentifier) {
      history.push(routes.toCDCreateConnectorFromYaml({ projectIdentifier, orgIdentifier, accountId }))
    } else {
      history.push(routes.toCreateConnectorFromYaml({ accountId }))
    }
  }

  const [openDrawer, hideDrawer] = useModalHook(() => {
    const onSelect = (val: ItemInterface): void => {
      if (val.value === 'YAML') {
        rerouteBasedOnContext()
      }
      openConnectorModal(false, val?.value as ConnectorInfoDTO['type'], undefined)
      hideDrawer()
    }

    return loadingCatalogue ? (
      <PageSpinner />
    ) : (
      <AddDrawer
        addDrawerMap={computeDrawerMap(catalogueData)}
        onSelect={onSelect}
        onClose={hideDrawer}
        drawerContext={DrawerContext.PAGE}
        showRecentlyUsed={false}
      />
    )
  }, [catalogueData])

  const getOptions = (category: ConnectorStatCategories): MultiSelectOption[] => {
    if (category === ConnectorStatCategories.STATUS) {
      return (
        metaData?.data?.statusStats?.map((item: ConnectorStatusStatistics) => {
          //TODO @vardan make it match mocks when label accepts custom renderer as well
          const val = item?.status || 'NA'
          return createOption(val, item?.count)
        }) || []
      )
    } else if (category === ConnectorStatCategories.TYPE) {
      return (
        metaData?.data?.typeStats?.map((item: ConnectorTypeStatistics) => {
          const val = item?.type || 'NA'
          return createOption(val, item?.count)
        }) || []
      )
    }
    return []
  }

  const createOption = (val: string, count?: number): MultiSelectOption => {
    return {
      label: val
        .concat(' ')
        .concat('(')
        .concat((count || '').toString())
        .concat(')'),
      value: val
    } as MultiSelectOption
  }

  /* #endregion */

  /* #region Connector Filter CRUD Section */

  const ConnectorFormFields: React.FC = () => {
    return (
      <>
        <FormInput.Text name={'connectorNames'} label={getString('connectors.name')} />
        <FormInput.Text name={'connectorIdentifiers'} label={getString('identifier')} />
        <FormInput.Text name={'description'} label={getString('description')} />
        <FormInput.MultiSelect
          items={getOptions(ConnectorStatCategories.TYPE)}
          name="types"
          label={getString('typeLabel')}
        />
        <FormInput.KVTagInput name="tags" label={getString('tagsLabel')} />
        <FormInput.MultiSelect
          items={getOptions(ConnectorStatCategories.STATUS)}
          name="connectivityStatuses"
          label={getString('filters.connectivityStatus')}
        />
      </>
    )
  }

  const {
    loading: isFetchingFilters,
    data: fetchedFilterResponse,
    error: errorFetchingFilterList,
    refetch: refetchFilterList
  } = useGetFilterList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      type: 'Connector'
    },
    mock: filtersMockData
  })

  useEffect(() => {
    setFilters(fetchedFilterResponse?.data?.content || [])
    setIsRefreshingFilters(isFetchingFilters)
  }, [fetchedFilterResponse])

  if (errorFetchingFilterList) {
    showError(errorFetchingFilterList?.message)
  }

  const { mutate: createFilter } = usePostFilter({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { mutate: updateFilter } = useUpdateFilter({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { mutate: deleteFilter } = useDeleteFilter({
    queryParams: {
      accountIdentifier: accountId,
      type: 'Connector'
    }
  })

  const getFilterByName = (name: string): FilterDTO | undefined =>
    /* istanbul ignore if */
    filters?.find((filter: FilterDTO) => filter.name?.toLowerCase() === name.toLowerCase())

  const getMultiSelectFormOptions = (values?: any[]): SelectOption[] | undefined => {
    /* istanbul ignore if */
    return values?.map(item => {
      return { label: item, value: item }
    })
  }

  const handleSaveOrUpdate = async (
    isUpdate: boolean,
    data: FilterDataInterface<ConnectorFormType, FilterInterface>
  ): Promise<void> => {
    const requestBodyPayload = createRequestBodyPayload({ isUpdate, data, projectIdentifier, orgIdentifier })
    try {
      const { status, data: updatedFilter } = isUpdate
        ? await updateFilter(requestBodyPayload)
        : await createFilter(requestBodyPayload)
      if (status === 'SUCCESS') {
        showSuccess(`Filter ${isUpdate ? 'updated' : 'saved'}.`)
        await refetchFilterList()
        if (isUpdate) {
          setAppliedFilter(updatedFilter)
          refetchConnectorList(updatedFilter?.filterProperties, true)
        }
      }
    } catch (e) {
      /* istanbul ignore next */
      showError(e.data?.message)
    }
  }

  const handleDelete = async (filterName: string): Promise<void> => {
    const matchingFilter = getFilterByName(filterName)
    if (!matchingFilter?.identifier) {
      showError(getString('somethingWentWrong'))
      return
    }
    try {
      const { status } = await deleteFilter(matchingFilter?.identifier || '')
      if (status === 'SUCCESS') {
        showSuccess(getString('filters.filterDeleted'))
        refetchFilterList()
        if (matchingFilter?.identifier === appliedFilter?.identifier) {
          reset()
        }
      }
    } catch (e) {
      /* istanbul ignore next */
      showError(e.data?.message)
    }
  }

  const handleDuplicate = async (filterName: string): Promise<void> => {
    const matchingFilter = getFilterByName(filterName)
    const { name: _name, filterVisibility: _filterVisibility, filterProperties } = matchingFilter as FilterDTO
    const duplicatedFilterName = _name.concat(' copy') || ''
    const requestBodyPayload = {
      name: duplicatedFilterName,
      identifier: StringUtils.getIdentifierFromName(duplicatedFilterName),
      projectIdentifier,
      orgIdentifier,
      filterVisibility: _filterVisibility,
      filterProperties
    }
    try {
      const { status } = await createFilter(requestBodyPayload)
      if (status === 'SUCCESS') {
        showSuccess(getString('filters.filterDuplicated'))
        refetchFilterList()
      }
    } catch (e) {
      /* istanbul ignore next */
      showError(e.data?.message)
    }
  }

  const handleFilterClick = (filterName: string): void => {
    if (filterName !== UNSAVED_FILTER) {
      setAppliedFilter(getFilterByName(filterName))
    }
  }

  const [openFilterDrawer, hideFilterDrawer] = useModalHook(() => {
    const onFilterApply = (formData: Record<string, any>) => {
      const filterFromFormData = getValidFilterArguments(formData)
      refetchConnectorList(filterFromFormData)
      setAppliedFilter({ name: UNSAVED_FILTER, identifier: '', filterProperties: filterFromFormData })
      hideFilterDrawer()
    }

    const { connectorNames, connectorIdentifiers, description, types, connectivityStatuses } =
      (appliedFilter?.filterProperties as ConnectorFilterProperties) || {}
    const { name = '', filterVisibility } = appliedFilter || {}
    return isRefreshingFilters ? (
      <PageSpinner />
    ) : (
      <Filter<ConnectorFormType, FilterInterface>
        onApply={onFilterApply}
        onClose={() => {
          hideFilterDrawer()
          refetchFilterList()
        }}
        filters={filters?.map((item: FilterDTO) => {
          return {
            name: item?.name,
            visible: item?.filterVisibility,
            identifier: item?.identifier
          }
        })}
        initialFilter={{
          formValues: {
            connectorNames,
            connectorIdentifiers,
            description,
            types: getMultiSelectFormOptions(types),
            connectivityStatuses: getMultiSelectFormOptions(connectivityStatuses)
          },
          metadata: {
            name,
            visible: filterVisibility,
            identifier: appliedFilter?.identifier || ''
          }
        }}
        onSaveOrUpdate={handleSaveOrUpdate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onFilterSelect={handleFilterClick}
      >
        <ConnectorFormFields />
      </Filter>
    )
  }, [isRefreshingFilters, filters, appliedFilter])

  const handleFilterSelection = (
    option: SelectOption,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ): void => {
    event?.stopPropagation()
    event?.preventDefault()
    /* istanbul ignore else */
    if (option.value) {
      const selectedFilter = getFilterByName(option.value?.toString())
      setAppliedFilter(selectedFilter)
      refetchConnectorList(selectedFilter?.filterProperties, true)
    } else {
      reset()
    }
  }

  const filterWithValidFields = removeNullAndEmpty(omit(appliedFilter?.filterProperties, 'filterType') || {})
  const fieldCountInAppliedFilter = Object.keys(filterWithValidFields || {}).length

  const renderFilterBtn = (): JSX.Element => (
    <Button
      id="ngfilterbtn"
      icon="ng-filter"
      onClick={openFilterDrawer}
      className={css.ngFilter}
      width="32px"
      height="32px"
    />
  )

  const getFilterSummary = (fields: object): JSX.Element => {
    return (
      <ol className={css.noStyleUl}>
        {Object.entries(fields as object).map(([key, value]) => (
          <li key={key} className={css.summaryItem}>
            <span style={{ textTransform: 'capitalize' }}>{key} : </span>
            <span style={{ textTransform: 'capitalize' }}>{renderItemByType(value)}</span>
          </li>
        ))}
      </ol>
    )
  }

  const reset = (): void => {
    setAppliedFilter(null)
    refetchConnectorList()
  }

  /* #endregion */

  return (
    <Layout.Vertical height={'calc(100vh - 64px'} className={css.listPage}>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="50%">
          <Button intent="primary" text={i18n.NEW_CONNECTOR} icon="plus" onClick={openDrawer} id="newConnectorBtn" />
        </Layout.Horizontal>
        <Layout.Horizontal spacing="small" width="30%" className={css.view}>
          <TextInput
            leftIcon="search"
            placeholder={i18n.Search}
            value={searchTerm}
            onChange={onSearch}
            id="filterConnectorByName"
          />
        </Layout.Horizontal>
        <Layout.Horizontal spacing="small" width="20%" className={css.view}>
          <Select
            items={
              filters?.map((item: FilterDTO) => {
                const name = item?.name
                return { label: name, value: name } as SelectOption
              }) || []
            }
            onChange={handleFilterSelection}
            addClearBtn={true}
            value={{ label: appliedFilter?.name || '', value: appliedFilter?.name || '' }}
          />
          {fieldCountInAppliedFilter ? (
            <Popover
              interactionKind={PopoverInteractionKind.HOVER}
              position={Position.BOTTOM}
              content={getFilterSummary(filterWithValidFields)}
              popoverClassName={css.summaryPopover}
            >
              {renderFilterBtn()}
            </Popover>
          ) : (
            renderFilterBtn()
          )}
        </Layout.Horizontal>
        <Layout.Horizontal className={css.view}>
          {fieldCountInAppliedFilter > 0 ? <span className={css.fieldCount}>{fieldCountInAppliedFilter}</span> : null}
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Page.Body className={css.listBody}>
        {isFetchingConnectors ? (
          <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
            <PageSpinner />
          </div>
        ) : errorWhileFetchingConnectors ? (
          <div style={{ paddingTop: '200px' }}>
            <PageError
              message={errorWhileFetchingConnectors?.message}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                e.preventDefault()
                e.stopPropagation()
                reset()
              }}
            />
          </div>
        ) : fetchedConnectorResponse?.content?.length ? (
          <ConnectorsListView
            data={fetchedConnectorResponse}
            reload={refetchConnectorList}
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
