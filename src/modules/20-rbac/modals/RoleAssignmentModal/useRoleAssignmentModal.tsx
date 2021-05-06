import React, { useCallback, useState } from 'react'
import { useModalHook, Button } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'

import type { UserMetadataDTO, RoleAssignmentMetadataDTO, UserGroupDTO } from 'services/cd-ng'
import UserRoleAssignment from './views/UserRoleAssigment'
import UserGroupRoleAssignment from './views/UserGroupRoleAssignment'
import css from './useRoleAssignmentModal.module.scss'

export interface UseRoleAssignmentModalProps {
  onSuccess: () => void
}

export enum PrincipalType {
  USER = 'USER',
  USER_GROUP = 'USER_GROUP'
}

export interface UseRoleAssignmentModalReturn {
  openRoleAssignmentModal: (
    type?: PrincipalType,
    principalInfo?: UserGroupDTO | UserMetadataDTO,
    roleBindings?: RoleAssignmentMetadataDTO[]
  ) => void
  closeRoleAssignmentModal: () => void
}

export const useRoleAssignmentModal = ({ onSuccess }: UseRoleAssignmentModalProps): UseRoleAssignmentModalReturn => {
  const [roleBindings, setRoleBindings] = useState<RoleAssignmentMetadataDTO[]>()
  const [principalInfo, setPrincipalInfo] = useState<UserMetadataDTO | UserGroupDTO>()
  const [principal, setPrincipal] = useState<PrincipalType>(PrincipalType.USER)
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG)}
      >
        {principal === PrincipalType.USER ? (
          <UserRoleAssignment
            roleBindings={roleBindings}
            user={principalInfo as UserMetadataDTO}
            isInvite={!principalInfo}
            onSubmit={() => {
              onSuccess()
              hideModal()
            }}
          />
        ) : (
          <UserGroupRoleAssignment
            roleBindings={roleBindings}
            userGroup={principalInfo as UserGroupDTO}
            onSubmit={() => {
              onSuccess()
              hideModal()
            }}
          />
        )}

        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [roleBindings, principalInfo]
  )
  const open = useCallback(
    (
      _type?: PrincipalType,
      _principalInfo?: UserGroupDTO | UserMetadataDTO,
      _roleBindings?: RoleAssignmentMetadataDTO[]
    ) => {
      if (_type) setPrincipal(_type)
      setRoleBindings(_roleBindings)
      setPrincipalInfo(_principalInfo)
      showModal()
    },
    [showModal]
  )

  return {
    openRoleAssignmentModal: (
      _type?: PrincipalType,
      _principalInfo?: UserGroupDTO | UserMetadataDTO,
      _roleBindings?: RoleAssignmentMetadataDTO[]
    ) => open(_type, _principalInfo, _roleBindings),
    closeRoleAssignmentModal: hideModal
  }
}
