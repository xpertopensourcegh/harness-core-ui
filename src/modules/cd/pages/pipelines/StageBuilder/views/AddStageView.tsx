import React from 'react'
import { Card, Icon } from '@wings-software/uikit'
import { StageType } from '../StageBuilderModel'
import i18n from '../StageBuilder.i18n'
import css from '../StageBuilder.module.scss'

export interface AddStageViewProps {
  callback: (type: StageType) => void
}

export const AddStageView: React.FC<AddStageViewProps> = ({ callback }) => (
  <div className={css.createNewContent}>
    <div className={css.createNewCards}>
      <Card interactive={true} className={css.cardNew} onClick={() => callback(StageType.DEPLOY)}>
        <Icon name="pipeline-deploy" size={24} />
        <div>{i18n.deploy}</div>
      </Card>
      <Card interactive={true} className={css.cardNew} onClick={() => callback(StageType.PIPELINE)}>
        <Icon name="pipeline" size={24} />
        <div>{i18n.pipeline}</div>
      </Card>
      <Card interactive={true} className={css.cardNew} onClick={() => callback(StageType.APPROVAL)}>
        <Icon name="pipeline-approval" size={24} />
        <div>{i18n.approval}</div>
      </Card>
      <Card interactive={true} className={css.cardNew} onClick={() => callback(StageType.CUSTOM)}>
        <Icon name="pipeline-custom" size={24} />
        <div>{i18n.custom}</div>
      </Card>
    </div>
    <div className={css.createNewMessage}>{i18n.newContentMessage}</div>
  </div>
)
