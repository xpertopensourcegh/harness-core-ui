import { DefaultLayout } from './DefaultLayout/DefaultLayout'
import { BlankLayout } from './EmptyLayout/EmptyLayout'
import { BasicLayout } from './BasicLayout/BasicLayout'

export const Layout = {
  DefaultLayout,
  BasicLayout,
  BlankLayout
}

export type Layout = typeof Layout[keyof typeof Layout]
