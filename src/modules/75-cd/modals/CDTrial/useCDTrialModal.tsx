import React, { useState } from 'react'
import { useModalHook, Button } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { useStrings } from 'framework/strings'

import { CreateOrSelectAProjectTemplate } from '@projects-orgs/components/CreateOrSelectAProjectTemplate/CreateOrSelectAProjectTemplate'
import { CreatePipelineForm } from '@pipeline/components/CreatePipelineForm/CreatePipelineForm'
import { SelectOrCreatePipelineForm } from '@pipeline/components/SelectOrCreatePipelineForm/SelectOrCreatePipelineForm'
import { TrialModalTemplate } from '@common/components/TrialModalTemplate/TrialModalTemplate'
import cdImage from '../images/illustration.png'
import css from './useCDTrialModal.module.scss'

type CreateOrSelectProjectProps = {
  onSelectProject: () => void
  onCreateProject: () => void
}
type PipelineProps = {
  onSuccess: () => void
  onCloseModal?: () => void
}
export interface UseCDTrialModalProps {
  actionProps: PipelineProps | CreateOrSelectProjectProps
  trialType: TrialType
}

export interface UseCDTrialModalReturn {
  openCDTrialModal: () => void
  closeCDTrialModal: () => void
}

export enum TrialType {
  CREATE_OR_SELECT_PIPELINE,
  CREATE_OR_SELECT_PROJECT,
  SET_UP_PIPELINE
}

interface CDTrialTemplateData {
  description: string
  children: React.ReactElement
  rightWidth?: string
}

const CDTrialTemplate: React.FC<CDTrialTemplateData> = ({ description, children, rightWidth }) => {
  const { getString } = useStrings()

  return (
    <TrialModalTemplate
      iconName="cd-main"
      title={getString('cd.continuous')}
      description={description}
      imgSrc={cdImage}
      rightWidth={rightWidth}
    >
      {children}
    </TrialModalTemplate>
  )
}

interface CDTrialProps {
  trialType: TrialType
  hideModal: () => void
  actionProps: PipelineProps | CreateOrSelectProjectProps
}

const CDTrial: React.FC<CDTrialProps> = ({ trialType, actionProps, hideModal }) => {
  const { getString } = useStrings()
  const [trial, setTrial] = useState(trialType)

  let child = <></>
  let description = ''
  let rightWidth = '30%'

  switch (trial) {
    case TrialType.SET_UP_PIPELINE: {
      child = (
        <CreatePipelineForm
          handleSubmit={(actionProps as PipelineProps).onSuccess}
          closeModal={() => {
            hideModal(), (actionProps as PipelineProps).onCloseModal?.()
          }}
        />
      )
      description = getString('cd.cdTrialHomePage.startTrial.description')
      break
    }
    case TrialType.CREATE_OR_SELECT_PIPELINE: {
      child = (
        <SelectOrCreatePipelineForm
          handleSubmit={(actionProps as PipelineProps).onSuccess}
          openCreatPipeLineModal={() => {
            setTrial(TrialType.SET_UP_PIPELINE)
          }}
          closeModal={() => {
            hideModal(), (actionProps as PipelineProps).onCloseModal?.()
          }}
        />
      )
      description = getString('pipeline.selectOrCreateForm.description')
      break
    }
    case TrialType.CREATE_OR_SELECT_PROJECT: {
      child = (
        <CreateOrSelectAProjectTemplate
          onSelectProject={(actionProps as CreateOrSelectProjectProps).onSelectProject}
          onCreateProject={(actionProps as CreateOrSelectProjectProps).onCreateProject}
          moduleDescription={getString('cd.continuous')}
        />
      )
      description = getString('cd.createOrSelectProject')
      rightWidth = '40%'
    }
  }

  return (
    <CDTrialTemplate description={description} rightWidth={rightWidth}>
      {child}
    </CDTrialTemplate>
  )
}

export const useCDTrialModal = ({ actionProps, trialType }: UseCDTrialModalProps): UseCDTrialModalReturn => {
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal(), (actionProps as PipelineProps).onCloseModal?.()
        }}
        className={cx(css.dialog, Classes.DIALOG, css.cdTrial)}
      >
        <CDTrial trialType={trialType} actionProps={actionProps} hideModal={hideModal} />
        <Button
          aria-label="close modal"
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            hideModal(), (actionProps as PipelineProps).onCloseModal?.()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    []
  )

  return {
    openCDTrialModal: showModal,
    closeCDTrialModal: hideModal
  }
}
