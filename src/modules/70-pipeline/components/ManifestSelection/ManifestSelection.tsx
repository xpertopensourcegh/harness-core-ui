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
  FormikForm as Form,
  MultiTypeInputType
} from '@wings-software/uicore'
import { FieldArray, FieldArrayRenderProps } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import cx from 'classnames'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { get, set } from 'lodash-es'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import { getStageFromPipeline } from '@pipeline/exports'
import { PipelineContext } from '@pipeline/exports'
import CreateGitConnector from '@pipeline/components/connectors/GitConnector/CreateGitConnector'

import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import { useStrings, String } from 'framework/exports'
import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import { ManifestWizard } from './ManifestWizardSteps/ManifestWizard'
import { getStageIndexFromPipeline, getPrevoiusStageFromIndex } from '../PipelineStudio/StageBuilder/StageBuilderUtil'
import i18n from './ManifestSelection.i18n'
import css from './ManifestSelection.module.scss'
interface ManifestTable {
  [key: string]: string
}

export type CreationType = 'KUBERNETES' | 'VALUES'

const artifactListHeaders: ManifestTable = {
  type: i18n.manifestTable.type,
  server: i18n.manifestTable.server,
  location: i18n.manifestTable.location,
  branch: i18n.manifestTable.branch,
  commit: i18n.manifestTable.commit,
  id: i18n.manifestTable.id
}

const manifestTypeLabels: Record<string, string> = {
  K8sManifest: 'Kubernetes Manifest',
  Values: 'Values Overrides'
}

const manifestTypeLabel: { [key: string]: string } = {
  KUBERNETES: 'K8s Manifest',
  VALUES: 'Values Override'
}

export interface ManifestCreationType {
  type: CreationType
}

const gitFetchTypes = [
  { label: i18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: i18n.gitFetchTypes[1].label, value: 'Commit' }
]
let selectedManifestReference: { spec: { store: { spec: {} } } } | undefined
function ManifestListView({
  identifier,
  manifestList,
  pipeline,
  updatePipeline,
  identifierName,
  isForOverrideSets,
  stage,
  isForPredefinedSets,
  isPropagating,
  overrideSetIdentifier
}: {
  identifier: string
  pipeline: NgPipeline
  isForOverrideSets: boolean
  manifestList: {}[] | undefined
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets: boolean
  isPropagating?: boolean
  overrideSetIdentifier?: string
}): JSX.Element {
  const ModalView = { OPTIONS: 1, KUBERNETES: 2, VALUES: 3 }
  const ModalContext = { EXISTING: 0, NEW: 1 }

  const [view, setView] = React.useState(ModalView.OPTIONS)
  const [modalContext, setModalContext] = React.useState(ModalContext.EXISTING)

  const DIALOG_PROPS: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: false,
    canOutsideClickClose: false,
    enforceFocus: true,
    title: '',
    style: { width: 1175, minHeight: 640, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { getString } = useStrings()
  const [showConnectorModal, hideConnectorModal] = useModalHook(
    () => (
      <Dialog
        onClose={() => {
          setView(ModalView.OPTIONS)
          setModalContext(ModalContext.EXISTING)
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
              <CardSelect<ManifestCreationType>
                onChange={selected => {
                  if (selected.type === 'KUBERNETES') {
                    setView(ModalView.KUBERNETES)
                  } else {
                    setView(ModalView.VALUES)
                  }
                }}
                selected={undefined}
                className={css.optionsViewGrid}
                data={[{ type: 'KUBERNETES' }, { type: 'VALUES' }]}
                renderItem={(item: ManifestCreationType) => (
                  <>
                    <Container>
                      {(item.type === 'KUBERNETES' && <Icon name="service-kubernetes" size={35} />) ||
                        (item.type === 'VALUES' && <Icon name="functions" size={35} />)}
                    </Container>
                    <section style={{ marginTop: 'var(--spacing-small)' }}>{manifestTypeLabel[item.type]}</section>
                  </>
                )}
              />
            </Layout.Horizontal>
          </Container>
        )}

        {(view === ModalView.KUBERNETES || view === ModalView.VALUES) && modalContext === ModalContext.EXISTING && (
          <ManifestWizard
            closeModal={() => {
              setView(ModalView.OPTIONS)
              setModalContext(ModalContext.EXISTING)
              hideConnectorModal()
            }}
            identifier={identifier}
            pipeline={pipeline}
            isForOverrideSets={isForOverrideSets}
            isForPredefinedSets={isForPredefinedSets}
            isPropagating={isPropagating}
            identifierName={identifierName}
            stage={stage}
            view={view}
            handleViewChange={() => setModalContext(ModalContext.NEW)}
            updatePipeline={updatePipeline}
          />
        )}
        {modalContext === ModalContext.NEW && (
          <CreateGitConnector
            accountId={accountId}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
            onSuccess={() => {
              // handle success
            }}
            isForOverrideSets={isForOverrideSets}
            isForPredefinedSets={isForPredefinedSets}
            identifierName={identifierName}
            stage={stage}
            pipeline={pipeline}
            updatePipeline={updatePipeline}
            view={view}
            hideLightModal={hideConnectorModal}
          />
        )}
      </Dialog>
    ),
    [view, modalContext]
  )
  const getManifestList = React.useCallback(() => {
    if (overrideSetIdentifier && overrideSetIdentifier.length) {
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      const { stages } = getPrevoiusStageFromIndex(pipeline)
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

  const editManifest = (manifest: {
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
  }): void => {
    selectedManifestReference = undefined
    selectedManifestReference = manifest
    showEditConnectorModal()
  }

  const getManifestInitialValues = () => {
    const initValues = get(selectedManifestReference, 'spec.store.spec', null)
    initValues.connectorRef = initValues?.connectorRef || initValues?.connectorIdentifier
    if (initValues) {
      const values = {
        ...initValues,
        connectorRef: initValues?.connectorRef,
        paths:
          typeof initValues['paths'] === 'string'
            ? initValues['paths']
            : initValues['paths'].map((path: string) => ({ path, uuid: uuid(path, nameSpace()) }))
      }
      return values
    } else {
      return {}
    }
  }
  const onDragStart = React.useCallback((event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('data', index.toString())
    event.currentTarget.classList.add(css.dragging)
  }, [])
  const onDragEnd = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragging)
  }, [])

  const onDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragOver)
  }, [])

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    /* istanbul ignore else */
    if (event.preventDefault) {
      event.preventDefault()
    }
    event.currentTarget.classList.add(css.dragOver)
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, arrayHelpers: FieldArrayRenderProps, droppedIndex: number) => {
      /* istanbul ignore else */
      if (event.preventDefault) {
        event.preventDefault()
      }
      const data = event.dataTransfer.getData('data')
      /* istanbul ignore else */
      if (data) {
        const index = parseInt(data, 10)
        arrayHelpers.swap(index, droppedIndex)
      }
      event.currentTarget.classList.remove(css.dragOver)
    },
    []
  )
  const defaultValueToReset = [{ path: '', uuid: uuid('', nameSpace()) }]

  const [showEditConnectorModal, hideEditConnectorModal] = useModalHook(
    () => (
      <Dialog
        onClose={() => {
          // resetFormValues()
          selectedManifestReference = undefined
          // setEditModeContext(ModalViewFor.PRIMARY)
          hideEditConnectorModal()
        }}
        {...DIALOG_PROPS}
        style={{ width: 600, minHeight: 350, borderLeft: 'none', paddingBottom: 0, position: 'relative' }}
        className={Classes.DIALOG}
      >
        <Layout.Vertical spacing="large" padding="xlarge" className={css.editForm}>
          <Text style={{ color: 'var(--black)' }}>{i18n.existingManifest.editModalTitle}</Text>
          <Formik
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              connectorRef: Yup.string().trim().required(i18n.validation.connectorId)
            })}
            initialValues={getManifestInitialValues()}
            onSubmit={values => {
              const _updatedValues = {
                ...getManifestInitialValues(),
                ...values,
                connectorRef: values.connectorRef.value ? values.connectorRef.value : values.connectorRef,
                paths:
                  typeof values['paths'] === 'string'
                    ? values['paths']
                    : values['paths'].map((path: { path: string }) => path.path)
              }

              if (selectedManifestReference) selectedManifestReference['spec']['store']['spec'] = _updatedValues
              updatePipeline(pipeline)
              hideEditConnectorModal()
            }}
          >
            {formik => (
              <Form>
                <div>
                  <FormMultiTypeConnectorField
                    name="connectorRef"
                    label={i18n.existingManifest.connectorLabel}
                    placeholder={i18n.existingManifest.connectorPlaceholder}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    width={350}
                    isNewConnectorLabelVisible={false}
                    category={'CODE_REPO'}
                    enableConfigureOptions={false}
                  />
                </div>
                <FormInput.Select
                  name="gitFetchType"
                  label={i18n.existingManifest.gitFetchTypeLabel}
                  items={gitFetchTypes}
                />
                {formik.values?.gitFetchType === gitFetchTypes[0].value && (
                  <FormInput.MultiTextInput
                    label={i18n.existingManifest.branchLabel}
                    placeholder={i18n.existingManifest.branchPlaceholder}
                    name="branch"
                  />
                )}
                {formik.values?.gitFetchType === gitFetchTypes[1].value && (
                  <FormInput.MultiTextInput
                    label={i18n.existingManifest.commitLabel}
                    placeholder={i18n.existingManifest.commitPlaceholder}
                    name="commitId"
                  />
                )}

                <MultiTypeFieldSelector
                  defaultValueToReset={defaultValueToReset}
                  name={'paths'}
                  label={getString('fileFolderPathText')}
                  disableTypeSelection
                >
                  <Text
                    icon="info-sign"
                    className={css.fileHelpText}
                    iconProps={{ color: Color.BLUE_450, size: 23, padding: 'small' }}
                  >
                    <String tagName="div" stringID="multipleFilesHelpText" />
                  </Text>
                  <FieldArray
                    name="paths"
                    render={arrayHelpers => (
                      <Layout.Vertical>
                        {formik.values?.paths?.map((path: { uuid: string; path: string }, index: number) => (
                          <Layout.Horizontal
                            key={path.uuid}
                            flex={{ distribution: 'space-between' }}
                            style={{ alignItems: 'end' }}
                          >
                            <Layout.Horizontal
                              spacing="medium"
                              style={{ alignItems: 'baseline' }}
                              draggable={true}
                              onDragStart={event => {
                                onDragStart(event, index)
                              }}
                              data-testid={path.uuid}
                              onDragEnd={onDragEnd}
                              onDragOver={onDragOver}
                              onDragLeave={onDragLeave}
                              onDrop={event => onDrop(event, arrayHelpers, index)}
                            >
                              {formik.values?.paths?.length > 1 && (
                                <Icon name="drag-handle-vertical" className={css.drag} />
                              )}
                              {formik.values?.paths?.length > 1 && <Text>{`${index + 1}.`}</Text>}
                              <FormInput.MultiTextInput
                                name={`paths[${index}].path`}
                                style={{ width: '430px' }}
                                multiTextInputProps={{
                                  allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                                }}
                                label=""
                              />
                            </Layout.Horizontal>
                            {formik.values?.paths?.length > 1 && (
                              <Button minimal icon="minus" onClick={() => arrayHelpers.remove(index)} />
                            )}
                          </Layout.Horizontal>
                        ))}
                        <span>
                          <Button
                            minimal
                            text={getString('addFileText')}
                            intent="primary"
                            className={css.addFileButton}
                            onClick={() => arrayHelpers.push({ path: '', uuid: uuid('', nameSpace()) })}
                          />
                        </span>
                      </Layout.Vertical>
                    )}
                  />
                </MultiTypeFieldSelector>

                <Button intent="primary" type="submit" text={i18n.existingManifest.submit} />
              </Form>
            )}
          </Formik>
        </Layout.Vertical>
      </Dialog>
    ),
    [selectedManifestReference]
  )

  return (
    <Layout.Vertical spacing="small">
      {(!manifestList || manifestList.length === 0) && !overrideSetIdentifier && (
        <Container className={css.rowItem}>
          <Text
            onClick={() => {
              setView(ModalView.OPTIONS)
              showConnectorModal()
            }}
          >
            {i18n.addPrimarySourceLable}
          </Text>
        </Container>
      )}
      {listOfManifests && manifestList && manifestList.length > 0 && (
        <Container>
          <section className={cx(css.thead, isForOverrideSets && css.overrideSetRow)}>
            <span>{artifactListHeaders.type}</span>
            <span>{artifactListHeaders.server}</span>
            <span></span>
            <span>{artifactListHeaders.branch + '/' + artifactListHeaders.commit}</span>
            <span>{artifactListHeaders.location}</span>
            <span>{artifactListHeaders.id}</span>

            <span></span>
          </section>
        </Container>
      )}
      <Layout.Vertical spacing="medium">
        <section>
          {listOfManifests &&
            listOfManifests.map(
              (
                data: {
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
                },
                index: number
              ) => {
                const manifest = data['manifest']
                return (
                  <section
                    className={cx(css.thead, css.rowItem, isForOverrideSets && css.overrideSetRow)}
                    key={manifest.identifier + index}
                  >
                    <span className={css.type}>{manifestTypeLabels[manifest.type]}</span>
                    <span className={css.server}>
                      <Text
                        inline
                        icon={'service-github'}
                        iconProps={{ size: 18 }}
                        width={200}
                        style={{ color: Color.BLACK, fontWeight: 900 }}
                      >
                        {manifest.spec.store.type}
                      </Text>
                    </span>
                    <span>
                      <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                    </span>
                    <span>
                      <Text style={{ color: Color.GREY_500 }}>
                        {manifest.spec.store.spec.branch || manifest.spec.store.spec.commitId}
                      </Text>
                    </span>
                    <span>
                      <Text width={220} lineClamp={1} style={{ color: Color.GREY_500 }}>
                        {typeof manifest.spec.store.spec.paths === 'string'
                          ? manifest.spec.store.spec.paths
                          : manifest.spec.store.spec.paths[0]}
                      </Text>
                    </span>
                    <span>
                      <Text width={140} lineClamp={1} style={{ color: Color.GREY_500 }}>
                        {manifest.identifier}
                      </Text>
                    </span>
                    {!overrideSetIdentifier?.length && (
                      <span>
                        <Layout.Horizontal spacing="medium">
                          <Icon
                            name="edit"
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => editManifest(manifest)}
                          />
                          <Icon
                            name="delete"
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeManifestConfig(index)}
                          />
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
            onClick={() => showConnectorModal()}
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
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  const identifier = selectedStageId || 'stage-identifier'
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

  return (
    <Layout.Vertical
      padding={!isForOverrideSets ? 'large' : 'none'}
      style={{ background: !isForOverrideSets ? 'var(--grey-100)' : '' }}
    >
      {isForPredefinedSets && <PredefinedOverrideSets context="MANIFEST" currentStage={stage} />}
      {overrideSetIdentifier?.length === 0 && !isForOverrideSets && (
        <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      )}

      <ManifestListView
        identifier={identifier}
        manifestList={listOfManifests}
        isPropagating={isPropagating}
        pipeline={pipeline}
        updatePipeline={updatePipeline}
        stage={stage}
        isForOverrideSets={isForOverrideSets}
        identifierName={identifierName}
        isForPredefinedSets={isForPredefinedSets}
        overrideSetIdentifier={overrideSetIdentifier}
      />
    </Layout.Vertical>
  )
}
