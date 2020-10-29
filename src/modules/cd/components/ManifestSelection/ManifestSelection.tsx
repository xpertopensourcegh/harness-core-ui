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
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { get } from 'lodash-es'
import { FormMultiTypeConnectorField } from '@common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'
import { getStageFromPipeline } from '@pipeline/exports'
import { PipelineContext } from '@pipeline/exports'
import CreateGitConnector from '../connectors/GitConnector/CreateGitConnector'

import { ManifestWizard } from './ManifestWizardSteps/ManifestWizard'
import { PredefinedOverrideSets } from '../PredefinedOverrideSets/PredefinedOverrideSets'
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
  isForPredefinedSets
}: {
  identifier: string
  pipeline: NgPipeline
  isForOverrideSets: boolean
  manifestList: {}[] | undefined
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets: boolean
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
    style: { width: 1000, height: 580, borderLeft: 'none', paddingBottom: 0, position: 'relative' }
  }

  const { accountId, projectIdentifier, orgIdentifier } = useParams()

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

  let listOfManifests = !isForOverrideSets
    ? !isForPredefinedSets
      ? get(stage, 'stage.spec.service.serviceDefinition.spec.manifests', [])
      : get(stage, 'stage.spec.service.stageOverrides.manifests', [])
    : get(stage, 'stage.spec.service.serviceDefinition.spec.manifestOverrideSets', [])

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

  const isValidScopeValue = (value: string): number => {
    return value.indexOf(Scope.ACCOUNT) && value.indexOf(Scope.PROJECT) && value.indexOf(Scope.ORG)
  }

  const getManifestInitialValues = () => {
    const initValues = get(selectedManifestReference, 'spec.store.spec', null)
    if (initValues) {
      const values = {
        ...initValues,
        connectorRef:
          isValidScopeValue(initValues?.connectorRef) === 0
            ? {
                label: initValues?.connectorRef?.split('.')[1],
                scope: initValues?.connectorRef?.split('.')[0],
                value: initValues?.connectorRef
              }
            : initValues?.connectorRef,
        paths: initValues['paths'][0]
      }
      return values
    } else {
      return {}
    }
  }

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
        style={{ width: 600, height: 350, borderLeft: 'none', paddingBottom: 0, position: 'relative' }}
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
                paths: [values['paths']]
              }

              if (selectedManifestReference) selectedManifestReference['spec']['store']['spec'] = _updatedValues
              updatePipeline(pipeline)
              hideEditConnectorModal()
            }}
          >
            {() => (
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
                    type={'Git'}
                  />
                </div>
                {getManifestInitialValues().gitFetchType === gitFetchTypes[0].value && (
                  <FormInput.MultiTextInput
                    label={i18n.existingManifest.branchLabel}
                    placeholder={i18n.existingManifest.branchPlaceholder}
                    name="branch"
                  />
                )}
                {getManifestInitialValues().gitFetchType === gitFetchTypes[1].value && (
                  <FormInput.MultiTextInput
                    label={i18n.existingManifest.commitLabel}
                    placeholder={i18n.existingManifest.commitPlaceholder}
                    name="commitId"
                  />
                )}
                <FormInput.MultiTextInput
                  label={i18n.existingManifest.filePath}
                  placeholder={i18n.existingManifest.filePathPlaceholder}
                  name="paths"
                />
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
      {(!manifestList || manifestList.length === 0) && (
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
                      <Text width={280} lineClamp={1} style={{ color: Color.GREY_500 }}>
                        {manifest.spec.store.spec.paths[0]}
                      </Text>
                    </span>
                    <span>
                      <Text width={140} lineClamp={1} style={{ color: Color.GREY_500 }}>
                        {manifest.identifier}
                      </Text>
                    </span>
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
                  </section>
                )
              }
            )}
        </section>

        {manifestList && manifestList.length > 0 && (
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
  isForPredefinedSets = false
}: {
  isForOverrideSets: boolean
  identifierName?: string
  isForPredefinedSets: boolean
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

  let listOfManifests = !isForOverrideSets
    ? !isForPredefinedSets
      ? get(stage, 'stage.spec.service.serviceDefinition.spec.manifests', [])
      : get(stage, 'stage.spec.service.stageOverrides.manifests', [])
    : get(stage, 'stage.spec.service.serviceDefinition.spec.manifestOverrideSets', [])

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
      {!isForOverrideSets && <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>}

      <ManifestListView
        identifier={identifier}
        manifestList={listOfManifests}
        pipeline={pipeline}
        updatePipeline={updatePipeline}
        stage={stage}
        isForOverrideSets={isForOverrideSets}
        identifierName={identifierName}
        isForPredefinedSets={isForPredefinedSets}
      />
    </Layout.Vertical>
  )
}
