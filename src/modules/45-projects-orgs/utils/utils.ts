import type { StringKeys, StringsMap } from 'framework/strings/StringsContext'
import { ModuleName } from 'framework/types/ModuleName'

export const getModuleTitle = (module: ModuleName): keyof StringsMap => {
  switch (module) {
    case ModuleName.CV:
      return 'projectsOrgs.purposeList.change'
    case ModuleName.CE:
      return 'common.purpose.ce.cloudCost'
    case ModuleName.CF:
      return 'common.purpose.cf.feature'
    case ModuleName.CD:
    case ModuleName.CI:
    default:
      return 'projectsOrgs.purposeList.continuous'
  }
}

export const getModulePurpose = (module: ModuleName): keyof StringsMap | undefined => {
  switch (module) {
    case ModuleName.CD:
      return 'common.purpose.cd.delivery'
    case ModuleName.CV:
      return 'common.purpose.cv.verification'
    case ModuleName.CI:
      return 'common.purpose.ci.integration'
    case ModuleName.CE:
      return 'common.purpose.ce.management'
    case ModuleName.CF:
      return 'common.purpose.cf.flags'
  }
}

export const getModuleDescription = (module: ModuleName): StringKeys => {
  switch (module) {
    case ModuleName.CD:
      return 'projectsOrgs.purposeList.descriptionCD'
    case ModuleName.CV:
      return 'projectsOrgs.purposeList.descriptionCV'
    case ModuleName.CI:
      return 'projectsOrgs.purposeList.descriptionCI'
    case ModuleName.CE:
      return 'projectsOrgs.purposeList.descriptionCE'
    case ModuleName.CF:
      return 'projectsOrgs.purposeList.descriptionCF'
  }
  return 'projectsOrgs.blank'
}
