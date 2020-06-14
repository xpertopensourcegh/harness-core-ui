import { Classes, Dialog, IDialogProps } from '@blueprintjs/core'
import { useModalHook } from '@wings-software/uikit'
import React, { useState, useCallback } from 'react'
import { OptionsView } from './OptionsView/OptionsView'
import { NewView } from './NewView/NewView'
import { CloneView } from './CloneView/CloneView'
import css from './useOrganizationModal.module.scss'
import cx from 'classnames'
import type { OrganizationDTO } from 'modules/common/types/dto/OrganizationDTO'

export interface UseOrganizationModalArgs {
  onSuccess: (org: OrganizationDTO) => void
}

export interface UseOrganizationModalResult {
  openOrganizationModal: (org?: OrganizationDTO) => void
  close: () => void
}

const ModalView = { OPTIONS: 1, NEW: 2, CLONE: 3, EDIT: 4 }

const ModalProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: false,
  canOutsideClickClose: false,
  enforceFocus: true,
  title: '',
  style: { width: 1000, height: 520, borderLeft: 'none', paddingBottom: 0, position: 'relative' }
}

export const useOrganizationModal: (args: UseOrganizationModalArgs) => UseOrganizationModalResult = args => {
  const [view, setView] = useState(ModalView.OPTIONS)
  const [orgData, setOrgData] = useState<OrganizationDTO>()
  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog
        onClose={() => {
          setView(ModalView.OPTIONS)
          hideModal()
        }}
        {...ModalProps}
        className={cx(css.modal, view !== ModalView.OPTIONS ? Classes.DIALOG : Classes.DARK)}
      >
        {view === ModalView.OPTIONS && (
          <OptionsView
            onSelectOption={value => {
              setView(value === 'NEW' ? ModalView.NEW : ModalView.CLONE)
            }}
          />
        )}
        {(view === ModalView.NEW || view === ModalView.EDIT) && (
          <NewView
            backToSelections={() => setView(ModalView.OPTIONS)}
            edit={view === ModalView.EDIT}
            data={orgData}
            onSuccess={org => {
              hideModal()
              args?.onSuccess(org)
            }}
          />
        )}
        {view === ModalView.CLONE && <CloneView />}
      </Dialog>
    ),
    [args, view, orgData]
  )
  const open = useCallback(
    (_org?: OrganizationDTO) => {
      if (_org) {
        setOrgData(_org)
        setView(ModalView.EDIT)
      }
      openModal()
    },
    [openModal]
  )

  return {
    openOrganizationModal: (org?: OrganizationDTO) => {
      open(org)
    },
    close: hideModal
  }
}
