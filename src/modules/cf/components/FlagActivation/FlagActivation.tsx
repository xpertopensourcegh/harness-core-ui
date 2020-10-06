import React, { useState } from 'react'
import {
  Layout,
  Color,
  Container,
  Text,
  Switch,
  Tabs,
  Tab,
  Button,
  FlexExpander,
  Select,
  useModalHook
} from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import type { FeatureFlagActivationResponseResponse } from 'services/cf'
import FlagElemTest from '../../components/CreateFlagWizard/FlagElemTest'
import TabTargeting from '../EditFlagTabs/TabTargeting'
import TabActivity from '../EditFlagTabs/TabActivity'
import i18n from './FlagActivation.i18n'
import css from './FlagActivation.module.scss'

interface FlagActivationProps {
  flagActivationData: FeatureFlagActivationResponseResponse | null
}

export enum envActivation {
  activeOff = 'off',
  activeOn = 'on'
}

const FlagActivation: React.FC<FlagActivationProps> = props => {
  const { flagActivationData } = props
  const [editEnvActivation, seteditEnvActivation] = useState(envActivation.activeOff)

  const onChangeSwitchEnv = (): void => {
    editEnvActivation === envActivation.activeOff
      ? seteditEnvActivation(envActivation.activeOn)
      : seteditEnvActivation(envActivation.activeOff)
  }

  const [openModalTestFlag, hideModalTestFlag] = useModalHook(() => (
    <Dialog onClose={hideModalTestFlag} isOpen={true} className={css.testFlagDialog}>
      <Container className={css.testFlagDialogContainer}>
        <FlagElemTest name="" fromWizard={false} />
        <Button
          minimal
          icon="small-cross"
          iconProps={{ size: 20 }}
          onClick={hideModalTestFlag}
          style={{ top: 0, right: '15px', position: 'absolute' }}
        />
      </Container>
    </Dialog>
  ))

  return (
    <>
      <Layout.Horizontal flex background={Color.BLUE_300} padding="large">
        <Text margin={{ right: 'medium' }} font={{ weight: 'bold' }}>
          {i18n.env.toUpperCase()}
        </Text>
        <Select
          items={[
            { label: 'Production', value: 'prod' },
            { label: 'Development', value: 'dev' }
          ]}
          className={css.envSelect}
        />
        <FlexExpander />
        <Switch
          label={i18n.changeEditEnv(editEnvActivation)}
          onChange={onChangeSwitchEnv}
          alignIndicator="right"
          large={true}
        />
      </Layout.Horizontal>

      <Container className={css.tabContainer}>
        <Tabs id="editFlag">
          <Tab id="targeting" title={i18n.targeting} panel={<TabTargeting targetData={flagActivationData?.data} />} />
          <Tab id="activity" title={i18n.activity} panel={<TabActivity />} />
        </Tabs>
        <Button
          icon="code"
          minimal
          intent="primary"
          onClick={openModalTestFlag}
          className={css.tabContainerTestFlagBtn}
        />
      </Container>
    </>
  )
}

export default FlagActivation
