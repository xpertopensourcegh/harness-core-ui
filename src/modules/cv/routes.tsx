import { RouteEntry } from 'framework'
import { RouteEntry } from 'framework/routing/RouteTypes'
import { CVHomePage } from './pages/home/CVHomePage'

export const Routes: Readonly<KVO<RouteInfo>> = Object.assign({
  CVHomePage: {
    path: '/account/:accountId/continuous-efficiency/dashboard',
    title: 'Continous Efficiency',
    pageId: 'ce-dashboard',
    page: CVHomePage,
    nav: CVNavigator,
    url: ({ accountId }) => `/account/${accountId}/continuous-efficiency/dashboard`
  },
  CVSetup: {
    path: '/account/:accountId/continuous-efficiency/setup',
    title: 'Continous Efficiency',
    pageId: 'ce-dashboard',
    page: CVHomePage,
    nav: CVNavigator,
    url: ({ accountId }) => `/account/${accountId}/continuous-efficiency/dashboard`
  }
})

const CVNavigator: React.FC = () => {
  ;<ul>
    <li>
      <NavItem link={CVSetup.url({ accountId })} className={'selected'}></NavItem>
    </li>
  </ul>
}
