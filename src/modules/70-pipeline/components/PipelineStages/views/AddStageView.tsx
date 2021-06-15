import React from 'react'
import { Card, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/strings'
import type { PipelineStageProps } from '../PipelineStage'
import css from './AddStageView.module.scss'

export interface AddStageViewProps {
  callback: (type: string) => void
  stages: Array<PipelineStageProps>
  isParallel?: boolean
}

interface SelectedTypeData {
  title?: string
  description?: string
  type?: string
}
export const AddStageView: React.FC<AddStageViewProps> = ({ callback, isParallel = false, stages }) => {
  const { getString } = useStrings()
  const [selectedType, setSelectedType] = React.useState<SelectedTypeData | undefined>(undefined)

  return (
    <div className={cx(css.createNewContent, { [css.parallel]: isParallel })}>
      <div className={css.createNewCards}>
        {stages.map(stage => (
          <React.Fragment key={stage.type}>
            {stage.isHidden !== true && (!stage.isApproval || !isParallel) ? (
              <div>
                <Card
                  data-testid={`stage-${stage.type}`}
                  onMouseOver={() => !stage.isDisabled && selectedType?.type !== stage.type && setSelectedType(stage)}
                  onMouseLeave={() => setSelectedType(undefined)}
                  interactive={true}
                  disabled={stage.isDisabled}
                  className={cx(css.cardNew)}
                  onClick={e => {
                    if (stage.isDisabled) {
                      e.stopPropagation()
                    } else {
                      callback(stage.type)
                    }
                  }}
                >
                  <Icon name={stage.icon} size={24} {...stage.iconsProps} style={stage.iconsStyle} />
                </Card>
                <div className={cx(css.cardTitle, { [css.selected]: selectedType?.type === stage.type })}>
                  {stage.name}
                </div>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <div className={css.createNewMessage}>
        <Icon
          name="main-close"
          size={10}
          className={css.closeIcon}
          onClick={() => window.dispatchEvent(new CustomEvent('CLOSE_CREATE_STAGE_POPOVER'))}
        />
        <div className={css.stageTitle}>{selectedType?.title || getString('pipeline.addStage.title')}</div>
        <div className={css.stageDescription}>
          {selectedType?.description || getString('pipeline.addStage.description')}
        </div>
      </div>
    </div>
  )
}
