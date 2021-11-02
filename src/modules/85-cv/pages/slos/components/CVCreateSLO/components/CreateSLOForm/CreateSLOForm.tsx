import React, { useMemo, useState } from 'react'
import { Container, Tab, Tabs } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { CreateSLOEnum } from './CreateSLO.constants'

import { NavButtons } from '../NavButtons/NavButtons'
import SLOName from './components/SLOName/SLOName'
import SLI from './components/SLI/SLI'
import SLOTargetAndBudgetPolicy from './components/SLOTargetAndBudgetPolicy/SLOTargetAndBudgetPolicy'
import type { CreateSLOFormProps } from './CreateSLO.types'
import css from './CreateSLO.module.scss'

export default function CreateSLOForm(props: CreateSLOFormProps): JSX.Element {
  const { formikProps } = props
  const { getString } = useStrings()
  const [selectedTabId, setSelectedTabId] = useState<CreateSLOEnum>(CreateSLOEnum.NAME)

  const navButtons = useMemo(() => {
    const navButtonProps = {
      selectedTabId,
      setSelectedTabId,
      getString,
      submitForm: formikProps.submitForm
    }
    return <NavButtons {...navButtonProps} />
  }, [formikProps.submitForm, getString, selectedTabId])

  return (
    <>
      <Container className={css.sloTabs}>
        <Tabs
          id="createSLOTabs"
          selectedTabId={selectedTabId}
          onChange={nextTab => setSelectedTabId(nextTab as CreateSLOEnum)}
        >
          <Tab
            id={CreateSLOEnum.NAME}
            title={getString('name')}
            panel={<SLOName formikProps={formikProps}>{navButtons}</SLOName>}
          />
          <Tab
            id={CreateSLOEnum.SLI}
            title={getString('cv.slos.sli')}
            panel={<SLI formikProps={formikProps}>{navButtons}</SLI>}
          />
          <Tab
            id={CreateSLOEnum.SLO_TARGET_BUDGET_POLICY}
            title={getString('cv.slos.sloTargetAndBudgetPolicy')}
            panel={<SLOTargetAndBudgetPolicy formikProps={formikProps}>{navButtons}</SLOTargetAndBudgetPolicy>}
          />
        </Tabs>
      </Container>
    </>
  )
}
