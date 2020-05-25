import { DefaultLayout } from './layouts/DefaultLayout/DefaultLayout'
import { BlankLayout } from './layouts/EmptyLayout/EmptyLayout'
import { BasicLayout } from './layouts/BasicLayout/BasicLayout'

export const PageLayout = {
  DefaultLayout,
  BasicLayout,
  BlankLayout
}

export type PageLayout = Readonly<typeof PageLayout[keyof typeof PageLayout]>
