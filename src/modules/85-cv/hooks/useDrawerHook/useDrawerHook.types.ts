import type { IDrawerProps } from '@blueprintjs/core'

export interface UseDrawerInterface {
  showDrawer: (data?: any) => void
  hideDrawer: () => void
}

export interface UseDrawerPropsInterface {
  drawerOptions?: IDrawerProps
  createHeader?: () => JSX.Element
  createDrawerContent: (props: any) => JSX.Element
}
