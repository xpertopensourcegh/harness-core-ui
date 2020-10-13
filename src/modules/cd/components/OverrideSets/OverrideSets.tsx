import React from 'react'
import { Layout, Text, CollapseList, CollapseListPanel, Button, TextInput, Label } from '@wings-software/uikit'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { get } from 'lodash-es'
import { PipelineContext } from 'modules/common/components/PipelineStudio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/common/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import i18n from './OverrideSets.i18n'

import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'
import WorkflowVariables from '../WorkflowVariablesSelection/WorkflowVariables'

import css from './OverrideSets.module.scss'

export default function OverrideSets({ selectedTab }: { selectedTab: string }): JSX.Element {
  const initialName = ''
  const [overrideName, setOverrideName] = React.useState(initialName)
  const [isModalOpen, setModalState] = React.useState(false)
  const [isErrorVisible, setErrorVisibility] = React.useState(false)
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
  const serviceDefPath = 'stage.spec.service.serviceDefinition.spec'
  const currentListPath =
    serviceDefPath +
    '.' +
    (selectedTab === i18n.tabs.artifacts
      ? 'artifactOverrideSets'
      : selectedTab === i18n.tabs.manifests
      ? 'manifestOverrideSets'
      : 'variableOverrideSets')
  const currentVisibleOverridesList = get(stage, currentListPath, [])

  const createOverrideSet = (idName: string): void => {
    if (selectedTab === i18n.tabs.artifacts) {
      const artifactOverrideSets = get(stage, serviceDefPath + '.artifactOverrideSets', [])
      const artifactOverrideSetsStruct = {
        overrideSet: {
          identifier: idName,
          artifacts: {}
        }
      }
      artifactOverrideSets.push(artifactOverrideSetsStruct)
    }
    if (selectedTab === i18n.tabs.manifests) {
      const manifestOverrideSets = get(stage, serviceDefPath + '.manifestOverrideSets', [])
      const manifestOverrideSetStruct = {
        overrideSet: {
          identifier: idName,
          manifests: []
        }
      }
      manifestOverrideSets.push(manifestOverrideSetStruct)
    }
    if (selectedTab === i18n.tabs.variables) {
      const variableOverrideSets = get(stage, serviceDefPath + '.variableOverrideSets', [])
      const variableOverrideSetsStruct = {
        overrideSet: {
          identifier: idName,
          variables: []
        }
      }
      variableOverrideSets.push(variableOverrideSetsStruct)
    }
    updatePipeline(pipeline)
  }

  const modalPropsLight: IDialogProps = {
    isOpen: isModalOpen,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    title: i18n.modalTitle,
    canOutsideClickClose: true,
    enforceFocus: true,
    onClose: () => {
      setOverrideName(initialName)
      setModalState(false)
    },
    style: { width: 450, height: 215, paddingBottom: 0, borderLeftWidth: 5, position: 'relative', overflow: 'hidden' }
  }

  const onSubmitOverride = () => {
    if (!overrideName) {
      setErrorVisibility(true)
      return
    }
    createOverrideSet(overrideName)
    setModalState(false)
    setOverrideName(initialName)
  }

  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', paddingTop: 0 }}>
      <Text style={{ color: 'var(--grey-400)', lineHeight: '24px' }}>{i18n.configure}</Text>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px', paddingBottom: 'var(--spacing-medium)' }}>
        {i18n.info}
      </Text>
      <section className={css.collapseContainer}>
        <CollapseList>
          {currentVisibleOverridesList.map((data: { overrideSet: { identifier: string } }, index: number) => {
            return (
              <CollapseListPanel
                key={data.overrideSet.identifier + index}
                collapseHeaderProps={{
                  heading: `${i18n.overrideSetNamePrefix} ${data.overrideSet.identifier}`,
                  isRemovable: true,
                  onRemove: () => {
                    currentVisibleOverridesList.splice(index, 1)
                    updatePipeline(pipeline)
                  }
                }}
              >
                {selectedTab === i18n.tabs.artifacts && (
                  <ArtifactsSelection
                    isForOverrideSets={true}
                    identifierName={data.overrideSet.identifier}
                    isForPredefinedSets={false}
                  />
                )}
                {selectedTab === i18n.tabs.manifests && (
                  <ManifestSelection
                    isForOverrideSets={true}
                    identifierName={data.overrideSet.identifier}
                    isForPredefinedSets={false}
                  />
                )}
                {/* {selectedTab === i18n.tabs.variables && <WorkflowVariables />} */}
                {selectedTab === i18n.tabs.variables && (
                  <WorkflowVariables
                    isForOverrideSets={true}
                    identifierName={data.overrideSet.identifier}
                    isForPredefinedSets={false}
                  />
                )}
              </CollapseListPanel>
            )
          })}
        </CollapseList>
      </section>

      <Text intent="primary" style={{ cursor: 'pointer' }} onClick={() => setModalState(true)}>
        {i18n.createOverrideSet}
      </Text>
      {isModalOpen && (
        <Dialog {...modalPropsLight}>
          <Layout.Vertical spacing="small" padding="large">
            <Label>Override Set Name</Label>
            <TextInput
              placeholder={i18n.overrideSetPlaceholder}
              value={overrideName}
              onChange={e => {
                e.preventDefault()
                const element = e.currentTarget as HTMLInputElement
                const elementValue = element.value
                setErrorVisibility(false)
                setOverrideName(elementValue)
              }}
            />
            <Layout.Horizontal spacing="medium">
              <Button intent="primary" onClick={onSubmitOverride} text="Submit" />
              <Button
                text="Close"
                onClick={() => {
                  setModalState(false)
                  setOverrideName(initialName)
                }}
              />
            </Layout.Horizontal>
            {isErrorVisible && <section className={css.error}>{i18n.overrideSetError}</section>}
          </Layout.Vertical>
        </Dialog>
      )}
    </Layout.Vertical>
  )
}
