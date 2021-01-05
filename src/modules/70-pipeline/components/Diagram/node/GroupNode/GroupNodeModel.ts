import type { DeserializeEvent } from '@projectstorm/react-canvas-core'
import type { IconName } from '@wings-software/uicore'
import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'
import { DiagramType, PortName } from '../../Constants'
import { DefaultNodeModelOptions, DefaultNodeModel } from '../DefaultNodeModel'
import type { DefaultLinkModelGenerics } from '../../link/DefaultLinkModel'
import { DefaultPortModel } from '../../port/DefaultPortModel'

export interface GroupNodeModelOptions
  extends Omit<DefaultNodeModelOptions, 'icon | iconProps | secondaryIconStyle | secondaryIconProps | secondaryIcon '> {
  icons: Array<IconName>
  iconPropsAr?: Array<IconProps>
}

export interface GroupNodeModelGenerics extends DefaultLinkModelGenerics {
  OPTIONS: GroupNodeModelOptions
}

export class GroupNodeModel extends DefaultNodeModel<GroupNodeModelGenerics> {
  constructor(name: string)
  constructor(options?: GroupNodeModelOptions)
  constructor(options: any = {}) {
    if (typeof options === 'string') {
      options = {
        name: options
      }
    }
    super({
      type: DiagramType.GroupNode,
      icons: [],
      iconPropsAr: [],
      ...options
    })
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: PortName.In
      })
    )
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: PortName.Out
      })
    )
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event)
    this.options.icons = [...event.data.icons]
    this.options.iconPropsAr = [...event.data.iconPropsAr]
  }

  serialize(): any {
    return {
      ...super.serialize(),
      icons: this.options.icons,
      iconPropsAr: this.options.iconPropsAr
    }
  }
}
