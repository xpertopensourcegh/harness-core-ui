import React from 'react'
import { Layout, Text, Container, Icon, Color, useModalHook, Button } from '@wings-software/uikit'
import cx from 'classnames'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { get } from 'lodash'

import type { StageElementWrapper, CDPipeline } from 'services/cd-ng'
import { getStageFromPipeline } from 'modules/cd/pages/pipelines/StageBuilder/StageBuilderUtil'
import { PipelineContext } from '../../pages/pipelines/PipelineContext/PipelineContext'
import { ManifestWizard } from './ManifestWizardSteps/ManifestWizard'
import i18n from './ManifestSelection.i18n'
import css from './ManifestSelection.module.scss'

interface ManifestTable {
  [key: string]: string
}

const artifactListHeaders: ManifestTable = {
  type: i18n.manifestTable.type,
  server: i18n.manifestTable.server,
  location: i18n.manifestTable.location,
  branch: i18n.manifestTable.branch,
  id: i18n.manifestTable.id
}

const manifestTypeLabels: Record<string, string> = {
  K8sManifest: 'Kubernetes Manifest',
  Values: 'Values Overrides'
}

function AddManifestRender({
  identifier,
  isForOverrideSets,
  identifierName,
  pipeline,
  updatePipeline,
  stage
}: {
  identifier: string
  pipeline: object
  updatePipeline: object
  isForOverrideSets: boolean
  identifierName?: string
  stage: StageElementWrapper | undefined
}): JSX.Element {
  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 960, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const [openLightModal, hideLightModal] = useModalHook(() => (
    <Dialog {...modalPropsLight}>
      <ManifestWizard
        closeModal={hideLightModal}
        identifier={identifier}
        pipeline={pipeline}
        isForOverrideSets={isForOverrideSets}
        identifierName={identifierName}
        stage={stage}
        updatePipeline={updatePipeline}
      />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.rowItem}>
        <Text onClick={() => openLightModal()}>{i18n.addPrimarySourceLable}</Text>
      </Container>
    </Layout.Vertical>
  )
}

function ManifestListView({
  identifier,
  pipeline,
  updatePipeline,
  identifierName,
  isForOverrideSets,
  stage
}: {
  identifier: string
  pipeline: CDPipeline
  isForOverrideSets: boolean
  updatePipeline: (pipeline: CDPipeline) => Promise<void>
  identifierName?: string
  stage: StageElementWrapper | undefined
}): JSX.Element {
  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 960, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const [openLightModal, hideLightModal] = useModalHook(() => (
    <Dialog {...modalPropsLight}>
      <ManifestWizard
        closeModal={hideLightModal}
        identifier={identifier}
        stage={stage}
        isForOverrideSets={isForOverrideSets}
        identifierName={identifierName}
        pipeline={pipeline}
        updatePipeline={updatePipeline}
      />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

  let listOfManifests = !isForOverrideSets
    ? get(stage, 'stage.spec.service.serviceDef.spec.manifests', [])
    : get(stage, 'stage.spec.service.serviceDef.spec.manifestOverrideSets', [])

  if (isForOverrideSets) {
    listOfManifests = listOfManifests.map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
      if (overrideSets?.overrideSet?.identifier === identifierName) {
        return overrideSets.overrideSet.manifests
      }
    })[0]
  }

  const removeManifestConfig = (index: number): void => {
    listOfManifests.splice(index, 1)
    updatePipeline(pipeline)
  }

  return (
    <Layout.Vertical spacing="small">
      {listOfManifests && (
        <Container>
          <section className={cx(css.thead, isForOverrideSets && css.overrideSetRow)}>
            <span>{artifactListHeaders.type}</span>
            <span>{artifactListHeaders.server}</span>
            <span></span>
            <span>{artifactListHeaders.branch}</span>
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
                          connectorIdentifier: string
                          gitFetchType: string
                          branch: string
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
                      <Text style={{ color: Color.GREY_500 }}>{manifest.spec.store.spec.branch}</Text>
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
                        {/* <Icon name="main-edit" size={14} />
                    <Icon name="main-clone" size={14} /> */}
                        <Icon name="delete" size={14} onClick={() => removeManifestConfig(index)} />
                      </Layout.Horizontal>
                    </span>
                  </section>
                )
              }
            )}
        </section>

        <Text
          intent="primary"
          style={{ cursor: 'pointer', marginBottom: 'var(--spacing-medium)' }}
          onClick={() => openLightModal()}
        >
          {i18n.addFileLabel}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function ManifestSelection({
  isForOverrideSets,
  identifierName
}: {
  isForOverrideSets: boolean
  identifierName?: string
}): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  const identifier = selectedStageId || 'stage-identifier'
  let listOfManifests = !isForOverrideSets
    ? get(stage, 'stage.spec.service.serviceDef.spec.manifests', [])
    : get(stage, 'stage.spec.service.serviceDef.spec.manifestOverrideSets', [])
  if (isForOverrideSets) {
    listOfManifests = listOfManifests.map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
      if (overrideSets.overrideSet.identifier === identifierName) {
        return overrideSets.overrideSet.manifests
      }
    })[0]
  }

  return (
    <Layout.Vertical
      padding={!isForOverrideSets ? 'large' : 'none'}
      style={{ background: !isForOverrideSets ? 'var(--grey-100)' : '' }}
    >
      {!isForOverrideSets && <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>}
      {(!listOfManifests || listOfManifests.length === 0) && (
        <AddManifestRender
          identifier={identifier}
          pipeline={pipeline}
          isForOverrideSets={isForOverrideSets}
          identifierName={identifierName}
          updatePipeline={updatePipeline}
          stage={stage}
        />
      )}
      {listOfManifests && listOfManifests.length > 0 && (
        <ManifestListView
          identifier={identifier}
          pipeline={pipeline}
          updatePipeline={updatePipeline}
          stage={stage}
          isForOverrideSets={isForOverrideSets}
          identifierName={identifierName}
        />
      )}
    </Layout.Vertical>
  )
}
