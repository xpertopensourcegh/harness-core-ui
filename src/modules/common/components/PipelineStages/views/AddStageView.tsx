import React from 'react'
import { Card, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import type { PipelineStageProps } from '../PipelineStage'
import i18n from './AddStageView.i18n'
import css from './AddStageView.module.scss'

export interface AddStageViewProps {
  callback: (type: string) => void
  stages: Array<PipelineStageProps>
  isParallel?: boolean
}

export const AddStageView: React.FC<AddStageViewProps> = ({ callback, isParallel = false, stages }) => (
  <div className={cx(css.createNewContent, { [css.parallel]: isParallel })}>
    <div className={css.createNewCards}>
      {stages.map(stage => (
        <>
          {!stage.isApproval || !isParallel ? (
            <Card
              key={stage.type}
              interactive={true}
              disabled={stage.isDisabled}
              className={cx(css.cardNew, { [css.disabled]: stage.isDisabled })}
              onClick={e => {
                if (stage.isDisabled) {
                  e.stopPropagation()
                } else {
                  callback(stage.type)
                }
              }}
            >
              <Icon name={stage.icon} size={24} {...stage.iconsProps} style={stage.iconsStyle} />
              <div>{stage.name}</div>
            </Card>
          ) : null}
        </>
      ))}
    </div>
    <div className={css.createNewMessage}>{i18n.newContentMessage}</div>
  </div>
)
