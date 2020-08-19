import React from 'react'
import { ExpandingSearchInput, Card, Text, Icon } from '@wings-software/uikit'
import factory from 'modules/cd/common/PipelineSteps/PipelineStepFactory'
import type { StepData } from 'modules/common/components/AbstractSteps/AbstractStepFactory'
import i18n from './StepPalette.18n'
import { RightBar } from '../RightBar/RightBar'
import css from './StepPalette.module.scss'

interface GroupedStepData {
  [key: string]: StepData[]
}

const stepsList: GroupedStepData = {
  recent: factory.getAllStepsDataList()
}

export interface StepPaletteProps {
  onSelect: (item: StepData) => void
}
export const StepPalette: React.FC<StepPaletteProps> = ({ onSelect }): JSX.Element => {
  return (
    <div className={css.stepPalette}>
      <div className={css.stepInside}>
        <div className={css.topHeader}>
          <Text className={css.selectStep} font={{ size: 'medium' }}>
            {i18n.selectStep}
          </Text>
          <div className={css.expandedInput}>
            <ExpandingSearchInput />
          </div>
        </div>
        <div>
          {Object.entries(stepsList).map(([key, records]) => {
            return (
              <div key={key} style={{ padding: 'var(--spacing-medium) 0' }}>
                {/* TODO: We will remove this any once we have some BE Solution */}
                <Text style={{ paddingBottom: 'var(--spacing-medium)' }}>{(i18n as any)[key]}</Text>{' '}
                <div className={css.grid}>
                  {records.map((item: StepData) => (
                    <div key={item.type}>
                      <Card
                        interactive={true}
                        draggable={true}
                        onClick={() => onSelect(item)}
                        onDragStart={event => {
                          event.dataTransfer.setData('storm-diagram-node', JSON.stringify(item))
                        }}
                      >
                        <Icon name={item.icon} size={28} />
                      </Card>

                      <Text
                        font="small"
                        lineClamp={2}
                        style={{
                          width: '90px',
                          textAlign: 'center',
                          paddingTop: 'var(--spacing-xsmall)',
                          color: 'var(--grey-900)'
                        }}
                      >
                        {item.label}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <RightBar />
    </div>
  )
}
