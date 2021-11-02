import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  Button,
  Container,
  Text,
  Select,
  SelectOption,
  Color,
  useToaster,
  ButtonVariation,
  Layout,
  FontVariation
} from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { useDeleteSLOData, useGetMonitoredServiceListEnvironments, useGetServiceLevelObjectives } from 'services/cv'
import { getEnvironmentOptions, getErrorMessage } from '@cv/utils/CommonUtils'
import Card from '@cv/components/Card/Card'
import ContextMenuActions from '@cv/components/ContextMenuActions/ContextMenuActions'
import { LIST_SLOS_OFFSET, LIST_SLOS_PAGESIZE } from './CVSLOsListingPage.constants'
import { getSLOsData } from './components/CVCreateSLO/CVSLOsListingPage.utils'
import type { SLOForm } from './components/CVCreateSLO/components/CreateSLOForm/CreateSLO.types'
import css from './CVSLOsListingPage.module.scss'

function CVSLOsListingPage(): JSX.Element {
  const { getString } = useStrings()
  const history = useHistory()
  const { showError, showSuccess, clear } = useToaster()
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps & { identifier: string }>()
  const [environment, setEnvironment] = useState<SelectOption>()
  const { data: environmentDataList, loading: loadingEnvironments } = useGetMonitoredServiceListEnvironments({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const {
    data: SLOsData,
    loading: loadingSLOs,
    refetch: fetchSLOs,
    error: SLOsError
  } = useGetServiceLevelObjectives({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      offset: LIST_SLOS_OFFSET,
      pageSize: LIST_SLOS_PAGESIZE
    }
  })

  const { mutate: deleteSLO, loading: deleteSLOLoading } = useDeleteSLOData({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const environmentOptions = useMemo(
    () => getEnvironmentOptions(environmentDataList, loadingEnvironments, getString),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [environmentDataList, loadingEnvironments]
  )

  const SLOsList = useMemo(() => getSLOsData(SLOsData), [SLOsData])

  const onDelete = useCallback(async (identifier: string, name: string) => {
    try {
      await deleteSLO(identifier)
      fetchSLOs()
      showSuccess(getString('cv.slos.sloDeleted', { name }))
    } catch (e) {
      clear()
      showError(getErrorMessage(e))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderSLOsCards = useCallback(
    SLOs => {
      if (!isEmpty(SLOs)) {
        return SLOs.map((slo: SLOForm) => {
          return (
            <Card key={slo.identifier} className={css.sloCard}>
              <>
                <Container className={css.sloTitle}>
                  <Text font={{ variation: FontVariation.SMALL_BOLD }} color={Color.GREY_600}>
                    {slo.name}
                  </Text>
                  <ContextMenuActions
                    titleText={getString('common.delete', { name: slo.name })}
                    contentText={
                      <Text color={Color.GREY_800}>{getString('cv.slos.confirmDeleteSLO', { name: slo.name })}</Text>
                    }
                    confirmButtonText={getString('yes')}
                    deleteLabel={getString('cv.slos.deleteSLO')}
                    onDelete={() => onDelete(slo.identifier, slo.name)}
                    editLabel={getString('cv.slos.editSLO')}
                    onEdit={() => {
                      history.push({
                        pathname: routes.toCVEditSLOs({
                          accountId,
                          projectIdentifier,
                          orgIdentifier,
                          identifier: slo.identifier,
                          module: 'cv'
                        })
                      })
                    }}
                  />
                </Container>
                <Container className={css.sloHeader}>
                  <Container className={css.sloBasicInfo}>
                    <Text font={{ size: 'small' }} color={Color.GREY_400} padding={{ top: 'xsmall' }}>{`${getString(
                      'connectors.cdng.monitoredService.label'
                    )} : ${slo.monitoredServiceRef}`}</Text>
                    <Text font={{ size: 'small' }} color={Color.GREY_400} padding={{ top: 'xsmall' }}>{`${getString(
                      'cv.slos.sliType'
                    )} : ${slo.serviceLevelIndicators.type}`}</Text>
                    <Text
                      font={{ size: 'small' }}
                      color={Color.GREY_400}
                      padding={{ top: 'xsmall', bottom: 'small' }}
                    >{`${getString('cv.slos.healthSource')} : ${slo.healthSourceRef}`}</Text>
                  </Container>
                </Container>
                <hr className={css.seperator} />
              </>
            </Card>
          )
        })
      } else {
        return <></>
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountId, orgIdentifier, projectIdentifier]
  )

  return (
    <>
      <Page.Header breadcrumbs={<NGBreadcrumbs />} title={getString('cv.slos.title')} />
      <Page.Header
        title={
          <Button
            variation={ButtonVariation.PRIMARY}
            icon="plus"
            text={getString('cv.slos.newSLO')}
            onClick={() => {
              history.push(
                routes.toCVCreateSLOs({
                  orgIdentifier,
                  projectIdentifier,
                  accountId
                })
              )
            }}
          />
        }
        toolbar={
          <Layout.Horizontal>
            <Select
              value={{
                label: `${getString('environment')}: ${environment?.label ?? getString('all')}`,
                value: environment?.value ?? getString('all')
              }}
              defaultSelectedItem={{ label: getString('all'), value: getString('all') }}
              items={environmentOptions}
              onChange={item => setEnvironment(item)}
              className={css.filterSelect}
            />
          </Layout.Horizontal>
        }
      />
      <Page.Body
        loading={loadingEnvironments || loadingSLOs || deleteSLOLoading}
        error={getErrorMessage(SLOsError)}
        retryOnError={() => fetchSLOs()}
        noData={{
          when: () => !SLOsList.length,
          message: getString('cv.slos.noData'),
          icon: 'join-table'
        }}
        className={css.pageBody}
      >
        <Container className={css.slosContainer}>{renderSLOsCards(SLOsList)}</Container>
      </Page.Body>
    </>
  )
}

export default CVSLOsListingPage
