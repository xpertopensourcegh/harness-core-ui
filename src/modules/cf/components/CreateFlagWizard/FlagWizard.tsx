import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { StepWizard, SelectOption, ModalErrorHandlerBinding } from '@wings-software/uicore'
import { useCreateFeatureFlag, FeatureFlagRequestRequestBody } from 'services/cf'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/exports'
import { SharedQueryParams } from '@cf/constants'
import FlagElemAbout from './FlagElemAbout'
import FlagElemBoolean from './FlagElemBoolean'
import FlagElemMultivariate from './FlagElemMultivariate'
import FlagElemTest from './FlagElemTest'
import { FlagTypeVariations, FlagTypeVariationsSelect } from '../CreateFlagDialog/FlagDialogUtils'
import i18n from './FlagWizard.i18n'
import css from './FlagWizard.module.scss'

interface FlagWizardProps {
  flagTypeView: string
  toggleFlagType: (newFlag: string) => void
  hideModal: () => void
}

const flagTypeOptions: SelectOption[] = [
  { label: i18n.varSettingsFlag.boolVal, value: FlagTypeVariations.booleanFlag },
  { label: i18n.varSettingsFlag.multiVal, value: FlagTypeVariationsSelect.string }
]

const FlagWizard: React.FC<FlagWizardProps> = props => {
  const { flagTypeView, toggleFlagType, hideModal } = props
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { showError } = useToaster()
  const { projectIdentifier, orgIdentifier, environmentIdentifier, accountId } = useParams()
  const history = useHistory()

  const {
    mutate: createFeatureFlag,
    loading: isLoadingCreateFeatureFlag,
    error: errorCreateFlag
  } = useCreateFeatureFlag({
    queryParams: SharedQueryParams
  })

  const onWizardStepSubmit = (formData: FeatureFlagRequestRequestBody | undefined): void => {
    modalErrorHandler?.hide()

    /*--- START ONLY FOR DEV ---*/
    if (formData) {
      const valTags: any = formData?.tags?.map(elem => {
        return { name: elem, value: elem }
      })
      formData.tags = valTags
      formData.owner = 'admin' // FIXME: Hardcoded for now
    }
    /*--- END ONLY FOR DEV ---*/

    if (formData) {
      createFeatureFlag(formData).then(() => {
        hideModal()
        history.push(
          routes.toCFFeatureFlagsDetail({
            orgIdentifier: orgIdentifier as string,
            projectIdentifier: projectIdentifier as string,
            featureFlagIdentifier: formData.identifier,
            environmentIdentifier: (environmentIdentifier ?? 'production') as string,
            accountId
          })
        )
      })
    } else {
      hideModal()
    }
  }

  // TODO: Show more meaningful error
  if (errorCreateFlag) {
    showError(errorCreateFlag.message)
  }

  return (
    <StepWizard className={css.flagWizardContainer} onCompleteWizard={onWizardStepSubmit}>
      <FlagElemAbout name={i18n.aboutFlag.aboutFlagHeading} />
      {flagTypeView === FlagTypeVariations.booleanFlag ? (
        <FlagElemBoolean
          name={i18n.varSettingsFlag.variationSettingsHeading}
          toggleFlagType={toggleFlagType}
          flagTypeOptions={flagTypeOptions}
          onWizardStepSubmit={onWizardStepSubmit}
          projectIdentifier={projectIdentifier}
          setModalErrorHandler={setModalErrorHandler}
          isLoadingCreateFeatureFlag={isLoadingCreateFeatureFlag}
        />
      ) : (
        <FlagElemMultivariate
          name={i18n.varSettingsFlag.variationSettingsHeading}
          toggleFlagType={toggleFlagType}
          flagTypeOptions={flagTypeOptions}
          onWizardStepSubmit={onWizardStepSubmit}
          projectIdentifier={projectIdentifier}
          setModalErrorHandler={setModalErrorHandler}
          isLoadingCreateFeatureFlag={isLoadingCreateFeatureFlag}
        />
      )}
      <FlagElemTest name={i18n.testTheFlag.testFlagHeading} fromWizard={true} hideModal={hideModal} />
    </StepWizard>
  )
}

export default FlagWizard
