import type { IconName } from '@wings-software/uicore'
import { ModuleName } from 'framework/types/ModuleName'
import i18n from '@projects-orgs/pages/projects/ProjectsPage.i18n'

export const getModuleIcon = (module: ModuleName): IconName => {
  switch (module) {
    case ModuleName.CD:
      return 'cd-main'
    case ModuleName.CV:
      return 'cv-main'
    case ModuleName.CI:
      return 'ci-main'
    case ModuleName.CE:
      return 'ce-main'
    case ModuleName.CF:
      return 'cf-main'
  }
  return 'nav-project'
}

export const getModulePurpose = (module: ModuleName): string => {
  switch (module) {
    case ModuleName.CD:
      return 'Delivery'
    case ModuleName.CV:
      return 'Verification'
    case ModuleName.CI:
      return 'Integration'
    case ModuleName.CE:
      return 'Efficiency'
    case ModuleName.CF:
      return 'Features'
  }
  return ''
}

export const getModuleDescription = (module: ModuleName): string => {
  switch (module) {
    case ModuleName.CD:
      return i18n.newProjectWizard.purposeList.descriptionCD
    case ModuleName.CV:
      return i18n.newProjectWizard.purposeList.descriptionCV
    case ModuleName.CI:
      return i18n.newProjectWizard.purposeList.descriptionCI
    case ModuleName.CE:
      return i18n.newProjectWizard.purposeList.descriptionCE
    case ModuleName.CF:
      return i18n.newProjectWizard.purposeList.descriptionCF
  }
  return ''
}
