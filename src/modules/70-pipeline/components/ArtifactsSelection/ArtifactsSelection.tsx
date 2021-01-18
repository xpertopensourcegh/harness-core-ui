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

import get from 'lodash-es/get'
import set from 'lodash-es/set'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { Scope } from '@common/interfaces/SecretsInterface'
import CreateDockerConnector from '@pipeline/components/connectors/DockerConnector/CreateDockerConnector'
import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import ExistingDockerArtifact from './DockerArtifact/ExistingDockerArtifact'
import { getStageIndexFromPipeline, getPrevoiusStageFromIndex } from '../PipelineStudio/StageBuilder/StageBuilderUtil'

import i18n from './ArtifactsSelection.i18n'
import css from './ArtifactsSelection.module.scss'

interface ArtifactTable {
  [key: string]: string
}

const artifactListHeaders: ArtifactTable = {
  type: i18n.artifactTable.type,
  server: i18n.artifactTable.server,
  source: i18n.artifactTable.artifactSource,
  imagePath: i18n.artifactTable.imagePath
}

enum TagTypes {
  Value = 'value',
  Regex = 'regex'
}

export type CreationType = 'DOCKER'
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
    updatePipeline
  } = React.useContext(PipelineContext)

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
            return artifact.overrideSet.artifacts['sidecars']
          }
        }
      )
      .filter((x: { overrideSet: { identifier: string; artifacts: [] } }) => x !== undefined)[0]
  }

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')

  const getArtifactsPath = (): any => {
    if (isForOverrideSets) {
      return get(stage, 'stage.spec.serviceConfig.serviceDefinition.spec.artifactOverrideSets', [])
    }
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getPrevoiusStageFromIndex(pipeline)
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
      const { stages } = getPrevoiusStageFromIndex(pipeline)
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
      const { stages } = getPrevoiusStageFromIndex(pipeline)
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

  const addArtifact = (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
    tagType?: string
  }): void => {
    if (context === ModalViewFor.PRIMARY) {
      if (isPropagating) {
        artifacts['primary'] = {
          type: primaryArtifactType,
          spec: {
            connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
            imagePath: data.imagePath,
            tag: data.tagType === TagTypes.Value ? data.tag : '',
            tagRegex: data.tagType === TagTypes.Regex ? data.tagRegex : ''
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
                  type: primaryArtifactType,
                  identifier: data.identifier,
                  spec: {
                    connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
                    imagePath: data.imagePath,
                    tag: data.tagType === TagTypes.Value ? data.tag : '',
                    tagRegex: data.tagType === TagTypes.Regex ? data.tagRegex : ''
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
          type: primaryArtifactType,
          spec: {
            connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
            imagePath: data.imagePath,
            tag: data.tagType === TagTypes.Value ? data.tag : '',
            tagRegex: data.tagType === TagTypes.Regex ? data.tagRegex : ''
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
        }
      } = {
        type: primaryArtifactType,
        identifier: data.identifier as string,
        spec: {
          connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
          imagePath: data.imagePath,
          tag: data.tagType === TagTypes.Value ? data.tag : '',
          tagRegex: data.tagType === TagTypes.Regex ? data.tagRegex : ''
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
        sideCarArtifact.push({ sidecar: sideCarObject })
      }
    }

    updatePipeline(pipeline)
    setView(ModalView.OPTIONS)
    hideConnectorModal()
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
                onChange={() => setView(ModalView.EXISTING)}
                selected={undefined}
                className={css.optionsViewGrid}
                data={[{ type: 'DOCKER' }]}
                renderItem={(item: OrganizationCreationType) => (
                  <Container>
                    {item.type === 'DOCKER' && (
                      <CardBody.Icon icon={'service-dockerhub'} iconSize={26}>
                        <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                          {i18n.dockerIconLabel}
                        </Text>
                      </CardBody.Icon>
                    )}
                  </Container>
                )}
              />
            </Layout.Horizontal>
          </Container>
        )}

        {view === ModalView.EXISTING && (
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
        )}

        {view === ModalView.NEW && (
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
          />
        )}
      </Dialog>
    ),
    [view, context]
  )

  const isValidScopeValue = (value: string): number => {
    if (value) {
      return value.indexOf(Scope.ACCOUNT) && value.indexOf(Scope.PROJECT) && value.indexOf(Scope.ORG)
    }
    return 0
  }

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
      connectorId:
        isValidScopeValue(spec?.connectorRef) === 0
          ? {
              label: spec?.connectorRef?.split('.')[1],
              scope: spec?.connectorRef?.split('.')[0],
              value: spec?.connectorRef
            }
          : spec?.connectorRef,
      imagePath: spec.imagePath,
      tagType: spec.tag ? TagTypes.Value : TagTypes.Regex,
      tag: spec.tag,
      tagRegex: spec.tagRegex
    }

    return initialValues
  }

  const addPrimaryArtifact = (): void => {
    setModalContext(ModalViewFor.PRIMARY)
    showConnectorModal()
  }

  const addSideCarArtifact = (): void => {
    setModalContext(ModalViewFor.SIDECAR)

    showConnectorModal()
  }

  const editPrimary = (): void => {
    setModalContext(ModalViewFor.PRIMARY)
    setView(ModalView.EXISTING)
    showConnectorModal()
  }

  const editSidecar = (index: number): void => {
    setModalContext(ModalViewFor.SIDECAR)
    setView(ModalView.EXISTING)
    setEditIndex(index)
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

  return (
    <Layout.Vertical
      padding={!isForOverrideSets ? 'large' : 'none'}
      style={{ background: !isForOverrideSets ? 'var(--grey-100)' : '' }}
    >
      {isForPredefinedSets && <PredefinedOverrideSets context="ARTIFACT" currentStage={stage} />}
      {overrideSetIdentifier.length === 0 && !isForOverrideSets && (
        <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      )}

      <Layout.Vertical spacing="small">
        {(primaryArtifact || (sideCarArtifact && sideCarArtifact.length > 0)) && (
          <Container>
            <section className={css.thead}>
              <span>{artifactListHeaders.type}</span>
              <span>{artifactListHeaders.server}</span>
              <span></span>
              <span>{artifactListHeaders.source}</span>
              <span>{artifactListHeaders.imagePath}</span>
              <span></span>
            </section>
          </Container>
        )}
        <Layout.Vertical spacing="medium">
          <section>
            {primaryArtifact && (
              <section className={cx(css.thead, css.rowItem)} key={primaryArtifactType}>
                <Text width={200} className={css.type} lineClamp={1}>
                  {i18n.primaryLabel}
                </Text>
                <span className={css.server}>
                  <Text
                    inline
                    icon={'service-dockerhub'}
                    iconProps={{ size: 18 }}
                    width={200}
                    lineClamp={1}
                    style={{ color: Color.BLACK, fontWeight: 900 }}
                  >
                    {primaryArtifact.type}
                  </Text>
                </span>
                <span>
                  <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                </span>
                <span>
                  <Text width={470} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {primaryArtifact?.spec?.connectorRef}
                  </Text>
                </span>
                <span>
                  <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {primaryArtifact?.spec?.imagePath}
                  </Text>
                </span>
                {overrideSetIdentifier.length === 0 && (
                  <span>
                    <Layout.Horizontal spacing="medium">
                      <Icon name="edit" size={14} style={{ cursor: 'pointer' }} onClick={editPrimary} />
                      <Icon name="delete" size={14} style={{ cursor: 'pointer' }} onClick={removePrimary} />
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
                  return (
                    <section className={cx(css.thead, css.rowItem)} key={sidecar?.identifier + index}>
                      <Text width={200} lineClamp={1} className={css.type}>
                        {i18n.sidecarLabel}
                      </Text>
                      <span className={css.server}>
                        <Text
                          inline
                          icon={'service-dockerhub'}
                          iconProps={{ size: 18 }}
                          width={470}
                          lineClamp={1}
                          style={{ color: Color.BLACK, fontWeight: 900 }}
                        >
                          {sidecar.type}
                        </Text>
                      </span>
                      <span>
                        <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                      </span>
                      <span>
                        <Text width={480} lineClamp={1} style={{ color: Color.GREY_500 }}>
                          {sidecar.spec.connectorRef}
                        </Text>
                      </span>

                      <span>
                        <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                          {sidecar.spec.imagePath}
                        </Text>
                      </span>
                      {overrideSetIdentifier.length === 0 && (
                        <span>
                          <Layout.Horizontal spacing="medium">
                            <Icon
                              name="edit"
                              size={14}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                editSidecar(index)
                              }}
                            />
                            <Icon
                              name="delete"
                              size={14}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                removeSidecar(index)
                              }}
                            />
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
            <Text intent="primary" style={{ cursor: 'pointer' }} onClick={addSideCarArtifact}>
              {i18n.addSideCarLable}
            </Text>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
      <Layout.Vertical spacing="medium">
        {!primaryArtifact && overrideSetIdentifier.length === 0 && (
          <Container className={css.rowItem}>
            <Text onClick={addPrimaryArtifact}>{i18n.addPrimarySourceLable}</Text>
          </Container>
        )}
        {(!sideCarArtifact || sideCarArtifact?.length === 0) && overrideSetIdentifier.length === 0 && (
          <Container className={css.rowItem}>
            <Text onClick={addSideCarArtifact}>{i18n.addSideCarLable}</Text>
          </Container>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
