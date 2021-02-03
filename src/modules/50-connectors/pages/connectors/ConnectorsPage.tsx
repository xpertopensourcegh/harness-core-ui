import React, { useState, useEffect, useCallback } from 'react'
import {
  Layout,
  Button,
  TextInput,
  useModalHook,
  Select,
  SelectOption,
  FormInput,
  MultiSelectOption,
  OverlaySpinner
} from '@wings-software/uicore'
import { useParams, useHistory } from 'react-router-dom'
import { omit, debounce, truncate } from 'lodash-es'
import { Popover, PopoverInteractionKind, Position, MenuItem } from '@blueprintjs/core'
import type { FormikErrors } from 'formik'
import {
  useGetConnectorListV2,
  ResponsePageConnectorResponse,
  useGetConnectorCatalogue,
  ConnectorCatalogueItem,
  ResponseConnectorCatalogueResponse,
  useGetConnectorStatistics,
  useGetFilterList,
  FilterDTO,
  usePostFilter,
  useUpdateFilter,
  PageConnectorResponse,
  useDeleteFilter,
  ResponsePageFilterDTO,
  ResponseConnectorStatistics
} from 'services/cd-ng'
import type { ConnectorFilterProperties } from 'services/cd-ng'
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
import {
  getFilterSummary,
  removeNullAndEmpty,
  isObjectEmpty,
  UNSAVED_FILTER,
  MAX_FILTER_NAME_LENGTH
} from '@common/components/Filter/utils/FilterUtils'
import { useStrings } from 'framework/exports'
import type { FilterInterface, FilterDataInterface } from '@common/components/Filter/Constants'
import type { CrudOperation } from '@common/components/Filter/FilterCRUD/FilterCRUD'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import ConnectorsListView from './views/ConnectorsListView'
import { ConnectorCatalogueNames } from './ConnectorsPage.i18n'
import { getIconByType, getConnectorDisplayName } from './utils/ConnectorUtils'
import {
  createRequestBodyPayload,
  ConnectorFormType,
  getValidFilterArguments,
  renderItemByType,
  getAggregatedConnectorFilter,
  ConnectorStatCategories,
  getOptionsForMultiSelect,
  validateForm
} from './utils/RequestUtils'
import css from './ConnectorsPage.module.scss'

interface ConnectorsListProps {
  mockData?: UseGetMockData<ResponsePageConnectorResponse>
  catalogueMockData?: UseGetMockData<ResponseConnectorCatalogueResponse>
  statisticsMockData?: UseGetMockData<ResponseConnectorStatistics>
  filtersMockData?: UseGetMockData<ResponsePageFilterDTO>
}

const ConnectorsPage: React.FC<ConnectorsListProps> = ({ catalogueMockData, statisticsMockData, filtersMockData }) => {
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<FilterDTO[]>()
  const [appliedFilter, setAppliedFilter] = useState<FilterDTO | null>()
  const { showSuccess, showError } = useToaster()
  const [fetchedConnectorResponse, setFetchedConnectorResponse] = useState<PageConnectorResponse | undefined>()
  const [isFetchingConnectors, setIsFetchingConnectors] = useState<boolean>(false)
  const [errorWhileFetchingConnectors, setErrorWhileFetchingConnectors] = useState<Error>()
  const [isRefreshingFilters, setIsRefreshingFilters] = useState<boolean>(false)
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(false)
  const defaultQueryParams = {
    pageIndex: page,
    pageSize: 10,
    projectIdentifier,
    orgIdentifier,
    searchTerm,
    accountIdentifier: accountId
  }
  const history = useHistory()
  useDocumentTitle([getString('resources'), getString('connectors.label')])

  /* #region Connector CRUD section */

  const { mutate: fetchConnectors } = useGetConnectorListV2({
    queryParams: defaultQueryParams
  })

  const refetchConnectorList = async (filter?: ConnectorFilterProperties, needsRefinement = true): Promise<void> => {
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
      /* istanbul ignore else */ if (status === 'SUCCESS') {
        setFetchedConnectorResponse(data)
      }
    } /* istanbul ignore next */ catch (e) {
      showError(e.data?.message || e.message)
      setErrorWhileFetchingConnectors(e)
    }
    setIsFetchingConnectors(false)
  }

  const fetchConnectorsWithFiltersApplied = (): Promise<void> => refetchConnectorList(appliedFilter?.filterProperties)

  useEffect(() => {
    ;(async () => {
      await fetchConnectorsWithFiltersApplied()
    })()
  }, [page])

  const handleConnectorSearchByName = (query: string, filter: ConnectorFilterProperties) => {
    refetchConnectorList(getAggregatedConnectorFilter(query, filter))
  }

  const handler = useCallback(debounce(handleConnectorSearchByName, 300), [])

  const onSearch = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const query = (event.target as HTMLInputElement).value
    setSearchTerm(query)
    handler(query, appliedFilter?.filterProperties || {})
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
    /* istanbul ignore else */
    if (catalogueWithYAMLBuilderOption.length === originalData.length) {
      catalogueWithYAMLBuilderOption.push(createViaYAMLBuilderOption)
    }
    return Object.assign(
      {},
      {
        drawerLabel: 'Connectors',
        categories:
          catalogueWithYAMLBuilderOption
            .filter(item => item.category !== 'CLOUD_COST')
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

  const { loading: isFetchingConnectorStats, data: metaData } = useGetConnectorStatistics({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    },
    mock: statisticsMockData
  })

  useEffect(() => {
    setIsFetchingStats(isFetchingConnectorStats)
  }, [isFetchingConnectorStats])

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      fetchConnectorsWithFiltersApplied()
    },
    onClose: () => {
      fetchConnectorsWithFiltersApplied()
    }
  })

  const rerouteBasedOnContext = (): void => {
    if (projectIdentifier && orgIdentifier) {
      history.push(routes.toCreateConnectorFromYamlAtProjectLevel({ projectIdentifier, orgIdentifier, accountId }))
    } else if (orgIdentifier) {
      history.push(routes.toCreateConnectorFromYamlAtOrgLevel({ orgIdentifier, accountId }))
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

  /* #endregion */

  /* #region Connector Filter CRUD Section */

  const ConnectorForm = (): React.ReactElement => {
    return (
      <>
        <FormInput.Text name={'connectorNames'} label={getString('connectors.name')} key={'connectorNames'} />
        <FormInput.Text name={'connectorIdentifiers'} label={getString('identifier')} key={'connectorIdentifiers'} />
        <FormInput.Text name={'description'} label={getString('description')} key={'description'} />
        <FormInput.MultiSelect
          items={getOptionsForMultiSelect(ConnectorStatCategories.TYPE, metaData || {})}
          name="types"
          label={getString('typeLabel')}
          key="types"
          multiSelectProps={{
            allowCreatingNewItems: false
          }}
        />
        <FormInput.KVTagInput name="tags" label={getString('tagsLabel')} key="tags" />
        <FormInput.MultiSelect
          items={getOptionsForMultiSelect(ConnectorStatCategories.STATUS, metaData || {})}
          name="connectivityStatuses"
          label={getString('connectivityStatus')}
          key="connectivityStatuses"
          multiSelectProps={{
            allowCreatingNewItems: false
          }}
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

  /* istanbul ignore next */ if (errorFetchingFilterList) {
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

  const getFilterByIdentifier = (identifier: string): FilterDTO | undefined =>
    /* istanbul ignore if */
    filters?.find((filter: FilterDTO) => filter.identifier?.toLowerCase() === identifier.toLowerCase())

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
    setIsRefreshingFilters(true)
    const requestBodyPayload = createRequestBodyPayload({ isUpdate, data, projectIdentifier, orgIdentifier })
    try {
      const { status, data: updatedFilter } = isUpdate
        ? await updateFilter(requestBodyPayload)
        : await createFilter(requestBodyPayload)
      if (status === 'SUCCESS') {
        showSuccess(`${requestBodyPayload?.name} ${isUpdate ? 'updated' : 'saved'}.`)
        await refetchFilterList()
        if (isUpdate) {
          setAppliedFilter(updatedFilter)
          refetchConnectorList(updatedFilter?.filterProperties)
        }
      }
    } /* istanbul ignore next */ catch (e) {
      showError(e.data?.message || e.message)
    }
    setIsRefreshingFilters(false)
  }

  const handleDelete = async (identifier: string): Promise<void> => {
    setIsRefreshingFilters(true)
    const matchingFilter = getFilterByIdentifier(identifier)
    if (!matchingFilter?.identifier) {
      showError(getString('somethingWentWrong'))
      return
    }
    try {
      const { status } = await deleteFilter(matchingFilter?.identifier || '')
      if (status === 'SUCCESS') {
        showSuccess(`${matchingFilter?.name} ${getString('filters.filterDeleted')}`)
        await refetchFilterList()
        if (matchingFilter?.identifier === appliedFilter?.identifier) {
          reset()
        }
      }
    } /* istanbul ignore next */ catch (e) {
      showError(e.data?.message || e.message)
    }
    setIsRefreshingFilters(false)
  }

  const unsavedFilter = {
    name: UNSAVED_FILTER,
    identifier: StringUtils.getIdentifierFromName(UNSAVED_FILTER)
  }

  const handleFilterClick = (identifier: string): void => {
    if (identifier !== unsavedFilter.identifier) {
      setAppliedFilter(getFilterByIdentifier(identifier))
    }
  }

  const typeMultiSelectValues = getOptionsForMultiSelect(ConnectorStatCategories.TYPE, metaData || {})?.map(
    option => option.value
  ) as string[]
  const connectivityStatusMultiValues = getOptionsForMultiSelect(ConnectorStatCategories.STATUS, metaData || {})?.map(
    option => option.value
  ) as string[]

  const [openFilterDrawer, hideFilterDrawer] = useModalHook(() => {
    const onFilterApply = (formData: Record<string, any>) => {
      if (!isObjectEmpty(formData)) {
        const filterFromFormData = getValidFilterArguments({ ...formData })
        const aggregatedFilter = getAggregatedConnectorFilter(searchTerm, { ...filterFromFormData })
        setAppliedFilter({ ...unsavedFilter, filterProperties: aggregatedFilter || {} })
        refetchConnectorList(aggregatedFilter, false)
        hideFilterDrawer()
      } else {
        showError(getString('filters.invalidCriteria'))
      }
    }

    const { connectorNames, connectorIdentifiers, description, types, connectivityStatuses, tags } =
      (appliedFilter?.filterProperties as ConnectorFilterProperties) || {}
    const { name = '', filterVisibility } = appliedFilter || {}
    return isFetchingStats ? (
      <PageSpinner />
    ) : (
      <Filter<ConnectorFormType, FilterInterface>
        onApply={onFilterApply}
        onClose={() => {
          hideFilterDrawer()
          refetchFilterList()
        }}
        filters={filters}
        initialFilter={{
          formValues: {
            connectorNames,
            connectorIdentifiers,
            description,
            types: getMultiSelectFormOptions(types),
            connectivityStatuses: getMultiSelectFormOptions(connectivityStatuses),
            tags
          },
          metadata: {
            name,
            filterVisibility: filterVisibility,
            identifier: appliedFilter?.identifier || ''
          }
        }}
        onSaveOrUpdate={handleSaveOrUpdate}
        onDelete={handleDelete}
        onFilterSelect={handleFilterClick}
        isRefreshingFilters={isRefreshingFilters || isFetchingStats}
        formFields={<ConnectorForm />}
        onValidate={(values: Partial<ConnectorFormType>): FormikErrors<Partial<ConnectorFormType>> => {
          const errors: FormikErrors<{ types?: MultiSelectOption[]; connectivityStatuses?: MultiSelectOption[] }> = {}
          const { typeErrors, connectivityStatusErrors } = validateForm(
            values,
            typeMultiSelectValues,
            connectivityStatusMultiValues,
            metaData || {}
          )
          if (typeErrors?.size > 0) {
            errors.types = getString('filters.invalidSelection') + ': ' + renderItemByType(Array.from(typeErrors))
          }
          if (connectivityStatusErrors?.size > 0) {
            errors.connectivityStatuses =
              getString('filters.invalidSelection') + ': ' + renderItemByType(Array.from(connectivityStatusErrors))
          }
          return errors
        }}
        dataSvcConfig={new Map<CrudOperation, Function>([['ADD', createFilter]])}
        onSuccessfulCrudOperation={refetchFilterList}
      />
    )
  }, [isRefreshingFilters, filters, appliedFilter, isFetchingStats, searchTerm])

  const handleFilterSelection = (
    option: SelectOption,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ): void => {
    event?.stopPropagation()
    event?.preventDefault()
    /* istanbul ignore else */
    if (option.value) {
      const selectedFilter = getFilterByIdentifier(option.value?.toString())
      const aggregatedFilter = getAggregatedConnectorFilter(searchTerm, selectedFilter?.filterProperties || {})
      const combinedFilter = Object.assign(selectedFilter, { filterProperties: aggregatedFilter })
      setAppliedFilter(combinedFilter)
      refetchConnectorList(aggregatedFilter, false)
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

  const fieldToLabelMapping = new Map<string, string>()
  fieldToLabelMapping.set('connectorNames', getString('connectors.name'))
  fieldToLabelMapping.set('connectorIdentifiers', getString('identifier'))
  fieldToLabelMapping.set('description', getString('description'))
  fieldToLabelMapping.set('types', getString('typeLabel'))
  fieldToLabelMapping.set('tags', getString('tagsLabel'))
  fieldToLabelMapping.set('connectivityStatuses', getString('connectivityStatus'))

  const reset = (): void => {
    setAppliedFilter(null)
    refetchConnectorList()
    setErrorWhileFetchingConnectors(undefined)
  }

  /* #endregion */

  return (
    <Layout.Vertical height={'calc(100vh - 64px'} className={css.listPage}>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="50%">
          <Button
            intent="primary"
            text={getString('newConnector')}
            icon="plus"
            onClick={openDrawer}
            id="newConnectorBtn"
          />
        </Layout.Horizontal>
        <Layout.Horizontal spacing="small" width="30%" className={css.view}>
          <TextInput
            leftIcon="search"
            placeholder={getString('search')}
            value={searchTerm}
            onChange={onSearch}
            id="filterConnectorByName"
          />
        </Layout.Horizontal>
        <Layout.Horizontal spacing="small" width="20%" className={css.view}>
          <Select
            items={
              filters?.map((item: FilterDTO) => {
                return {
                  label: truncate(item?.name, { length: MAX_FILTER_NAME_LENGTH }),
                  value: item?.identifier
                } as SelectOption
              }) || []
            }
            onChange={handleFilterSelection}
            addClearBtn={true}
            value={{ label: appliedFilter?.name || '', value: appliedFilter?.identifier || '' }}
            inputProps={{
              placeholder: getString('filters.selectFilter')
            }}
            noResults={<MenuItem disabled={true} text="No filter found." />}
          />
          {fieldCountInAppliedFilter ? (
            <Popover
              interactionKind={PopoverInteractionKind.HOVER}
              position={Position.BOTTOM}
              content={getFilterSummary(fieldToLabelMapping, filterWithValidFields)}
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
            {' '}
            <OverlaySpinner show={true} className={css.loading}>
              <></>
            </OverlaySpinner>
          </div>
        ) : /* istanbul ignore next */ errorWhileFetchingConnectors ? (
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
            reload={fetchConnectorsWithFiltersApplied}
            openConnectorModal={openConnectorModal}
            gotoPage={pageNumber => setPage(pageNumber)}
          />
        ) : (
          <Page.NoDataCard icon="nav-dashboard" message={getString('noConnectorFound')} />
        )}
      </Page.Body>
    </Layout.Vertical>
  )
}

export default ConnectorsPage
