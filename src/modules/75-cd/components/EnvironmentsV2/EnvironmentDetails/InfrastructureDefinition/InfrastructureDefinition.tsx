/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, ButtonSize, ButtonVariation, Container, ModalDialog, Page } from '@harness/uicore'
import { useModalHook } from '@harness/use-modal'

import { useGetInfrastructureList } from 'services/cd-ng'
import { useStrings } from 'framework/strings'

import type { EnvironmentPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'

import useRBACError from '@rbac/utils/useRBACError/useRBACError'

import InfrastructureList from './InfrastructureList/InfrastructureList'
import InfrastructureModal from './InfrastructureModal'

import css from './InfrastructureDefinition.module.scss'

export default function InfrastructureDefinition() {
  const { accountId, orgIdentifier, projectIdentifier, environmentIdentifier } = useParams<
    ProjectPathProps & EnvironmentPathProps
  >()
  const { getString } = useStrings()
  const { getRBACErrorMessage } = useRBACError()
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<string>('')

  const { data, loading, error, refetch } = useGetInfrastructureList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      environmentIdentifier
    }
  })

  useEffect(() => {
    if (selectedInfrastructure) {
      showModal()
    }
  }, [selectedInfrastructure])

  const onClose = () => {
    setSelectedInfrastructure('')
    hideModal()
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <ModalDialog
        isOpen
        isCloseButtonShown
        canEscapeKeyClose
        canOutsideClickClose
        enforceFocus={false}
        onClose={onClose}
        title={selectedInfrastructure ? getString('cd.infrastructure.edit') : getString('cd.infrastructure.createNew')}
        width={1128}
        height={840}
        className={css.dialogStyles}
      >
        <InfrastructureModal
          hideModal={onClose}
          refetch={refetch}
          environmentIdentifier={environmentIdentifier}
          selectedInfrastructure={selectedInfrastructure}
        />
      </ModalDialog>
    ),
    [refetch, selectedInfrastructure, setSelectedInfrastructure]
  )

  return (
    <Container padding={{ left: 'medium', right: 'medium' }}>
      {loading ? (
        <ContainerSpinner />
      ) : error ? (
        <Page.Error>{getRBACErrorMessage(error)}</Page.Error>
      ) : (
        <>
          <Button
            text={getString('pipelineSteps.deploy.infrastructure.infraDefinition')}
            font={{ weight: 'bold' }}
            icon="plus"
            onClick={showModal}
            size={ButtonSize.SMALL}
            variation={ButtonVariation.LINK}
          />
          <InfrastructureList
            list={data?.data?.content}
            showModal={showModal}
            refetch={refetch}
            setSelectedInfrastructure={setSelectedInfrastructure}
          />
        </>
      )}
    </Container>
  )
}
