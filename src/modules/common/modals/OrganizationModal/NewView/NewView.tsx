import { StepWizard } from '@wings-software/uikit'
import React from 'react'
import type { Organization } from 'services/cd-ng'
import type { OrganizationModalInteraction } from '../OrganizationModalUtils'
import i18n from './NewView.i18n'
import { StepAboutOrganization } from './StepAboutOrganization'
// import { StepCollaborators } from './StepCollaborators'
import css from './Steps.module.scss'

export const NewView: React.FC<OrganizationModalInteraction> = ({ backToSelections, onSuccess, edit, data }) => {
  return (
    <StepWizard<Organization> className={css.steps} stepClassName={css.stepClass}>
      <StepAboutOrganization
        name={i18n.aboutTitle}
        backToSelections={backToSelections}
        onSuccess={onSuccess}
        edit={edit}
        data={data}
      />
      {/* <StepCollaborators
        name={i18n.collaborators}
        backToSelections={backToSelections}
        onSuccess={onSuccess}
        edit={edit}
        data={data}
      /> */}
    </StepWizard>
  )
}
