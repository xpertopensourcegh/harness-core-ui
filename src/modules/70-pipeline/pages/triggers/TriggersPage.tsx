import React, { useState } from 'react'
import TriggersList from './Views/TriggersList/TriggersList'
// import TriggersWizard from './Views/TriggersWizard/TriggersWizard'
// import i18n from './TriggersPage.i18n'
// import css from './TriggersPage.module.scss'

// const getWizardMap = (triggerData: { triggerType: string; source: string } | undefined) => {
//   if (!triggerData) return undefined
//   const { triggerType = '', source = '' } = triggerData || {}
//   return {
//     triggerConfiguration: {
//       id: i18n.triggerConfigurationLabel,
//       tabTitleComponent: i18n.triggerConfigurationLabel,
//       body: (
//         <>
//           <h2>Trigger Type: {triggerType}</h2>
//           <h2>Source: {source}</h2>
//         </>
//       )
//     },
//     conditions: {
//       id: i18n.conditionsLabel,
//       tabTitle: i18n.conditionsLabel,
//       body: <h2>body</h2>
//     },
//     pipelineInput: { id: i18n.pipelineInputLabel, tabTitle: i18n.pipelineInputLabel, body: <h2>body</h2> }
//   }
// }

interface TriggerDataInterface {
  triggerType: string
  source: string
  // all else optional
}
const TriggersPage: React.FC = (): JSX.Element => {
  const [isTriggerWizardOpen, setTriggerWizard] = useState(false)
  // const [triggerData, setTriggerData] = useState<TriggerDataInterface | undefined>(undefined)

  const onTriggerClick = (_val: TriggerDataInterface) => {
    // const { triggerType, source } = val
    // setTriggerData({ triggerType, source })
    setTriggerWizard(true)
  }

  return (
    <>
      <TriggersList isTriggerWizardOpen={isTriggerWizardOpen} onTriggerClick={onTriggerClick} />
      {/* <TriggersWizard
        isTriggerWizardOpen={isTriggerWizardOpen}
        wizardMap={getWizardMap(triggerData)}
        onHide={() => {
          setTriggerWizard(false)
        }}
      /> */}
    </>
  )
}

export default TriggersPage
