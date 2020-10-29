import React from 'react'
import {
  Layout,
  Text,
  Container,
  Icon,
  Color,
  useModalHook,
  Button,
  Heading,
  CardSelect,
  Formik,
  FormInput,
  FormikForm as Form
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import cx from 'classnames'

import { get } from 'lodash-es'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { FormMultiTypeConnectorField } from '@common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { Scope } from '@common/interfaces/SecretsInterface'
import CreateDockerConnector from '../connectors/DockerConnector/CreateDockerConnector'
import ExistingDockerArtifact from './DockerArtifact/ExistingDockerArtifact'
import { PredefinedOverrideSets } from '../PredefinedOverrideSets/PredefinedOverrideSets'

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

export type CreationType = 'DOCKER'
export interface OrganizationCreationType {
  type: CreationType
}

export default function ArtifactsSelection({
  isForOverrideSets,
  identifierName,
  isForPredefinedSets
}: {
  isForOverrideSets: boolean
  isForPredefinedSets?: boolean
  identifierName?: string
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
      return get(stage, 'stage.spec.service.serviceDefinition.spec.artifactOverrideSets', [])
    }
    if (isForPredefinedSets) {
      return get(stage, 'stage.spec.service.stageOverrides.artifacts', [])
    }
    return get(stage, 'stage.spec.service.serviceDefinition.spec.artifacts', null)
  }

  const getPrimaryArtifactPath = (): any => {
    if (isForOverrideSets) {
      return getPrimaryArtifactByIdentifier()
    }
    if (isForPredefinedSets) {
      return get(stage, 'stage.spec.service.stageOverrides.artifacts.primary', null)
    }
    return get(stage, 'stage.spec.service.serviceDefinition.spec.artifacts.primary', null)
  }

  const getSidecarPath = (): any => {
    if (isForOverrideSets) {
      return getSidecarArtifactByIdentifier()
    }
    if (isForPredefinedSets) {
      return get(stage, 'stage.spec.service.stageOverrides.artifacts.sidecars', [])
    }
    return get(stage, 'stage.spec.service.serviceDefinition.spec.artifacts.sidecars', [])
  }

  const artifacts = getArtifactsPath()

  const primaryArtifact = getPrimaryArtifactPath()

  const primaryArtifactType = 'Dockerhub'

  // const sideCarArtifact = get(stage, 'stage.spec.service.serviceDefinition.spec.artifacts.sidecars', [])

  const sideCarArtifact = getSidecarPath()

  const DIALOG_PROPS: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: false,
    canOutsideClickClose: false,
    enforceFocus: true,
    title: '',
    style: { width: 1000, height: 580, borderLeft: 'none', paddingBottom: 0, position: 'relative' }
  }

  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const ModalView = { OPTIONS: 1, EXISTING: 2, NEW: 3 }
  const ModalViewFor = { PRIMARY: 1, SIDECAR: 2 }

  const [view, setView] = React.useState(ModalView.OPTIONS)
  const [context, setModalContext] = React.useState(ModalViewFor.PRIMARY)
  const [editContext, setEditModeContext] = React.useState(ModalViewFor.PRIMARY)
  const [sidecarIndex, setEditIndex] = React.useState(0)

  const addArtifact = (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
  }): void => {
    if (context === ModalViewFor.PRIMARY) {
      if (isForOverrideSets) {
        artifacts.map(
          (artifact: { overrideSet: { identifier: string; artifacts: { primary: object; sidecars?: [] } } }) => {
            if (artifact?.overrideSet?.identifier === identifierName) {
              const sideCars = artifact?.overrideSet.artifacts.sidecars
              artifact.overrideSet.artifacts = {
                primary: {
                  type: primaryArtifactType,
                  spec: {
                    connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
                    imagePath: data.imagePath
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
            imagePath: data.imagePath
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
        }
      } = {
        type: primaryArtifactType,
        identifier: data.identifier as string,
        spec: {
          connectorRef: data.connectorId?.value ? data.connectorId.value : data.connectorId,
          imagePath: data.imagePath
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
            <Heading level={2} color={Color.WHITE} style={{ fontSize: '30px' }}>
              {i18n.modalHeading}
            </Heading>
            <Heading level={3} font="small" color={Color.WHITE} margin={{ top: 'large', bottom: 'medium' }}>
              {i18n.modalSubHeading}
            </Heading>
            <Layout.Horizontal spacing="large">
              <CardSelect<OrganizationCreationType>
                onChange={() => setView(ModalView.EXISTING)}
                selected={undefined}
                className={css.optionsViewGrid}
                data={[{ type: 'DOCKER' }]}
                renderItem={(item: OrganizationCreationType) => (
                  <Container>{item.type === 'DOCKER' && <Icon name="service-dockerhub" size={35} />}</Container>
                )}
              />
            </Layout.Horizontal>
          </Container>
        )}

        {view === ModalView.EXISTING && (
          <ExistingDockerArtifact
            handleSubmit={(data: { connectorId: undefined | { value: string }; imagePath: string }) => {
              addArtifact(data)
            }}
            handleViewChange={() => setView(ModalView.NEW)}
            context={context}
          />
        )}
        {view === ModalView.NEW && (
          <CreateDockerConnector
            handleSubmit={(data: { connectorId: { value: string }; imagePath: string }) => {
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
    return value.indexOf(Scope.ACCOUNT) && value.indexOf(Scope.PROJECT) && value.indexOf(Scope.ORG)
  }

  const getInitialValues = (
    primaryArtifactParam: { spec: { connectorRef: string; imagePath: string } },
    sideCarArtifactParam: any
  ) => {
    let spec
    if (editContext === ModalViewFor.PRIMARY) {
      spec = primaryArtifactParam?.spec
    } else {
      spec = sideCarArtifactParam[sidecarIndex]?.sidecar.spec
    }
    const initialValues = {
      connectorId:
        isValidScopeValue(spec?.connectorRef) === 0
          ? {
              label: spec?.connectorRef?.split('.')[1],
              scope: spec?.connectorRef?.split('.')[0],
              value: spec?.connectorRef
            }
          : spec?.connectorRef,
      imagePath: spec.imagePath
    }

    return initialValues
  }

  const resetFormValues = (): object => {
    return { connectorId: undefined, imagePath: '' }
  }

  const updateArtifact = (value: { imagePath: string; connectorId: { value: string } }): void => {
    if (editContext === ModalViewFor.PRIMARY) {
      primaryArtifact.spec.imagePath = value.imagePath
      primaryArtifact.spec.connectorRef = value.connectorId.value ? value.connectorId.value : value.connectorId
    } else {
      sideCarArtifact[sidecarIndex].sidecar.spec.imagePath = value.imagePath
      sideCarArtifact[sidecarIndex].sidecar.spec.connectorRef = value.connectorId.value
        ? value.connectorId.value
        : value.connectorId
    }

    updatePipeline(pipeline)
  }

  const [showEditConnectorModal, hideEditConnectorModal] = useModalHook(
    () => (
      <Dialog
        onClose={() => {
          resetFormValues()
          setEditModeContext(ModalViewFor.PRIMARY)
          hideEditConnectorModal()
        }}
        {...DIALOG_PROPS}
        style={{ width: 600, height: 300, borderLeft: 'none', paddingBottom: 0, position: 'relative' }}
        className={Classes.DIALOG}
      >
        <Layout.Vertical spacing="large" padding="xlarge" className={css.editForm}>
          <Text style={{ color: 'var(--black)' }}>{i18n.existingDocker.editModalTitle}</Text>
          <Formik
            validationSchema={Yup.object().shape({
              connectorId: Yup.string().trim().required(i18n.validation.connectorId),
              imagePath: Yup.string().trim().required(i18n.validation.imagePath)
            })}
            initialValues={getInitialValues(primaryArtifact, sideCarArtifact)}
            onSubmit={values => {
              updateArtifact(values)
              hideEditConnectorModal()
            }}
          >
            {() => (
              <Form>
                <div>
                  <FormMultiTypeConnectorField
                    name="connectorId"
                    label={i18n.existingDocker.connectorLabel}
                    placeholder={i18n.existingDocker.connectorPlaceholder}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    width={350}
                    isNewConnectorLabelVisible={false}
                    type={'DockerRegistry'}
                  />
                  <FormInput.MultiTextInput
                    label={i18n.existingDocker.imageName}
                    name="imagePath"
                    style={{ width: 350 }}
                    placeholder={i18n.existingDocker.imageNamePlaceholder}
                  />
                </div>
                <Button intent="primary" type="submit" text={i18n.existingDocker.submit} />
              </Form>
            )}
          </Formik>
        </Layout.Vertical>
      </Dialog>
    ),
    [primaryArtifact, sideCarArtifact, editContext, sidecarIndex]
  )

  const addPrimaryArtifact = (): void => {
    setModalContext(ModalViewFor.PRIMARY)
    showConnectorModal()
  }

  const addSideCarArtifact = (): void => {
    setModalContext(ModalViewFor.SIDECAR)
    showConnectorModal()
  }

  const editPrimary = (): void => {
    setEditModeContext(ModalViewFor.PRIMARY)
    showEditConnectorModal()
  }

  const editSidecar = (index: number): void => {
    setEditModeContext(ModalViewFor.SIDECAR)
    setEditIndex(index)
    showEditConnectorModal()
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
      {!isForOverrideSets && <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>}

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
                <span className={css.type}>{i18n.primaryLabel}</span>
                <span className={css.server}>
                  <Text
                    inline
                    icon={'service-dockerhub'}
                    iconProps={{ size: 18 }}
                    width={200}
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
                <span>
                  <Layout.Horizontal spacing="medium">
                    <Icon name="edit" size={14} style={{ cursor: 'pointer' }} onClick={editPrimary} />
                    <Icon name="delete" size={14} style={{ cursor: 'pointer' }} onClick={removePrimary} />
                  </Layout.Horizontal>
                </span>
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
                      <span className={css.type}>{i18n.sidecarLabel}</span>
                      <span className={css.server}>
                        <Text
                          inline
                          icon={'service-dockerhub'}
                          iconProps={{ size: 18 }}
                          width={470}
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
                      <span>
                        <Layout.Horizontal spacing="medium">
                          <Icon
                            name="edit"
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => editSidecar(index)}
                          />
                          <Icon
                            name="delete"
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeSidecar(index)}
                          />
                        </Layout.Horizontal>
                      </span>
                    </section>
                  )
                }
              )}
            </section>
          )}
          {sideCarArtifact && sideCarArtifact.length > 0 && (
            <Text intent="primary" style={{ cursor: 'pointer' }} onClick={addSideCarArtifact}>
              {i18n.addSideCarLable}
            </Text>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
      <Layout.Vertical spacing="medium">
        {!primaryArtifact && (
          <Container className={css.rowItem}>
            <Text onClick={addPrimaryArtifact}>{i18n.addPrimarySourceLable}</Text>
          </Container>
        )}
        {(!sideCarArtifact || sideCarArtifact?.length === 0) && (
          <Container className={css.rowItem}>
            <Text onClick={addSideCarArtifact}>{i18n.addSideCarLable}</Text>
          </Container>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
