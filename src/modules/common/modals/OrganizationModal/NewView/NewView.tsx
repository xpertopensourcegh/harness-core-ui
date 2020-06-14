import { StepWizard } from '@wings-software/uikit'
import type { OrganizationDTO } from 'modules/common/types/dto/OrganizationDTO'
import React from 'react'
import type { OrganizationModalInteraction } from '../OrganizationModalUtils'
import i18n from './NewView.i18n'
import css from './NewView.module.scss'
import { StepAboutOrganization } from './StepAboutOrganization'
import { StepCollaborators } from './StepCollaborators'

export const NewView: React.FC<OrganizationModalInteraction> = ({ backToSelections, onSuccess, edit, data }) => {
  return (
    <StepWizard<OrganizationDTO> className={css.steps}>
      <StepAboutOrganization
        name={i18n.aboutTitle}
        backToSelections={backToSelections}
        onSuccess={onSuccess}
        edit={edit}
        data={data}
      />
      <StepCollaborators
        name={i18n.collaborators}
        backToSelections={backToSelections}
        onSuccess={onSuccess}
        edit={edit}
        data={data}
      />
    </StepWizard>
  )
}
