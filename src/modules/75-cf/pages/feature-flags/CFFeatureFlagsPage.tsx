import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Color,
  Layout,
  Container,
  Icon,
  Text,
  // ExpandingSearchInput,
  Button,
  FlexExpander,
  Select,
  SelectOption,
  Heading,
  Utils,
  Pagination
} from '@wings-software/uicore'
import ReactTimeago from 'react-timeago'
import { /*Drawer,*/ Menu, Position, Switch, Classes } from '@blueprintjs/core'
import { get } from 'lodash-es'
import type { CellProps, Renderer, Column, Cell } from 'react-table'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/exports'
import { useConfirmAction, useLocalStorage } from '@common/hooks'
import Table from '@common/components/Table/Table'
import type { GetEnvironmentListForProjectQueryParams } from 'services/cd-ng'
import { useGetAllFeatures, Feature, useDeleteFeatureFlag, Features, FeatureState } from 'services/cf'
import { useStrings } from 'framework/exports'
import { useToggleFeatureFlag } from '@cf/hooks/useToggleFeatureFlag'
import { VariationTypeIcon } from '@cf/components/VariationTypeIcon/VariationTypeIcon'
import { VariationWithIcon } from '@cf/components/VariationWithIcon/VariationWithIcon'
import { ListingPageTemplate } from '@cf/components/ListingPageTemplate/ListingPageTemplate'
import {
  CF_LOCAL_STORAGE_ENV_KEY,
  DEFAULT_ENV,
  isFeatureFlagOn,
  CF_DEFAULT_PAGE_SIZE,
  featureFlagHasCustomRules,
  FeatureFlagActivationStatus
} from '../../utils/CFUtils'
import { FlagTypeVariations } from '../../components/CreateFlagDialog/FlagDialogUtils'
// import FlagDrawerFilter from '../../components/FlagFilterDrawer/FlagFilterDrawer'
import FlagDialog from '../../components/CreateFlagDialog/FlagDialog'
import { useEnvironments } from '../../hooks/environment'
import i18n from './CFFeatureFlagsPage.i18n'
import css from './CFFeatureFlagsPage.module.scss'

interface RenderColumnFlagProps {
  cell: Cell<Feature>
  update: (status: boolean) => void
}

const RenderColumnFlag: React.FC<RenderColumnFlagProps> = ({ cell: { row }, update }) => {
  const data = row.original
  const [environment] = useLocalStorage(CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV)
  const [status, setStatus] = useState(isFeatureFlagOn(data))
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId: accountIdentifier } = useParams<Record<string, string>>()
  const toggleFeatureFlag = useToggleFeatureFlag({
    accountIdentifier,
    orgIdentifier,
    projectIdentifier,
    environmentIdentifier: data.envProperties?.environment as string,
    flagIdentifier: data.identifier
  })
  const { showError, clear } = useToaster()
  const [flagNameTextSize, setFlagNameTextSize] = useState(300)
  const ref = useRef<HTMLDivElement>(null)

  const switchTooltip = (
    <Container width={'350px'} padding="xxxlarge">
      <Heading level={2} style={{ fontWeight: 600, fontSize: '24px', lineHeight: '32px', color: '#22222A' }}>
        {getString(status ? 'cf.featureFlags.turnOffHeading' : 'cf.featureFlags.turnOnHeading')}
      </Heading>
      <Text margin={{ top: 'medium', bottom: 'small' }} style={{ lineHeight: '22px', color: '#383946' }}>
        <span
          // This is used to retain simple HTML markup in i18n string like <strong>
          // to make sure formating is aligned with translations
          dangerouslySetInnerHTML={{
            __html: getString(status ? 'cf.featureFlags.turnOffMessage' : 'cf.featureFlags.turnOnMessage', {
              name: data.name,
              env: environment?.label
            })
          }}
        />
      </Text>
      <Text margin={{ top: 'xsmall', bottom: 'xlarge' }} style={{ lineHeight: '22px', color: '#383946' }}>
        {(!featureFlagHasCustomRules(data) && (
          <span
            // This is used to retain simple HTML markup in i18n string like <strong>
            // to make sure formating is aligned with translations
            dangerouslySetInnerHTML={{
              __html: getString('cf.featureFlags.defaultWillBeServed', {
                defaultVariation: status ? data.defaultOffVariation : data.defaultOnVariation
              })
            }}
          />
        )) ||
          getString('cf.featureFlags.customRuleMessage')}
      </Text>
      <Container flex>
        <Layout.Horizontal spacing="small">
          <Button
            intent="primary"
            text={getString('confirm')}
            className={Classes.POPOVER_DISMISS}
            onClick={() => {
              const toggleFn = status ? toggleFeatureFlag.off() : toggleFeatureFlag.on()

              toggleFn
                .then(() => {
                  setStatus(!status)
                  update(!status)
                })
                .catch(error => {
                  showError(get(error, 'message', get(error, 'data.message', error.toString())), 0)
                })
            }}
          />
          <Button text={getString('cancel')} className={Classes.POPOVER_DISMISS} />
        </Layout.Horizontal>
        <span />
      </Container>
    </Container>
  )

  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  const onResize = () => {
    if (ref.current) {
      setFlagNameTextSize((ref.current.closest('div[role="cell"]') as HTMLDivElement)?.offsetWidth - 174)
    }
  }

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <Container flex>
      <Container onMouseDown={Utils.stopEvent} onClick={Utils.stopEvent}>
        <Button
          noStyling
          tooltip={switchTooltip}
          tooltipProps={{ interactionKind: 'click', hasBackdrop: true, position: Position.TOP_LEFT }}
          className={css.toggleFlagButton}
        >
          <Switch
            style={{ alignSelf: 'baseline', marginLeft: '-10px' }}
            alignIndicator="right"
            className={Classes.LARGE}
            checked={status}
            // Empty onChange() to avoid React warning
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
          />
        </Button>
      </Container>
      <Layout.Horizontal spacing="small" style={{ flexGrow: 1, paddingLeft: 'var(--spacing-medium)' }}>
        <Layout.Vertical flex className={css.generalInfo} ref={ref}>
          <Text
            style={{
              color: '#22222A',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '16px'
            }}
            margin={{ right: 'xsmall' }}
            width={flagNameTextSize}
            lineClamp={2}
          >
            {data.name}
          </Text>
          {data.description && (
            <Text
              style={{
                color: '#22222A',
                fontSize: '12px',
                lineHeight: '24px'
              }}
            >
              {data.description}
            </Text>
          )}
        </Layout.Vertical>
        <Text
          width="100px"
          flex
          icon="main-tags"
          style={{ justifyContent: 'center' }}
          tooltip={
            data?.tags?.length ? (
              <>
                <Text>{i18n.tags.toUpperCase()}</Text>
                {data.tags.map((elem, i) => (
                  <Text key={`${elem.value}-${i}`}>{elem.value}</Text>
                ))}
              </>
            ) : undefined
          }
          tooltipProps={{
            portalClassName: css.tagsPopover,
            position: Position.RIGHT
          }}
        >
          {data?.tags?.length || 0}
        </Text>
      </Layout.Horizontal>
    </Container>
  )
}

const RenderColumnDetails: Renderer<CellProps<Feature>> = ({ row }) => {
  const data = row.original
  const { getString } = useStrings()
  const isOn = isFeatureFlagOn(data)
  const hasCustomRules = featureFlagHasCustomRules(data)
  const index = data.variations.findIndex(
    d => d.identifier === (isOn ? data.defaultOnVariation : data.defaultOffVariation)
  )

  return (
    <Layout.Vertical>
      <Layout.Horizontal>
        <Text>
          <VariationTypeIcon multivariate={data.kind !== FlagTypeVariations.booleanFlag} />
          {getString(data.kind === FlagTypeVariations.booleanFlag ? 'cf.boolean' : 'cf.multivariate')}
        </Text>
      </Layout.Horizontal>
      {!hasCustomRules && (
        <Container style={{ display: 'flex', alignItems: 'center' }}>
          <VariationWithIcon
            variation={data.variations[index]}
            index={index}
            textStyle={{
              fontSize: '12px',
              lineHeight: '24px',
              color: '#9293AB',
              paddingLeft: 'var(--spacing-xsmall)'
            }}
            textElement={getString(isOn ? 'cf.featureFlags.defaultServedOn' : 'cf.featureFlags.defaultServedOff', {
              defaultVariation: data.variations[index].name || data.variations[index].value
            })}
          />
        </Container>
      )}
    </Layout.Vertical>
  )
}

const RenderColumnStatus: Renderer<CellProps<Feature>> = ({ row }) => {
  const { getString } = useStrings()
  const { archived } = row.original
  return (
    <Text inline className={cx(css.status, archived && css.archived)}>
      {getString(archived ? 'inactive' : 'active').toLocaleUpperCase()}
    </Text>
  )
}

const RenderColumnLastUpdated: Renderer<CellProps<Feature>> = ({ row }) => {
  return row.original?.modifiedAt ? (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      <ReactTimeago date={row.original?.modifiedAt} />
    </Layout.Horizontal>
  ) : null
}

interface ColumnMenuProps {
  cell: Cell<Feature>
  environment?: string
}

const RenderColumnEdit: React.FC<ColumnMenuProps> = ({ cell: { row, column }, environment }) => {
  const data = row.original
  const { showError } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<any>()
  const history = useHistory()
  const { getString } = useStrings()
  const { mutate } = useDeleteFeatureFlag({
    queryParams: {
      project: projectIdentifier as string,
      account: accountId,
      org: orgIdentifier
    }
  })
  const refetch = ((column as unknown) as { refetch: () => void }).refetch
  const deleteFlag = useConfirmAction({
    title: getString('cf.featureFlags.deleteFlag'),
    confirmText: getString('delete'),
    message: (
      <Text font="medium">
        <span
          dangerouslySetInnerHTML={{ __html: getString('cf.featureFlags.deleteFlagMessage', { name: data.name }) }}
        />
      </Text>
    ),
    action: async () => {
      try {
        await mutate(data.identifier)
        refetch?.()
      } catch (e) {
        showError(e)
      }
    }
  })

  const onDetailPage = (): void => {
    history.push(
      routes.toCFFeatureFlagsDetail({
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        environmentIdentifier: environment as string,
        featureFlagIdentifier: data.identifier,
        accountId
      })
    )
  }

  return (
    <Container
      style={{ textAlign: 'right' }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
      }}
    >
      <Button
        minimal
        icon="Options"
        iconProps={{ size: 24 }}
        tooltipProps={{ isDark: true, interactionKind: 'click', hasBackdrop: true }}
        tooltip={
          <Menu style={{ minWidth: 'unset' }}>
            <Menu.Item
              icon="edit"
              text={i18n.edit}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onDetailPage()
              }}
            />
            <Menu.Item icon="trash" text={i18n.delete} className={Classes.POPOVER_DISMISS} onClick={deleteFlag} />
          </Menu>
        }
      />
    </Container>
  )
}

const CFFeatureFlagsPage: React.FC = () => {
  // const [isSaveFiltersOn, setIsSaveFiltersOn] = useState(false)
  // const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  const [environment, setEnvironment] = useLocalStorage<typeof DEFAULT_ENV | undefined>(
    CF_LOCAL_STORAGE_ENV_KEY,
    DEFAULT_ENV
  )
  const { projectIdentifier, orgIdentifier, accountId } = useParams<Record<string, string>>()
  const history = useHistory()

  const { data: environments, loading: envsLoading, error: envsError, refetch: refetchEnvironments } = useEnvironments({
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier
  } as GetEnvironmentListForProjectQueryParams)
  const [pageNumber, setPageNumber] = useState(0)
  const queryParams = useMemo(() => {
    return {
      project: projectIdentifier as string,
      environment: environment?.value as string,
      account: accountId,
      org: orgIdentifier,
      pageSize: CF_DEFAULT_PAGE_SIZE,
      pageNumber
    }
  }, [projectIdentifier, environment?.value, accountId, orgIdentifier, pageNumber])
  const { data, loading: flagsLoading, error: flagsError, refetch } = useGetAllFeatures({
    lazy: true,
    queryParams
  })
  const [features, setFeatures] = useState<Features | null>()
  const { getString } = useStrings()

  useEffect(() => {
    if (!envsLoading) {
      if (environments?.length > 0) {
        if (environment?.value && environments.find(v => v.value === environment.value)) {
          setEnvironment({ label: environment.label, value: environment.value })
          refetch({ queryParams: { ...queryParams, environment: environment.value } })
        } else {
          setEnvironment({ label: environments[0].label, value: environments[0].value as string })
          refetch({ queryParams: { ...queryParams, environment: environments[0].value as string } })
        }
      } else if (environments?.length === 0) {
        setEnvironment(undefined)
        setFeatures(undefined)
        // TODO: Show modal to create an environment
      }
    }
  }, [environments?.length, envsLoading])

  useEffect(() => {
    setFeatures(data)
  }, [data])

  const error = flagsError || envsError
  const loading = flagsLoading || envsLoading

  const columns: Column<Feature>[] = useMemo(
    () => [
      {
        Header: i18n.featureFlag.toUpperCase(),
        accessor: row => row.name,
        width: '50%',
        Cell: function WrapperRenderColumnFlag(cell: Cell<Feature>) {
          return (
            <RenderColumnFlag
              cell={cell}
              update={status => {
                // Update last updated column to reflect latest change without having to refetch the whole list
                // The setTimeout makes sure there's enough time for animation in the switch component before re-rendering
                // takes place and destroy it
                setTimeout(() => {
                  const feature = features?.features?.find(f => f.identifier === cell.row.original.identifier)
                  if (feature) {
                    if (feature.envProperties) {
                      feature.envProperties.state = (status
                        ? FeatureFlagActivationStatus.ON
                        : FeatureFlagActivationStatus.OFF) as FeatureState
                    }
                    feature.modifiedAt = Date.now()
                    setFeatures({ ...features } as Features)
                  }
                }, 1000)
              }}
            />
          )
        }
      },
      {
        Header: i18n.details.toUpperCase(),
        accessor: row => row.kind,
        width: '20%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.status.toUpperCase(),
        accessor: 'archived',
        width: '10%',
        Cell: RenderColumnStatus
      },
      {
        Header: i18n.lastUpdated.toUpperCase(),
        accessor: row => row.modifiedAt,
        width: '15%',
        Cell: RenderColumnLastUpdated
      },
      {
        Header: '',
        id: 'version',
        width: '5%',
        Cell: function WrapperRenderColumnEdit(cell: Cell<Feature>) {
          return <RenderColumnEdit cell={cell} environment={environment?.value as string} />
        },
        disableSortBy: true,
        refetch
      }
    ],
    [refetch]
  )

  // const onDrawerOpened = (): void => {
  //   setIsDrawerOpened(true)
  // }

  // const onDrawerClose = (): void => {
  //   setIsDrawerOpened(false)
  // }

  const onEnvironmentChanged = (item: SelectOption) => {
    setEnvironment({ label: item?.label, value: item.value as string })
    refetch({ queryParams: { ...queryParams, environment: item.value as string } })
  }
  const hasFeatureFlags = features?.features && features?.features?.length > 0
  const emptyFeatureFlags = features?.features && features?.features?.length === 0
  const title = getString('featureFlagsText')

  return (
    <ListingPageTemplate
      pageTitle={title}
      header={title}
      toolbar={
        <Layout.Horizontal>
          <FlagDialog disabled={loading} environment={environment?.value as string} />

          <FlexExpander />

          {/** TODO: Disable search as backend does not support it yet */}
          {/* <ExpandingSearchInput name="findFlag" placeholder={i18n.searchInputFlag} className={css.ffPageBtnsSearch} /> */}

          <Select
            items={environments}
            className={css.ffPageBtnsSelect}
            inputProps={{ placeholder: i18n.selectEnv }}
            onChange={onEnvironmentChanged}
            value={environment?.value ? environment : environments[0] || null}
            disabled={loading}
          />

          {/** TODO: Disable filter as backend does not fully support it yet */}
          {/* <Button
            disabled={loading}
            icon="settings"
            iconProps={{ size: 20, color: Color.BLUE_500 }}
            minimal
            intent="primary"
            onClick={onDrawerOpened}
          /> */}
        </Layout.Horizontal>
      }
      content={
        <>
          {hasFeatureFlags && (
            <Container padding={{ top: 'medium', right: 'xxlarge', left: 'xxlarge' }}>
              <Container className={css.list}>
                <Table<Feature>
                  columns={columns}
                  data={features?.features || []}
                  onRowClick={feature => {
                    history.push(
                      routes.toCFFeatureFlagsDetail({
                        orgIdentifier: orgIdentifier as string,
                        projectIdentifier: projectIdentifier as string,
                        environmentIdentifier: environment?.value || (environments[0]?.value as string),
                        featureFlagIdentifier: feature.identifier,
                        accountId
                      })
                    )
                  }}
                />
              </Container>
            </Container>
          )}

          {emptyFeatureFlags && (
            <Layout.Vertical className={css.emptyContainer}>
              <Container>
                <Icon name="flag" size={150} color={Color.GREY_300} className={css.ffImage} />
              </Container>
              <Text color="grey400" style={{ fontSize: '20px', padding: '40px 0' }}>
                {i18n.noFeatureFlags}
              </Text>
              <FlagDialog environment={environment?.value as string} />
            </Layout.Vertical>
          )}
        </>
      }
      pagination={
        !!features?.itemCount && (
          <Pagination
            itemCount={features?.itemCount || 0}
            pageSize={features?.pageSize || 0}
            pageCount={features?.pageCount || 0}
            pageIndex={pageNumber}
            gotoPage={index => {
              setPageNumber(index)
              refetch({ queryParams: { ...queryParams, pageNumber: index } })
            }}
          />
        )
      }
      loading={loading}
      error={error}
      retryOnError={() => {
        setPageNumber(0)
        refetchEnvironments()
      }}
    />
  )
}

export default CFFeatureFlagsPage
