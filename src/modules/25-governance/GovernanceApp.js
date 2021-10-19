import { lazy } from 'react'

// Due to some typing complexity, governance/App is lazily imported
// from a .js file for now
export const GovernanceApp = lazy(() => import('governance/App'))
