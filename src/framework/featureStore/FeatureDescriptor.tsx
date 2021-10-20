import React from 'react'
import { String } from 'framework/strings'

export const FeatureDescriptor: { [key: string]: React.ReactElement } = {
  MULTIPLE_ORGANIZATIONS: <String stringID="authSettings.multipleOrganizations" />,
  MULTIPLE_PROJECTS: <String stringID="authSettings.multipleProjects" />,
  SECRET_MANAGERS: <String stringID="secretManagers" />,
  SAML_SUPPORT: <String stringID="authSettings.samlSupport" />,
  OAUTH_SUPPORT: <String stringID="authSettings.oauthSupport" />,
  TWO_FACTOR_AUTH_SUPPORT: <String stringID="authSettings.twoFactorAuthSupport" />
}
