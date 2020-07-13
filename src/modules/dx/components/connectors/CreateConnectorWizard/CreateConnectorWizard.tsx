import React from 'react'
import css from './CreateConnectorWizard.module.scss'
import { getConnectorWizardByType } from '../utils'
interface CreateConnectorWizardProps {
  accountId: string
  type: string
  hideLightModal: () => void
}

export const CreateConnectorWizard = (props: CreateConnectorWizardProps) => {
  return (
    <div className={css.createConnectorWizard}>
      {getConnectorWizardByType(props.type, props.accountId, props.hideLightModal)}
    </div>
  )
}
