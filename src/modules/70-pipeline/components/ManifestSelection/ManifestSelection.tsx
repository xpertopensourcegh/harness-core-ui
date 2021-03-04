import React from 'react'
import {
  Layout,
  Text,
  Icon,
  Color,
  useModalHook,
  IconName,
  StepWizard,
  StepProps,
  Button
} from '@wings-software/uicore'

import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { get, set } from 'lodash-es'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import { useGetConnectorListV2, PageConnectorResponse, ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import { PipelineContext } from '@pipeline/exports'

import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import { useStrings, String } from 'framework/exports'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { getIdentifierFromValue, getScopeFromValue } from '@common/components/EntityReference/EntityReference'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import GitDetailsStep from '@connectors/components/CreateConnector/commonSteps/GitDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import StepGitAuthentication from '@connectors/components/CreateConnector/GitConnector/StepAuth/StepGitAuthentication'
import { Connectors } from '@connectors/constants'
import { getIconByType } from '@connectors/exports'
import { ManifestWizard } from './ManifestWizard/ManifestWizard'
import {
  getStageIndexFromPipeline,
  getFlattenedStages,
  getStatus
} from '../PipelineStudio/StageBuilder/StageBuilderUtil'
import i18n from './ManifestSelection.i18n'
import { manifestTypeText } from './Manifesthelper'
import ManifestDetails from './ManifestWizardSteps/ManifestDetails'
import type { ConnectorRefLabelType } from '../ArtifactsSelection/ArtifactInterface'
import css from './ManifestSelection.module.scss'

interface PathDataType {
  path: string
  uuid: string
}
export interface ManifestDataType {
  identifier: string
  branch: string | undefined
  commitId: string | undefined
  connectorRef: string | undefined
  gitFetchType: 'Branch' | 'Commit'
  paths: Array<PathDataType> | Array<string> | undefined
  store: ConnectorInfoDTO['type'] | string
}
export type ManifestTypes = 'K8sManifest' | 'Values'

const allowedManifestTypes: Array<ManifestTypes> = ['K8sManifest', 'Values']
const manifestStoreTypes: Array<ConnectorInfoDTO['type']> = [
  Connectors.GIT,
  Connectors.GITHUB,
  Connectors.GITLAB,
  Connectors.BITBUCKET
]

const manifestTypeIcons: Record<string, IconName> = {
  K8sManifest: 'file',
  Values: 'config-file'
}

function ManifestListView({
  manifestList,
  pipeline,
  updatePipeline,
  identifierName,
  isForOverrideSets,
  stage,
  isForPredefinedSets,
  isPropagating,
  overrideSetIdentifier,
  connectors
}: {
  pipeline: NgPipeline
  isForOverrideSets: boolean
  manifestList: {}[] | undefined
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets: boolean
  isPropagating?: boolean
  overrideSetIdentifier?: string
  connectors: PageConnectorResponse | undefined
}): JSX.Element {
  const [selectedManifest, setSelectedManifest] = React.useState(allowedManifestTypes[0])
  const [connectorView, setConnectorView] = React.useState(false)
  const [manifestStore, setManifestStore] = React.useState(Connectors.GIT)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [manifestIndex, setEditIndex] = React.useState(0)

  const DIALOG_PROPS: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: false,
    canOutsideClickClose: false,
    enforceFocus: true,
    style: { width: 1175, minHeight: 640, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { getString } = useStrings()

  const getManifestList = React.useCallback(() => {
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getFlattenedStages(pipeline)
      const overrideSets = get(
        stages[index],
        'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets',
        []
      )

      const selectedOverrideSet = overrideSets.find(
        ({ overrideSet }: { overrideSet: { identifier: string } }) => overrideSet.identifier === overrideSetIdentifier
      )

      return get(selectedOverrideSet, 'overrideSet.manifests', [])
    }
    if (isPropagating) {
      return get(stage, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
    }
    if (!get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets')) {
      set(stage as {}, 'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets', [])
    }
    if (!get(stage, 'stage.spec.serviceConfig.stageOverrides.manifests')) {
      set(stage as {}, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
    }
    if (!get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifests')) {
      set(stage as {}, 'stage.spec.serviceConfig.serviceDefinition.spec.manifests', [])
    }
    return !isForOverrideSets
      ? !isForPredefinedSets
        ? get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifests', [])
        : get(stage, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
      : get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets', [])
  }, [isForOverrideSets, isPropagating, isForPredefinedSets, overrideSetIdentifier])

  let listOfManifests = getManifestList()

  if (isForOverrideSets) {
    listOfManifests = listOfManifests
      .map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
        if (overrideSets?.overrideSet?.identifier === identifierName) {
          return overrideSets.overrideSet.manifests
        }
      })
      .filter((x: { overrideSet: { identifier: string; manifests: [{}] } }) => x !== undefined)[0]
  }

  const removeManifestConfig = (index: number): void => {
    listOfManifests.splice(index, 1)
    updatePipeline(pipeline)
  }

  const addNewManifest = (): void => {
    setEditIndex(listOfManifests.length)
    showConnectorModal()
  }

  const editManifest = (
    manifest: {
      identifier: string
      type: ManifestTypes
      spec: {
        store: {
          type: string
          spec: {
            connectorRef: string
            gitFetchType: string
            branch: string
            commitId: string
            paths: string[]
          }
        }
      }
    },
    index: number
  ): void => {
    setSelectedManifest(manifest.type)
    setConnectorView(false)
    setEditIndex(index)
    showConnectorModal()
  }

  const getManifestInitialValues = (): ManifestDataType => {
    const initValues = get(listOfManifests[manifestIndex], 'manifest.spec.store.spec', null)

    if (initValues) {
      const values = {
        ...initValues,
        identifier: listOfManifests[manifestIndex]?.manifest.identifier,
        store: listOfManifests[manifestIndex]?.manifest.spec?.store?.type,
        connectorRef: initValues?.connectorRef,
        paths:
          typeof initValues['paths'] === 'string'
            ? initValues['paths']
            : initValues['paths'].map((path: string) => ({ path, uuid: uuid(path, nameSpace()) }))
      }
      return values
    }
    return {
      identifier: '',
      store: Connectors.GIT,
      branch: undefined,
      commitId: undefined,
      connectorRef: undefined,
      gitFetchType: 'Branch',
      paths: [{ path: '', uuid: uuid('', nameSpace()) }]
    }
  }

  const handleSubmit = (formData: any) => {
    const manifestObj = {
      manifest: {
        identifier: formData.identifier,
        type: selectedManifest,
        spec: {
          store: {
            type: formData?.store,
            spec: {
              connectorRef: formData?.connectorRef,
              gitFetchType: formData?.gitFetchType,
              branch: formData?.branch,
              commitId: formData?.commitId,
              paths:
                typeof formData?.paths === 'string'
                  ? formData?.paths
                  : formData?.paths.map((path: { path: string }) => path.path)
            }
          }
        }
      }
    }

    if (isPropagating) {
      if (listOfManifests?.length > 0) {
        listOfManifests.splice(manifestIndex, 1, manifestObj)
      } else {
        listOfManifests.push(manifestObj)
      }
      updatePipeline(pipeline)
      hideConnectorModal()
      return
    }
    if (!isForOverrideSets) {
      if (listOfManifests?.length > 0) {
        listOfManifests.splice(manifestIndex, 1, manifestObj)
      } else {
        listOfManifests.push(manifestObj)
      }
    } else {
      listOfManifests.map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
        if (overrideSets.overrideSet.identifier === identifierName) {
          overrideSets.overrideSet.manifests.push(manifestObj)
        }
      })
    }

    updatePipeline(pipeline)
    hideConnectorModal()
  }

  const changeManifestType = (selected: ManifestTypes): void => {
    setSelectedManifest(selected)
  }

  const handleViewChange = (isConnectorView: boolean, store: ConnectorInfoDTO['type']): void => {
    setConnectorView(isConnectorView)
    setManifestStore(store)
  }

  const getLabels = (): ConnectorRefLabelType => {
    return {
      firstStepName: getString('manifestType.specifyManifestRepoType'),
      secondStepName: getString('manifestType.specifyManifestStore'),
      newConnector: getString('newConnector')
    }
  }

  const getLastSteps = (): Array<React.ReactElement<StepProps<ConnectorConfigDTO>>> => {
    const arr: Array<React.ReactElement<StepProps<ConnectorConfigDTO>>> = []

    const manifestDetailStep = (
      <ManifestDetails
        name={getString('manifestType.manifestDetails')}
        key={getString('manifestType.manifestDetails')}
        stepName={getString('manifestType.manifestDetails')}
        initialValues={getManifestInitialValues()}
        handleSubmit={handleSubmit}
      />
    )

    arr.push(manifestDetailStep)
    return arr
  }

  const getNewConnectorSteps = (): JSX.Element => {
    return (
      <StepWizard title={getString('connectors.createNewConnector')}>
        <ConnectorDetailsStep type={manifestStore} name={getString('overview')} isEditMode={isEditMode} />
        <GitDetailsStep
          type={manifestStore}
          name={getString('details')}
          isEditMode={isEditMode}
          connectorInfo={undefined}
        />
        <StepGitAuthentication
          name={getString('credentials')}
          onConnectorCreated={() => {
            // Handle on success
          }}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          connectorInfo={undefined}
          accountId={accountId}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          connectorIdentifier={''}
          setIsEditMode={() => setIsEditMode(true)}
          isStep={true}
          isLastStep={false}
          type={manifestStore}
        />
      </StepWizard>
    )
  }

  const [showConnectorModal, hideConnectorModal] = useModalHook(() => {
    const onClose = (): void => {
      setConnectorView(false)
      hideConnectorModal()
    }
    return (
      <Dialog onClose={onClose} {...DIALOG_PROPS} className={cx(css.modal, Classes.DIALOG)}>
        <div className={css.createConnectorWizard}>
          <ManifestWizard
            types={allowedManifestTypes}
            manifestStoreTypes={manifestStoreTypes}
            labels={getLabels()}
            selectedManifest={selectedManifest}
            newConnectorView={connectorView}
            changeManifestType={changeManifestType}
            handleViewChange={handleViewChange}
            initialValues={getManifestInitialValues()}
            newConnectorSteps={getNewConnectorSteps()}
            lastSteps={getLastSteps()}
          />
        </div>
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={onClose} className={css.crossIcon} />
      </Dialog>
    )
  }, [selectedManifest, connectorView, manifestIndex])

  return (
    <Layout.Vertical spacing="small">
      <div className={cx(css.manifestList, css.listHeader)}>
        <span>{getString('cf.targets.ID')}</span>
        <span>{getString('pipelineSteps.serviceTab.manifestList.manifestFormat')}</span>
        <span>{getString('pipelineSteps.serviceTab.manifestList.manifestStore')}</span>
        <span>{getString('location')}</span>

        <span></span>
      </div>
      {(!manifestList || manifestList.length === 0) && !overrideSetIdentifier && (
        <div className={css.rowItem}>
          <Text
            onClick={() => {
              showConnectorModal()
            }}
          >
            <String stringID="pipelineSteps.serviceTab.manifestList.addManifest" />
          </Text>
        </div>
      )}
      <Layout.Vertical spacing="medium">
        <section>
          {listOfManifests &&
            listOfManifests.map(
              (
                data: {
                  manifest: {
                    identifier: string
                    type: ManifestTypes
                    spec: {
                      store: {
                        type: string
                        spec: {
                          connectorRef: string
                          gitFetchType: string
                          branch: string
                          commitId: string
                          paths: string[]
                        }
                      }
                    }
                  }
                },
                index: number
              ) => {
                const manifest = data['manifest']

                const { color } = getStatus(manifest?.spec?.store?.spec?.connectorRef, connectors, accountId)

                return (
                  <section className={cx(css.manifestList, css.rowItem)} key={manifest.identifier + index}>
                    <div className={css.columnId}>
                      <Icon inline name={manifestTypeIcons[manifest.type]} size={20} />
                      <Text inline width={150} className={css.type} color={Color.BLACK} lineClamp={1}>
                        {manifest.identifier}
                      </Text>
                    </div>
                    <div>{manifestTypeText[manifest.type]}</div>
                    <div className={css.server}>
                      <Text
                        inline
                        icon={getIconByType(manifest.spec.store.type as ConnectorInfoDTO['type'])}
                        iconProps={{ size: 18 }}
                        width={130}
                        lineClamp={1}
                        style={{ color: Color.BLACK, fontWeight: 900 }}
                      >
                        {manifest.spec.store.type}
                      </Text>

                      <Text width={200} icon="full-circle" iconProps={{ size: 10, color }} />
                    </div>

                    <span>
                      <Text width={220} lineClamp={1} style={{ color: Color.GREY_500 }}>
                        {typeof manifest.spec.store.spec.paths === 'string'
                          ? manifest.spec.store.spec.paths
                          : manifest.spec.store.spec.paths[0]}
                      </Text>
                    </span>

                    {!overrideSetIdentifier?.length && (
                      <span className={css.lastColumn}>
                        <Layout.Horizontal spacing="medium" className={css.actionGrid}>
                          <Icon name="Edit" size={16} onClick={() => editManifest(manifest, index)} />
                          {/* <Icon
                            name="main-clone"
                            size={16}
                            style={{ cursor: 'pointer' }}
                            className={css.cloneIcon}
                            // onClick={() => editManifest(manifest)}
                          /> */}
                          <Icon name="bin-main" size={25} onClick={() => removeManifestConfig(index)} />
                        </Layout.Horizontal>
                      </span>
                    )}
                  </section>
                )
              }
            )}
        </section>

        {manifestList && manifestList.length > 0 && !overrideSetIdentifier?.length && (
          <Text
            intent="primary"
            style={{ cursor: 'pointer', marginBottom: 'var(--spacing-medium)' }}
            onClick={() => addNewManifest()}
          >
            {i18n.addFileLabel}
          </Text>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function ManifestSelection({
  isForOverrideSets,
  identifierName,
  isForPredefinedSets = false,
  isPropagating,
  overrideSetIdentifier
}: {
  isForOverrideSets: boolean
  identifierName?: string
  isForPredefinedSets: boolean
  isPropagating?: boolean
  overrideSetIdentifier?: string
}): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    getStageFromPipeline,
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(selectedStageId || '')
  const getManifestList = React.useCallback(() => {
    if (isPropagating) {
      return get(stage, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
    }
    return !isForOverrideSets
      ? !isForPredefinedSets
        ? get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifests', [])
        : get(stage, 'stage.spec.serviceConfig.stageOverrides.manifests', [])
      : get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.manifestOverrideSets', [])
  }, [isForOverrideSets, isPropagating, isForPredefinedSets])

  let listOfManifests = getManifestList()
  if (isForOverrideSets) {
    listOfManifests = listOfManifests
      .map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
        if (overrideSets.overrideSet.identifier === identifierName) {
          return overrideSets.overrideSet.manifests
        }
      })
      .filter((x: { overrideSet: { identifier: string; manifests: [{}] } }) => x !== undefined)[0]
  }

  const [fetchedConnectorResponse, setFetchedConnectorResponse] = React.useState<PageConnectorResponse | undefined>()

  const { accountId, orgIdentifier, projectIdentifier } = useParams<
    PipelineType<{
      orgIdentifier: string
      projectIdentifier: string
      accountId: string
    }>
  >()
  const defaultQueryParams = {
    pageIndex: 0,
    pageSize: 10,
    searchTerm: '',
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier,
    includeAllConnectorsAvailableAtScope: true
  }
  const { mutate: fetchConnectors } = useGetConnectorListV2({
    queryParams: defaultQueryParams
  })

  const connectorList = listOfManifests
    ? listOfManifests &&
      listOfManifests.map(
        (data: {
          manifest: {
            identifier: string
            type: string
            spec: {
              store: {
                type: string
                spec: {
                  connectorRef: string
                  gitFetchType: string
                  branch: string
                  commitId: string
                  paths: string[]
                }
              }
            }
          }
        }) => ({
          scope: getScopeFromValue(data?.manifest?.spec?.store?.spec?.connectorRef),
          identifier: getIdentifierFromValue(data?.manifest?.spec?.store?.spec?.connectorRef)
        })
      )
    : []

  const connectorIdentifiers = connectorList.map((item: { scope: string; identifier: string }) => item.identifier)

  const refetchConnectorList = async (): Promise<void> => {
    const { data: connectorResponse } = await fetchConnectors({ filterType: 'Connector', connectorIdentifiers })
    setFetchedConnectorResponse(connectorResponse)
  }

  React.useEffect(() => {
    refetchConnectorList()
  }, [listOfManifests])

  return (
    <Layout.Vertical>
      {isForPredefinedSets && <PredefinedOverrideSets context="MANIFEST" currentStage={stage} />}
      {overrideSetIdentifier?.length === 0 && !isForOverrideSets && (
        <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      )}

      <ManifestListView
        manifestList={listOfManifests}
        isPropagating={isPropagating}
        pipeline={pipeline}
        updatePipeline={updatePipeline}
        stage={stage}
        isForOverrideSets={isForOverrideSets}
        identifierName={identifierName}
        isForPredefinedSets={isForPredefinedSets}
        overrideSetIdentifier={overrideSetIdentifier}
        connectors={fetchedConnectorResponse}
      />
    </Layout.Vertical>
  )
}
