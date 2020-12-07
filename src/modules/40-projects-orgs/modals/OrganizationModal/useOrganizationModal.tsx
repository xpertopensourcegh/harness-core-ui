import { Classes, Dialog } from '@blueprintjs/core'
import { Button, StepWizard, useModalHook } from '@wings-software/uikit'
import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import type { Organization } from 'services/cd-ng'
import i18n from './useOrganizationModal.i18n'
import StepAboutOrganization from './views/StepAboutOrganization'
import EditOrganization from './views/EditOrganization'
import { OrgCollaboratorsStep } from '../ProjectModal/views/Collaborators'
import css from './useOrganizationModal.module.scss'

export interface UseOrganizationModalArgs {
  onSuccess: () => void
}

export interface UseOrganizationModalResult {
  openOrganizationModal: (org?: Organization) => void
  closeOrganizationModal: () => void
}

const Views = { CREATE: 1, EDIT: 2 }

export const useOrganizationModal = ({ onSuccess }: UseOrganizationModalArgs): UseOrganizationModalResult => {
  const [view, setView] = useState(Views.CREATE)
  const [orgData, setOrgData] = useState<Organization>()
  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setView(Views.CREATE)
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG, {
          [css.create]: view === Views.CREATE,
          [css.edit]: view === Views.EDIT
        })}
      >
        {view === Views.CREATE ? (
          <StepWizard<Organization> stepClassName={css.stepClass}>
            <StepAboutOrganization name={i18n.aboutTitle} onSuccess={onSuccess} />
            <OrgCollaboratorsStep name={i18n.collaboratorsTitle} />
          </StepWizard>
        ) : null}
        {view === Views.EDIT ? (
          <EditOrganization
            name={i18n.aboutTitle}
            onSuccess={() => {
              hideModal()
              onSuccess()
            }}
            identifier={orgData?.identifier}
          />
        ) : null}
        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.CREATE)
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [view, orgData]
  )
  const open = useCallback(
    (_org?: Organization) => {
      if (_org) {
        setOrgData(_org)
        setView(Views.EDIT)
      } else setView(Views.CREATE)
      openModal()
    },
    [openModal]
  )

  return {
    openOrganizationModal: (org?: Organization) => {
      open(org)
    },
    closeOrganizationModal: hideModal
  }
}
