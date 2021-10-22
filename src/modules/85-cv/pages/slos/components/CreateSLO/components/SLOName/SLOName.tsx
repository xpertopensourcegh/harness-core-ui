import React, { useMemo, useState } from 'react'
import { SelectOption, Utils } from '@wings-software/uicore'
import { NameIdDescriptionTags } from '@common/components'
import { useStrings } from 'framework/strings'

import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import { HarnessServiceAsFormField } from '@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment'
import type { SLONameProps } from './SLOName.types'
import { updateSLOForUserJourney } from './SLOName.utils'
import css from './SLOName.module.scss'

export default function SLOName(props: SLONameProps): JSX.Element {
  const {
    formikProps: { values },
    formikProps,
    children
  } = props
  const { getString } = useStrings()
  const [userJourneyOptions, setUserJourneyOptions] = useState<SelectOption[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keys = useMemo(() => [Utils.randomId()], [values.userJourney])

  return (
    <>
      <CardWithOuterTitle className={css.sloNameContainer}>
        <NameIdDescriptionTags
          formikProps={formikProps}
          className={css.nameTagsDescription}
          identifierProps={{
            inputLabel: getString('cv.slos.sloName')
          }}
        />
        <HarnessServiceAsFormField
          key={keys[0]}
          customRenderProps={{
            name: 'userJourney',
            label: getString('cv.slos.userJourney')
          }}
          serviceProps={{
            className: css.dropdown,
            item: userJourneyOptions.find(item => item?.value === values.userJourney),
            options: userJourneyOptions,
            onSelect: selectedUserJourney => updateSLOForUserJourney(formikProps, selectedUserJourney),
            onNewCreated: newOption => {
              if (newOption?.identifier && newOption.name) {
                const newUserJourney = { label: newOption.name, value: newOption.identifier }
                setUserJourneyOptions([newUserJourney, ...userJourneyOptions])
              }
            }
          }}
        />
      </CardWithOuterTitle>
      {children}
    </>
  )
}
