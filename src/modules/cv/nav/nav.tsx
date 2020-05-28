import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { routeContinuousVerification } from '../routes'
import { Menu } from './Menu'
import i18n from './nav.i18n'

export const navContinuousVerification: NavEntry = {
  navId: NavIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'cloud',
    hover: 'cloud',
    selected: 'cloud'
  },
  url: _routeParams => {
    return linkTo(routeContinuousVerification)
  },
  menu: Menu
}
