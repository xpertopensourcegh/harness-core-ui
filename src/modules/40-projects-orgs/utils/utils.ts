import type { IconName } from '@wings-software/uikit'
import { ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import i18n from './utils.i18n'

const allModules: Required<Project>['modules'] = ['CD', 'CV', 'CI', 'CE', 'CF']

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
      return 'Deployment'
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
      return i18n.descriptionCD
    case ModuleName.CV:
      return i18n.descriptionCV
    case ModuleName.CI:
      return i18n.descriptionCI
    case ModuleName.CE:
      return i18n.descriptionCE
    case ModuleName.CF:
      return i18n.descriptionCF
  }
  return ''
}

export const getEnableModules = (modules: Required<Project>['modules']): Required<Project>['modules'] => {
  return allModules.filter(module => !modules.includes(module))
}
