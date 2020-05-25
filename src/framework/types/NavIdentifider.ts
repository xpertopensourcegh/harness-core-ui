/**
 * Nav Identifier represents a unique id for a `NavEntry`. It is used for two purposes:
 *
 * - Make a `NavEntry` unique.
 * - Group Module routes into a `NavEntry`. A Module route must declare it has a
 * `NavIdentifier` to avoid mistake in which developers forget to add their route
 * into a NavEntry, resulting the NavEntry is not highlighted/selected then their
 * route is mounted.
 *
 * If a Module route does not belong to a NavEntry (like Login, Reset Password, etc...), they must declare their `NavIdentifier` is `NavIdentifier.NONE`.
 */
export enum NavIdentifier {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  DEPLOYMENTS = 'DEPLOYMENTS',
  CONTINUOUS_VERIFICATION = 'CONTINUOUS_VERIFICATION',
  SETTINGS = 'SETTINGS',
  USER_PROFILE = 'USER_PROFILE',

  /** Special identifier to denote a route does not belong to a `NavEntry` */
  NONE = 'NONE'
}
