import React from 'react'
import { Container, Text, FormInput } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { HealthSourceServices } from './SelectHealthSourceServices.constant'
import css from './SelectHealthSourceServices.module.scss'

export default function SelectHealthSourceServices() {
  const { getString } = useStrings()
  return (
    <Container className={css.main}>
      <Container className={css.checkBoxGroup}>
        <Text className={css.groupLabel}>{getString('cv.monitoredServices.assignLabel')}</Text>
        <FormInput.CheckBox
          label={getString('cv.monitoredServices.continuousVerification')}
          name={HealthSourceServices.CONTINUOUS_VERIFICATION}
        />
        <FormInput.CheckBox label={getString('cv.healthScore')} name={HealthSourceServices.HEALTHSCORE} />
        <FormInput.CheckBox label={getString('cv.slos.sli')} name={HealthSourceServices.SLI} />
      </Container>
    </Container>
  )
}
