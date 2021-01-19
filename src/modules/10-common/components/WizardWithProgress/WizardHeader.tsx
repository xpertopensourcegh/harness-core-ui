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
        const titleClass = getClassName(panel?.status)
        const separatorClass = getSeparator(panel?.status)
        const icon = getIconClass(panel?.status)
        return (
          <>
            <Container
              className={css.headerContent}
              onClick={() => {
                props.onClick(panel.id, index)
              }}
            >
              {panel?.status !== Status.COMPLETED && <img src={icon} alt="" aria-hidden />}
              {panel?.status === Status.COMPLETED && (
                <Icon name="deployment-success-legacy" className={css.completedIcon} />
              )}
              <Text
                font={{ size: 'normal', align: 'center' }}
                className={`${css.headerTitle} ${titleClass}`}
                onClick={props.onClick}
              >
                {panel.tabTitle}
              </Text>

              {index !== panelLength - 1 && <hr className={`${css.headerSeparator} ${separatorClass}`} />}
            </Container>
          </>
        )
      })}
    </Container>
  )
}

export default WizardHeader
