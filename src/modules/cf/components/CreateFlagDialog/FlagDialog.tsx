import React, { useState } from 'react'
import { Dialog } from '@blueprintjs/core'
import { Color, useModalHook, Button, Container, Text, Icon } from '@wings-software/uicore'
import { FlagTypeVariations } from './FlagDialogUtils'
import FlagWizard from '../CreateFlagWizard/FlagWizard'
import FlagTypeElement from '../CreateFlagType/FlagTypeElement'
import i18n from './FlagDialog.i18n'
import css from './FlagDialog.module.scss'

export interface FlagModalProps {
  disabled?: boolean
}

const FlagModal: React.FC<FlagModalProps> = ({ disabled }) => {
  const [flagTypeClicked, setFlagTypeClicked] = useState(false)
  const [flagTypeView, setFlagTypeView] = useState('')

  const booleanFlagBtn = (typeOfFlag: boolean, type: string): void => {
    setFlagTypeClicked(typeOfFlag)
    setFlagTypeView(type)
  }

  const multiFlagBtn = (typeOfFlag: boolean, type: string): void => {
    setFlagTypeClicked(typeOfFlag)
    setFlagTypeView(type)
  }

  const toggleFlagType = (newFlagType: string): void => {
    setFlagTypeView(newFlagType)
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setFlagTypeClicked(false)
          hideModal()
        }}
        className={css.modal}
      >
        {flagTypeClicked ? (
          <FlagWizard flagTypeView={flagTypeView} toggleFlagType={toggleFlagType} hideModal={hideModal} />
        ) : (
          <Container className={css.typeFlagContainer} padding="huge">
            <Text font={{ size: 'medium', weight: 'bold' }} color={Color.WHITE} margin={{ bottom: 'small' }}>
              {i18n.typeOfFlag}
            </Text>
            <Text font="small" color={Color.WHITE} margin={{ bottom: 'xxxlarge' }}>
              {i18n.startVariation}
            </Text>
            <Container className={css.typeFlagBtns}>
              <FlagTypeElement
                type={FlagTypeVariations.booleanFlag}
                text={i18n.boolean}
                textDesc={i18n.booleanBtnText}
                typeOfFlagFnc={booleanFlagBtn}
              >
                <Icon name="full-circle" color={Color.BLUE_800} />
                <Icon name="full-circle" color={Color.BLUE_500} className={css.iconMl} />
              </FlagTypeElement>

              <FlagTypeElement
                type={FlagTypeVariations.multiFlag}
                text={i18n.multi}
                textDesc={i18n.multiBtnText}
                typeOfFlagFnc={multiFlagBtn}
              >
                <Icon name="full-circle" color={Color.BLUE_800} />
                <Icon name="full-circle" color={Color.BLUE_500} className={css.iconMl} />
                <Icon name="full-circle" color={Color.YELLOW_700} className={css.iconMl} />
                <Icon name="small-plus" color={Color.GREY_600} className={css.iconMl} />
              </FlagTypeElement>
            </Container>
          </Container>
        )}

        <Button
          minimal
          icon="small-cross"
          iconProps={{ size: 25 }}
          onClick={() => {
            setFlagTypeClicked(false)
            hideModal()
          }}
          className={css.closeIcon}
        />
      </Dialog>
    ),
    [flagTypeClicked, flagTypeView]
  )

  return (
    <Button disabled={disabled} text={i18n.newFlag} intent="primary" onClick={showModal} className={css.openModalBtn} />
  )
}

export default FlagModal
