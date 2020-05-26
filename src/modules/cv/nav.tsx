import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { routeContinuousVerification } from './routes'
import { Menu } from './menu/Menu'
import i18n from './module.i18n'

export const navContinuousVerification: NavEntry = {
  navId: NavIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'cloud',
    hover: 'cloud',
    selected: 'cloud'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(routeContinuousVerification)
  },
  menu: Menu
}
