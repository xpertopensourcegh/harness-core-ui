import type { IconName } from '@wings-software/uicore'

export enum SourceCodeTypes {
  BITBUCKET = 'BITBUCKET',
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  AZURE_DEVOPS = 'AZURE_DEVOPS',
  AWS_CODECOMMIT = 'AWS_CODECOMMIT'
}

export const getIconBySCM = (item: SourceCodeTypes): IconName => {
  switch (item) {
    case SourceCodeTypes.BITBUCKET:
      return 'bitbucket-blue'
    case SourceCodeTypes.GITHUB:
      return 'github'
    case SourceCodeTypes.GITLAB:
      return 'service-gotlab'
    case SourceCodeTypes.AWS_CODECOMMIT:
      return 'service-aws-code-deploy'
    default:
      return 'bitbucket'
  }
}
