import React from 'react'
import { FontVariation, Icon, Text } from '@wings-software/uicore'
import css from './PipelineVariables.module.scss'

const VariableAccordionSummary = (props: { children: React.ReactNode; hideIcons?: boolean }) => {
  return (
    <div className={css.accordionSummary}>
      {!props.hideIcons && (
        <>
          <Icon name="accordion-collapsed" className={css.iconCollapsed} size={12} />
          <Icon name="accordion-expanded" className={css.iconExpanded} size={12} />
        </>
      )}
      <Text font={{ variation: FontVariation.H6 }}>{props.children}</Text>
    </div>
  )
}

export default VariableAccordionSummary
