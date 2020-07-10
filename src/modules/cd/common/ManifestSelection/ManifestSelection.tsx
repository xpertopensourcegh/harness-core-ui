import React from 'react'
import { Layout, Text, Container, Icon, Color, useModalHook, Button } from '@wings-software/uikit'
import css from './ManifestSelection.module.scss'
import i18n from './ManifestSelection.i18n'
import cx from 'classnames'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { ManifestWizard } from './ManifestWizardSteps/ManifestWizard'
import { PipelineContext } from '../../pages/pipelines/PipelineContext/PipelineContext'
import { get } from 'lodash-es'
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

function AddManifestRender({
  identifier,
  pipeline,
  updatePipeline
}: {
  identifier: string
  pipeline: object
  updatePipeline: object
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
  updatePipeline
}: {
  identifier: string
  pipeline: object
  updatePipeline: (data: object) => void
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
        updatePipeline={updatePipeline}
      />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

  const listOfManifests = get(pipeline, 'stages[0].deployment.deployment.service.serviceSpec.manifests.manifests', [])

  const removeManifestConfig = (index: number) => {
    listOfManifests.splice(index, 1)
    updatePipeline(pipeline)
  }

  return (
    <Layout.Vertical spacing="small">
      <Container>
        <section className={css.thead}>
          <span>{artifactListHeaders.type}</span>
          <span>{artifactListHeaders.server}</span>
          <span></span>
          <span>{artifactListHeaders.branch}</span>
          <span>{artifactListHeaders.location}</span>
          <span>{artifactListHeaders.id}</span>

          <span></span>
        </section>
      </Container>
      <Layout.Vertical spacing="medium">
        <section>
          {listOfManifests.map(
            (
              data: {
                manifest: {
                  identifier: string
                  manifestAttributes: {
                    kind: string
                    storeConfig: {
                      fetchValue: string
                      paths: string[]
                    }
                  }
                }
              },
              index: number
            ) => {
              const manifest = data['manifest']
              return (
                <section className={cx(css.thead, css.rowItem)} key={manifest.identifier + index}>
                  <span className={css.type}>{i18n.manifestTypeLabelPrimary}</span>
                  <span className={css.server}>
                    <Text
                      inline
                      icon={'service-github'}
                      iconProps={{ size: 18 }}
                      width={200}
                      style={{ color: Color.BLACK, fontWeight: 900 }}
                    >
                      {manifest.manifestAttributes.kind}
                    </Text>
                  </span>
                  <span>
                    <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                  </span>
                  <span>
                    <Text style={{ color: Color.GREY_500 }}>{manifest.manifestAttributes.storeConfig.fetchValue}</Text>
                  </span>
                  <span>
                    <Text width={280} lineClamp={1} style={{ color: Color.GREY_500 }}>
                      {manifest.manifestAttributes.storeConfig.paths[0]}
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

        <Text intent="primary" style={{ cursor: 'pointer' }} onClick={() => openLightModal()}>
          {i18n.addFileLabel}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function ManifestSelection(): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  const identifier = selectedStageId || 'stage-identifier'
  const listOfManifests = get(pipeline, 'stages[0].deployment.deployment.service.serviceSpec.manifests.manifests', [])
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)' }}>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      {!listOfManifests ||
        (listOfManifests.length === 0 && (
          <AddManifestRender identifier={identifier} pipeline={pipeline} updatePipeline={updatePipeline} />
        ))}
      {listOfManifests && listOfManifests.length > 0 && (
        <ManifestListView identifier={identifier} pipeline={pipeline} updatePipeline={updatePipeline} />
      )}
    </Layout.Vertical>
  )
}
