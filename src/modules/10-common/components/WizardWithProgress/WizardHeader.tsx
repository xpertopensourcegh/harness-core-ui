import React from 'react'
import { Container, Text, Icon } from '@wings-software/uicore'
import step from './Icons/Step.svg'
import { Status } from './WizardHelper'
import inprogress from './Icons/InProgressStep.svg'

import css from './StepWizard.module.scss'

export interface PanelInterface {
  id: string
  tabTitle?: string
  tabTitleComponent?: JSX.Element
  status?: string
}

interface WizardHeaderInterface {
  panels: PanelInterface[]
  onClick: any
}

const getClassName = (status: string | undefined) => {
  switch (status) {
    case Status.INPROGRESS:
      return css.inprogress
    default:
      return ''
  }
}

const getSeparator = (status: string | undefined) => {
  switch (status) {
    case Status.INPROGRESS:
      return css.progressSeparator
    case Status.COMPLETED:
      return css.completedSeparator
    default:
      return ''
  }
}

const getIconClass = (status: string | undefined) => {
  switch (status) {
    case Status.INPROGRESS:
      return inprogress
    case Status.TODO:
      return step
    default:
      break
  }
}

const WizardHeader: React.FC<WizardHeaderInterface> = (props: WizardHeaderInterface) => {
  const { panels } = props
  const panelLength = panels.length

  return (
    <Container className={css.headerContainer}>
      {panels.map((panel: PanelInterface, index: number) => {
        const titleClass = index === panelLength - 1 ? css.lastElementHeader : getClassName(panel?.status)
        const separatorClass = getSeparator(panel?.status)
        const icon = getIconClass(panel?.status)
        const lastElementCls = index === panelLength - 1 ? css.lastElement : ''

        return (
          <>
            <Container
              className={css.headerContent}
              onClick={() => {
                props.onClick(panel.id, index)
              }}
            >
              <div className={`${css.headerSeparator} ${lastElementCls}`}>
                {panel?.status !== Status.COMPLETED && <img src={icon} alt="" aria-hidden width="15" />}
                {panel?.status === Status.COMPLETED && <Icon name="deployment-success-legacy" />}
                {index !== panelLength - 1 && <hr className={`${css.headerSeparator} ${separatorClass}`} />}
              </div>
              <Text
                font={{ size: 'normal', align: 'center' }}
                className={`${css.headerTitle} ${titleClass} `}
                onClick={props.onClick}
              >
                {panel.tabTitle}
              </Text>
            </Container>
          </>
        )
      })}
    </Container>
  )
}

export default WizardHeader
