import React from 'react'
import { Text, Icon, StepWizard, Color, StepProps } from '@wings-software/uicore'

import { useStrings } from 'framework/exports'
import type { ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import type { ConnectorRefLabelType } from '@pipeline/components/ArtifactsSelection/ArtifactInterface'
import type { ManifestDataType, ManifestTypes } from '../ManifestSelection'
import { ManifestRepoTypes } from '../ManifestWizardSteps/ManifestRepoTypes'
import ManifestStore from '../ManifestWizardSteps/ManifestStore'
import { manifestTypeIcons, manifestTypeLabels } from '../Manifesthelper'
import css from './ManifestWizard.module.scss'

interface StepChangeData<SharedObject> {
  prevStep?: number
  nextStep?: number
  prevStepData: SharedObject
}

interface ManifestWizardStepsProps {
  handleViewChange: (isConnectorView: boolean, selectedStore: ConnectorInfoDTO['type']) => void
  initialValues: ManifestDataType
  types: Array<ManifestTypes>
  manifestStoreTypes: Array<ConnectorInfoDTO['type']>
  labels: ConnectorRefLabelType
  selectedManifest: ManifestTypes
  newConnectorView: boolean
  newConnectorSteps?: any
  lastSteps?: Array<React.ReactElement<StepProps<ConnectorConfigDTO>>> | null
  changeManifestType: (data: ManifestTypes) => void
}

export const ManifestWizard: React.FC<ManifestWizardStepsProps> = ({
  handleViewChange,
  initialValues,
  types,
  manifestStoreTypes,
  labels,
  selectedManifest,
  newConnectorView,
  newConnectorSteps,
  lastSteps,
  changeManifestType
}) => {
  const { getString } = useStrings()

  const onStepChange = (arg: StepChangeData<any>): void => {
    if (arg?.prevStep && arg?.nextStep && arg.prevStep > arg.nextStep) {
      handleViewChange(false, Connectors.GIT)
    }
  }

  const renderSubtitle = (): JSX.Element => {
    const stringId = manifestTypeLabels[selectedManifest]
    return (
      <div className={css.subtitle} style={{ display: 'flex' }}>
        <Icon name={manifestTypeIcons[selectedManifest]} size={26} />
        <Text style={{ alignSelf: 'center', marginLeft: 'var(--spacing-small)' }} color={Color.WHITE}>
          {stringId}
        </Text>
      </div>
    )
  }

  return (
    <StepWizard className={css.manifestWizard} subtitle={renderSubtitle()} onStepChange={onStepChange}>
      <ManifestRepoTypes
        manifestTypes={types}
        name={getString('manifestType.manifestRepoType')}
        stepName={labels.firstStepName}
        selectedManifest={selectedManifest}
        changeManifestType={changeManifestType}
      />
      <ManifestStore
        name={getString('manifestType.manifestSource')}
        stepName={labels.secondStepName}
        newConnectorLabel={labels.newConnector}
        manifestStoreTypes={manifestStoreTypes}
        handleViewChange={selectedStore => {
          handleViewChange(true, selectedStore)
        }}
        initialValues={initialValues}
      />
      {newConnectorView ? newConnectorSteps : null}

      {lastSteps?.length ? lastSteps?.map(step => step) : null}
    </StepWizard>
  )
}
