/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, HarnessDocTooltip, Layout, ExpandingSearchInput, useModalHook } from '@wings-software/uicore'
import { Dialog } from '@blueprintjs/core'
import { useMutateAsGet } from '@common/hooks'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { useStrings } from 'framework/strings'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import type { PipelineType, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'
import RbacButton from '@rbac/components/Button/Button'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

import { useGetConnectorListV2, GetConnectorListV2QueryParams } from 'services/cd-ng'

import ProvidersGridView from './ProvidersGridView'
import NewProviderModal from './NewProviderModal/NewProviderModal'

import css from './GitOpsModalContainer.module.scss'

const GitOpsModalContainer: React.FC = () => {
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<PipelineType<ProjectPathProps>>()
  const { getString } = useStrings()
  const { selectedProject } = useAppStore()
  const project = selectedProject
  const textIdentifier = 'gitOps'

  const [providers, setProviders] = useState([])
  const [loadingConnectors, setLoadingConnectors] = useState(false)

  const defaultQueryParams: GetConnectorListV2QueryParams = {
    pageIndex: 0,
    pageSize: 10,
    accountIdentifier: accountId,
    projectIdentifier: projectIdentifier,
    orgIdentifier: orgIdentifier
  }

  const { mutate: fetchConnectors } = useGetConnectorListV2({
    queryParams: defaultQueryParams
  })

  const searchProvider = () => {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const processConnectorsResponse = (connectors: any) => {
    const argoProviders = connectors?.map((connectorData: any) => {
      return connectorData?.connector
    })

    if (argoProviders && argoProviders.length > 0) {
      setProviders(argoProviders)
    }
  }

  const refetchConnectorList = async (): Promise<void> => {
    setLoadingConnectors(true)

    const { data: connectorResponse } = await fetchConnectors({
      filterType: 'Connector',
      types: ['ArgoConnector']
    })

    const data = connectorResponse?.content

    processConnectorsResponse(data)
    setLoadingConnectors(false)
  }

  const { data: connectorData, loading } = useMutateAsGet(useGetConnectorListV2, {
    body: { filterType: 'Connector', types: ['ArgoConnector'] },
    queryParams: defaultQueryParams
  })

  useEffect(() => {
    const data = connectorData?.data?.content
    processConnectorsResponse(data)
  }, [connectorData])

  const [addNewProdiverModal, closeNewProviderModal] = useModalHook(() => {
    const handleClose = () => {
      closeNewProviderModal()
      refetchConnectorList()
    }

    return (
      <Dialog
        onClose={handleClose}
        isOpen={true}
        style={{
          width: 'auto',
          minWidth: 1175,
          height: 640,
          borderLeft: 0,
          paddingBottom: 0,
          position: 'relative',
          overflow: 'auto'
        }}
        enforceFocus={false}
      >
        <NewProviderModal onClose={handleClose} />
      </Dialog>
    )
  })

  return (
    <div className={css.main}>
      <div className={css.header}>
        <Breadcrumbs
          links={[
            {
              label: project?.name || '',
              url: routes.toProjectOverview({ orgIdentifier, projectIdentifier, accountId, module })
            },
            {
              label: 'GitOps',
              url: ''
            }
          ]}
        />
        <div className="ng-tooltip-native">
          <h2 data-tooltip-id={textIdentifier}>{getString('cd.gitOps')}</h2>
          <HarnessDocTooltip tooltipId={textIdentifier} useStandAlone={true} />
        </div>
      </div>

      <Layout.Horizontal flex className={css.addProviderHeader}>
        <Layout.Horizontal spacing="small">
          <RbacButton
            intent="primary"
            text={getString('cd.newProvider')}
            icon="plus"
            permission={{
              permission: PermissionIdentifier.CREATE_PROJECT, // change to ADD_NEW_PROVIDER
              resource: {
                resourceType: ResourceType.ACCOUNT,
                resourceIdentifier: projectIdentifier
              }
            }}
            onClick={addNewProdiverModal}
            id="newProviderBtn"
            data-test="newProviderButton"
            withoutBoxShadow
          />
        </Layout.Horizontal>

        <Layout.Horizontal margin={{ left: 'small' }}>
          <Container className={css.expandSearch} margin={{ right: 'small' }} data-name="providerSeachContainer">
            <ExpandingSearchInput
              placeholder={getString('search')}
              throttle={200}
              onChange={() => {
                // Need to pass the changed text to the function
                // Will update once the changes are ready
                searchProvider()
              }}
            />
          </Container>
        </Layout.Horizontal>
      </Layout.Horizontal>

      <ProvidersGridView onDelete={refetchConnectorList} providers={providers} loading={loading || loadingConnectors} />
    </div>
  )
}

export default GitOpsModalContainer
