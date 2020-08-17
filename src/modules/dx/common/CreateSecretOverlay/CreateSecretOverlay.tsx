import React from 'react'
import { Layout, Icon } from '@wings-software/uikit'
import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import css from './CreateSecretOverlay.module.scss'

interface CreateSecretOverlayProps {
  setShowCreateSecretModal: (val: boolean) => void
}

const CreateSecretOverlay: React.FC<CreateSecretOverlayProps> = props => {
  return (
    <Layout.Vertical className={css.stepsOverlay} width={'400px'} padding="medium">
      <Icon
        name="cross"
        onClick={() => {
          props.setShowCreateSecretModal(false)
        }}
        className={css.crossIcon}
      />
      <CreateUpdateSecret
        type="SecretText"
        onSuccess={() => {
          props.setShowCreateSecretModal(false)
        }}
      />
    </Layout.Vertical>
  )
}

export default CreateSecretOverlay
