import React from 'react'
import {
  Layout,
  Text,
  Container,
  Icon,
  Color,
  useModalHook,
  Heading,
  CardSelect,
  CardBody,
  RUNTIME_INPUT_VALUE
} from '@wings-software/uicore'
import cx from 'classnames'
import { useParams } from 'react-router-dom'

import get from 'lodash-es/get'
import set from 'lodash-es/set'

import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { useStrings, String } from 'framework/exports'
import { useGetConnectorListV2, PageConnectorResponse } from 'services/cd-ng'
import { PipelineContext } from '@pipeline/exports'
import { getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'

import CreateDockerConnector from '@pipeline/components/connectors/DockerConnector/CreateDockerConnector'
import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { getIdentifierFromValue, getScopeFromValue } from '@common/components/EntityReference/EntityReference'
import ExistingDockerArtifact from './DockerArtifact/ExistingDockerArtifact'
import ExistingGCRArtifact from './ExistingGCRArtifact/ExistingGCRArtifact'
import {
  getStageIndexFromPipeline,
  getFlattenedStages,
  getStatus
} from '../PipelineStudio/StageBuilder/StageBuilderUtil'

import CreateGCRConnector from '../connectors/GcrConnector/CreateGCRConnector'

import i18n from './ArtifactsSelection.i18n'
import css from './ArtifactsSelection.module.scss'

enum TagTypes {
  Value = 'value',
  Regex = 'regex'
}
const ENABLED_ARTIFACT_TYPES: { [key: string]: OrganizationCreationType } = {
  DOCKER: { type: 'Dockerhub' },
  GCR: { type: 'Gcr' }
}
export type CreationType = 'Dockerhub' | 'Gcr'
export interface OrganizationCreationType {
  type: CreationType
}

export default function ArtifactsSelection({
  isForOverrideSets,
  identifierName,
  isForPredefinedSets,
  isPropagating,
  overrideSetIdentifier = ''
}: {
  isForOverrideSets: boolean
  isForPredefinedSets?: boolean
  identifierName?: string
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
  const { getString } = useStrings()
  const [selectedArtifactType, setSelectedArtifactType] = React.useState<CreationType>(
    ENABLED_ARTIFACT_TYPES.DOCKER.type
  )
  const getPrimaryArtifactByIdentifier = (): void => {
    return artifacts
      .map((artifact: { overrideSet: { identifier: string; artifacts: { primary: object } } }) => {
        if (artifact?.overrideSet?.identifier === identifierName) {
          return artifact.overrideSet.artifacts['primary']
        }
      })
      .filter((x: { overrideSet: { identifier: string; artifacts: [] } }) => x !== undefined)[0]
  }

  const getSidecarArtifactByIdentifier = (): void => {
    return artifacts
      .map(
        (artifact: {
          overrideSet: { identifier: string; artifacts: { sidecars: [{ sidecar: object }]; primary: object } }
        }) => {
          if (artifact?.overrideSet?.identifier === identifierName) {
            if (!artifact?.overrideSet?.artifacts?.['sidecars']) {
              set(artifact, 'overrideSet.artifacts.sidecars', [])
            }
            return artifact.overrideSet.artifacts['sidecars']
          }
        }
      )
      .filter((x: { overrideSet: { identifier: string; artifacts: [] } }) => x !== undefined)[0]
  }

  const { stage } = getStageFromPipeline(selectedStageId || '')

  const getArtifactsPath = (): any => {
    if (isForOverrideSets) {
      return get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifactOverrideSets', [])
    }
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getFlattenedStages(pipeline)
      const overrideSets = get(
        stages[index],
        'stage.spec.serviceConfig.serviceDefinition.spec.artifactOverrideSets',
        []
      )

      return overrideSets
    }
    if (isForPredefinedSets || isPropagating) {
      return get(stage, 'stage.spec.serviceConfig.stageOverrides.artifacts', [])
    }
    return get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifacts', {})
  }

  const getPrimaryArtifactPath = (): any => {
    if (isForOverrideSets) {
      return getPrimaryArtifactByIdentifier()
    }
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getFlattenedStages(pipeline)
      const overrideSets = get(
        stages[index],
        'stage.spec.serviceConfig.serviceDefinition.spec.artifactOverrideSets',
        []
      )

      const selectedOverrideSet = overrideSets.find(
        ({ overrideSet }: { overrideSet: { identifier: string } }) => overrideSet.identifier === overrideSetIdentifier
      )

      return get(selectedOverrideSet, 'overrideSet.artifacts.primary', null)
    }
    if (isForPredefinedSets || isPropagating) {
      return get(stage, 'stage.spec.serviceConfig.stageOverrides.artifacts.primary', null)
    }
    return get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifacts.primary', null)
  }

  const getSidecarPath = (): any => {
    if (isForOverrideSets) {
      return getSidecarArtifactByIdentifier()
    }
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getFlattenedStages(pipeline)
      const overrideSets = get(
        stages[index],
        'stage.spec.serviceConfig.serviceDefinition.spec.artifactOverrideSets',
        []
      )

      const selectedOverrideSet = overrideSets.find(
        ({ overrideSet }: { overrideSet: { identifier: string } }) => overrideSet.identifier === overrideSetIdentifier
      )

      return get(selectedOverrideSet, 'overrideSet.artifacts.sidecars', [])
    }
    if (isForPredefinedSets || isPropagating) {
      return get(stage, 'stage.spec.serviceConfig.stageOverrides.artifacts.sidecars', [])
    }
    if (!get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifacts.sidecars', null)) {
      set(stage as {}, 'stage.spec.serviceConfig.serviceDefinition.spec.artifacts.sidecars', [])
    } else return get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifacts.sidecars', [])
  }

  const artifacts = getArtifactsPath() || {}

  const primaryArtifact = getPrimaryArtifactPath()

  const primaryArtifactType = 'Dockerhub'

  const sideCarArtifact = getSidecarPath()

  const DIALOG_PROPS: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: false,
    canOutsideClickClose: false,
    enforceFocus: true,
    title: '',
    style: { width: 1050, height: 580, borderLeft: 'none', paddingBottom: 0, position: 'relative' }
  }

  const ModalView = { OPTIONS: 1, EXISTING: 2, NEW: 3 }
  const ModalViewFor = { PRIMARY: 1, SIDECAR: 2 }

  const [view, setView] = React.useState(ModalView.OPTIONS)
  const [context, setModalContext] = React.useState(ModalViewFor.PRIMARY)
  const [sidecarIndex, setEditIndex] = React.useState(0)
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

  const connectorScopeIdentifierList = primaryArtifact
    ? [
        {
          scope: getScopeFromValue(primaryArtifact?.spec?.connectorRef),
          identifier: getIdentifierFromValue(primaryArtifact?.spec?.connectorRef)
        }
      ]
    : []

  const sideCarArtifacts =
    sideCarArtifact && sideCarArtifact.length
      ? sideCarArtifact &&
        sideCarArtifact.map(
          (data: {
            sidecar: {
              type: string
              identifier: string
              spec: {
                connectorRef: string
                imagePath: string
              }
            }
          }) => ({
            scope: getScopeFromValue(data?.sidecar?.spec?.connectorRef),
            identifier: getIdentifierFromValue(data?.sidecar?.spec?.connectorRef)
          })
        )
      : []

  connectorScopeIdentifierList.join(...sideCarArtifacts)

  const connectorIdentifiers = connectorScopeIdentifierList.map(item => item.identifier)

  const refetchConnectorList = async () => {
    const { data: connectorResponse } = await fetchConnectors({ filterType: 'Connector', connectorIdentifiers })
    setFetchedConnectorResponse(connectorResponse)
  }

  React.useEffect(() => {
    refetchConnectorList()
  }, [primaryArtifact, sideCarArtifact])

  const addArtifact = (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
    tagType?: string
    registryHostname?: string
  }): void => {
    const tagData =
      data.tagType === TagTypes.Value
        ? { tag: data.tag }
        : data.tagType === TagTypes.Regex
        ? { tagRegex: data.tagRegex }
        : { tag: '' }
    const registryHostData =
      selectedArtifactType === ENABLED_ARTIFACT_TYPES.GCR.type ? { registryHostname: data.registryHostname } : {}
    if (context === ModalViewFor.PRIMARY) {
      if (isPropagating) {
        artifacts['primary'] = {
          type: primaryArtifactType,
          spec: {
            connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
            imagePath: data.imagePath,
            ...tagData,
            ...registryHostData
          }
        }
      }
      if (isForOverrideSets) {
        artifacts.map(
          (artifact: { overrideSet: { identifier: string; artifacts: { primary: object; sidecars?: [] } } }) => {
            if (artifact?.overrideSet?.identifier === identifierName) {
              const sideCars = artifact?.overrideSet.artifacts.sidecars
              artifact.overrideSet.artifacts = {
                primary: {
                  type: selectedArtifactType,
                  identifier: data.identifier,
                  spec: {
                    connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
                    imagePath: data.imagePath,
                    ...tagData,
                    ...(selectedArtifactType === ENABLED_ARTIFACT_TYPES.GCR.type
                      ? { registryHostname: data.registryHostname }
                      : {})
                  }
                }
              }
              if (sideCars) {
                artifact.overrideSet.artifacts['sidecars'] = sideCars
              }
            }
          }
        )
      } else {
        artifacts['primary'] = {
          type: selectedArtifactType,
          spec: {
            connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
            imagePath: data.imagePath,
            ...tagData,
            ...registryHostData
          }
        }
      }
    } else {
      const sideCarObject: {
        type: string
        identifier: string
        spec: {
          connectorRef: string | undefined | { value: string }
          imagePath: string
          tag?: string
          tagRegex?: string
          registryHostname?: string
        }
      } = {
        type: selectedArtifactType,
        identifier: data.identifier as string,
        spec: {
          connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
          imagePath: data.imagePath,
          ...tagData,
          ...registryHostData
        }
      }

      if (isForOverrideSets) {
        artifacts.map(
          (artifact: {
            overrideSet: { identifier: string; artifacts: { sidecars: [{ sidecar: object }]; primary: object } }
          }) => {
            if (artifact?.overrideSet?.identifier === identifierName) {
              if (artifact.overrideSet.artifacts['sidecars']) {
                artifact.overrideSet.artifacts['sidecars'].push({ sidecar: sideCarObject })
              } else {
                const primary = artifact.overrideSet.artifacts?.primary || null

                artifact.overrideSet.artifacts = {
                  primary: primary,
                  sidecars: [{ sidecar: sideCarObject }]
                }
              }
            }
          }
        )
      } else {
        if (view === ModalView.EXISTING) {
          sideCarArtifact.splice(sidecarIndex, 1, { sidecar: sideCarObject })
        } else {
          sideCarArtifact.push({ sidecar: sideCarObject })
        }
      }
    }

    updatePipeline(pipeline)
    setView(ModalView.OPTIONS)
    hideConnectorModal()
  }
  const renderExistingArtifact = () => {
    if (view !== ModalView.EXISTING) return null
    switch (selectedArtifactType) {
      case ENABLED_ARTIFACT_TYPES.DOCKER.type:
        return (
          <ExistingDockerArtifact
            handleSubmit={(data: {
              connectorId: undefined | { value: string }
              imagePath: string
              tag?: string
              tagRegex?: string
            }) => {
              addArtifact(data)
            }}
            handleViewChange={() => setView(ModalView.NEW)}
            context={context}
            initialValues={getInitialValues(primaryArtifact, sideCarArtifact)}
          />
        )
      case ENABLED_ARTIFACT_TYPES.GCR.type:
        return (
          <ExistingGCRArtifact
            handleSubmit={(data: {
              connectorId: undefined | { value: string }
              imagePath: string
              tag?: string
              tagRegex?: string
            }) => {
              addArtifact(data)
            }}
            handleViewChange={() => setView(ModalView.NEW)}
            context={context}
            initialValues={getInitialValues(primaryArtifact, sideCarArtifact)}
          />
        )
      default:
        return null
    }
  }

  const renderNewConnector = () => {
    if (view !== ModalView.NEW) return null
    switch (selectedArtifactType) {
      case ENABLED_ARTIFACT_TYPES.DOCKER.type:
        return (
          <CreateDockerConnector
            handleSubmit={(data: {
              connectorId: undefined | { value: string }
              imagePath: string
              tag?: string
              tagRegex?: string
            }) => {
              addArtifact(data)
            }}
            hideLightModal={hideConnectorModal}
            context={context}
            accountId={accountId}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
          />
        )
      case ENABLED_ARTIFACT_TYPES.GCR.type:
        return (
          <CreateGCRConnector
            handleSubmit={(data: {
              connectorId: undefined | { value: string }
              imagePath: string
              tag?: string
              tagRegex?: string
            }) => {
              addArtifact(data)
            }}
            hideLightModal={hideConnectorModal}
            context={context}
          />
        )
      default:
        return null
    }
  }

  const handleOptionSelection = (selected: OrganizationCreationType) => {
    setView(ModalView.EXISTING)
    setSelectedArtifactType(selected.type)
  }
  const [showConnectorModal, hideConnectorModal] = useModalHook(
    () => (
      <Dialog
        onClose={() => {
          setView(ModalView.OPTIONS)
          setModalContext(ModalViewFor.PRIMARY)
          hideConnectorModal()
        }}
        {...DIALOG_PROPS}
        className={cx(css.modal, view !== ModalView.OPTIONS ? Classes.DIALOG : Classes.DARK)}
      >
        {view === ModalView.OPTIONS && (
          <Container className={css.optionsViewContainer}>
            <Heading level={2} color={Color.WHITE} style={{ fontSize: '30px' }} margin={{ bottom: 'medium' }}>
              {i18n.modalHeading}
            </Heading>

            <Layout.Horizontal spacing="large">
              <CardSelect<OrganizationCreationType>
                onChange={handleOptionSelection}
                selected={undefined}
                className={css.optionsViewGrid}
                data={Object.values(ENABLED_ARTIFACT_TYPES)}
                renderItem={(item: OrganizationCreationType) => (
                  <Container>
                    {item.type === ENABLED_ARTIFACT_TYPES.DOCKER.type && (
                      <CardBody.Icon icon={'service-dockerhub'} iconSize={26}>
                        <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                          {i18n.dockerIconLabel}
                        </Text>
                      </CardBody.Icon>
                    )}
                    {item.type === ENABLED_ARTIFACT_TYPES.GCR.type && (
                      <CardBody.Icon icon={'service-gcp'} iconSize={26}>
                        <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                          {getString('connectors.GCR.name')}
                        </Text>
                      </CardBody.Icon>
                    )}
                  </Container>
                )}
              />
            </Layout.Horizontal>
          </Container>
        )}
        {renderExistingArtifact()}
        {renderNewConnector()}
      </Dialog>
    ),
    [view, context]
  )

  const getInitialValues = (
    primaryArtifactParam: {
      spec: { connectorRef: string; imagePath: string; tag: string; tagRegex: string }
    },
    sideCarArtifactParam: any
  ) => {
    let spec
    if (context === ModalViewFor.PRIMARY) {
      spec = primaryArtifactParam?.spec
    } else {
      spec = sideCarArtifactParam[sidecarIndex]?.sidecar.spec
    }
    if (!spec) {
      return {
        connectorId: undefined,
        identifier: '',
        imagePath: '',
        tag: RUNTIME_INPUT_VALUE,
        tagType: TagTypes.Value,
        tagRegex: ''
      }
    }
    const initialValues = {
      identifier: sideCarArtifactParam[sidecarIndex]?.sidecar.identifier,
      connectorId: spec?.connectorRef,
      imagePath: spec.imagePath,
      tagType: spec.tag ? TagTypes.Value : TagTypes.Regex,
      tag: spec.tag,
      tagRegex: spec.tagRegex,
      ...(selectedArtifactType === ENABLED_ARTIFACT_TYPES.GCR.type ? { registryHostname: spec.registryHostname } : {})
    }

    return initialValues
  }

  const addPrimaryArtifact = (): void => {
    setModalContext(ModalViewFor.PRIMARY)
    showConnectorModal()
  }

  const addSideCarArtifact = (): void => {
    const newSidecarIndex = sideCarArtifact?.length ? sideCarArtifact?.length + 1 : 0
    setModalContext(ModalViewFor.SIDECAR)
    setView(ModalView.OPTIONS)
    setEditIndex(newSidecarIndex)
    showConnectorModal()
  }

  const editPrimary = (type: CreationType): void => {
    setModalContext(ModalViewFor.PRIMARY)
    setView(ModalView.EXISTING)
    setSelectedArtifactType(type)
    showConnectorModal()
  }

  const editSidecar = (index: number, type: CreationType): void => {
    setModalContext(ModalViewFor.SIDECAR)
    setView(ModalView.EXISTING)
    setEditIndex(index)
    setSelectedArtifactType(type)
    showConnectorModal()
  }

  const removePrimary = (): void => {
    if (isForOverrideSets) {
      artifacts.map(
        (artifact: { overrideSet: { identifier: string; artifacts: { primary: object | null; sidecars: [] } } }) => {
          if (artifact?.overrideSet?.identifier === identifierName) {
            artifact.overrideSet.artifacts['primary'] = null
          }
        }
      )
    } else {
      artifacts['primary'] = null
    }
    updatePipeline(pipeline)
  }

  const removeSidecar = (index: number): void => {
    sideCarArtifact.splice(index, 1)
    updatePipeline(pipeline)
  }

  const { color } = getStatus(primaryArtifact?.spec?.connectorRef, fetchedConnectorResponse, accountId)

  return (
    <Layout.Vertical>
      {isForPredefinedSets && <PredefinedOverrideSets context="ARTIFACT" currentStage={stage} />}

      <Layout.Vertical spacing="small">
        <div className={cx(css.artifactList, css.listHeader)}>
          <span></span>
          <span>{getString('artifactRepository')}</span>
          <span> {getString('location')}</span>
          <span></span>
          <span></span>
        </div>

        <Layout.Vertical>
          <section>
            {primaryArtifact && (
              <section className={cx(css.artifactList, css.rowItem)} key={primaryArtifactType}>
                <div>
                  <Text width={200} className={css.type} color={Color.BLACK} lineClamp={1}>
                    Primary
                  </Text>
                </div>

                <div className={css.server}>
                  <Text
                    inline
                    icon={getConnectorIconByType(primaryArtifact.type)}
                    iconProps={{ size: 18 }}
                    width={180}
                    lineClamp={1}
                    style={{ color: Color.BLACK, fontWeight: 900 }}
                  >
                    {primaryArtifact.type}
                  </Text>

                  <Text width={200} icon="full-circle" iconProps={{ size: 10, color }} />
                </div>
                <div>
                  <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {primaryArtifact?.spec?.imagePath}
                  </Text>
                </div>
                <div>{/* WIP artifact validation */}</div>
                {overrideSetIdentifier.length === 0 && (
                  <span>
                    <Layout.Horizontal spacing="medium" className={css.actionGrid}>
                      <Icon name="Edit" size={16} onClick={() => editPrimary(primaryArtifact.type)} />
                      {/* <Icon
                            name="main-clone"
                            size={16}
                            style={{ cursor: 'pointer' }}
                            className={css.cloneIcon}
                            // onClick={() => cloneArtifact(manifest)}
                          /> */}
                      <Icon name="bin-main" size={25} onClick={removePrimary} />
                    </Layout.Horizontal>
                  </span>
                )}
              </section>
            )}
          </section>
          {sideCarArtifact && sideCarArtifact.length > 0 && (
            <section>
              {sideCarArtifact.map(
                (
                  data: {
                    sidecar: {
                      type: string
                      identifier: string
                      spec: {
                        connectorRef: string
                        imagePath: string
                      }
                    }
                  },
                  index: number
                ) => {
                  const { sidecar } = data
                  const { color: sideCarConnectionColor } = getStatus(
                    sidecar?.spec?.connectorRef,
                    fetchedConnectorResponse,
                    accountId
                  )
                  return (
                    <section className={cx(css.artifactList, css.rowItem)} key={sidecar?.identifier + index}>
                      <div>
                        <Text width={200} className={css.type} color={Color.BLACK} lineClamp={1}>
                          {getString('sidecar')}
                          <Text lineClamp={1} className={css.artifactId}>
                            ({getString('cf.targets.ID')}: {sidecar.identifier})
                          </Text>
                        </Text>
                      </div>
                      <div className={css.server}>
                        <Text
                          inline
                          icon={getConnectorIconByType(sidecar.type)}
                          iconProps={{ size: 18 }}
                          width={180}
                          lineClamp={1}
                          style={{ color: Color.BLACK, fontWeight: 900 }}
                        >
                          {sidecar.type}
                        </Text>

                        <Text width={200} icon="full-circle" iconProps={{ size: 10, color: sideCarConnectionColor }} />
                      </div>
                      <div>
                        <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                          {sidecar?.spec?.imagePath}
                        </Text>
                      </div>
                      <div>{/* WIP artifact validation */}</div>
                      {overrideSetIdentifier.length === 0 && (
                        <span>
                          <Layout.Horizontal spacing="medium" className={css.actionGrid}>
                            <Icon
                              name="Edit"
                              size={16}
                              onClick={() => {
                                editSidecar(index, sidecar.type as CreationType)
                              }}
                            />
                            {/* <Icon
                                  name="main-clone"
                                  size={16}
                                  style={{ cursor: 'pointer' }}
                                  className={css.cloneIcon}
                                  // onClick={() => cloneArtifact(manifest)}
                                /> */}
                            <Icon name="bin-main" size={25} onClick={() => removeSidecar(index)} />
                          </Layout.Horizontal>
                        </span>
                      )}
                    </section>
                  )
                }
              )}
            </section>
          )}
          {sideCarArtifact && sideCarArtifact.length > 0 && overrideSetIdentifier.length === 0 && (
            <div className={css.paddingVertical}>
              <Text intent="primary" style={{ cursor: 'pointer' }} onClick={addSideCarArtifact}>
                <String stringID="pipelineSteps.serviceTab.artifactList.addSidecar" />
              </Text>
            </div>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
      <Layout.Vertical>
        {!primaryArtifact && overrideSetIdentifier.length === 0 && (
          <div className={css.rowItem}>
            <Text onClick={addPrimaryArtifact}>
              <String stringID="pipelineSteps.serviceTab.artifactList.addPrimary" />
            </Text>
          </div>
        )}
        {(!sideCarArtifact || sideCarArtifact?.length === 0) && overrideSetIdentifier.length === 0 && (
          <div className={css.rowItem}>
            <Text onClick={addSideCarArtifact}>
              <String stringID="pipelineSteps.serviceTab.artifactList.addSidecar" />
            </Text>
          </div>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
