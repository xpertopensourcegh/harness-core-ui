import { map } from 'lodash'
import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams-core'
import { DefaultPortModel } from '../port/DefaultPortModel'
import type { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core'
import type { IconName } from '@wings-software/uikit'
import { DiagramType } from '../Constants'
import i18n from '../Diagram.i18n'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name: string
  customNodeStyle?: React.CSSProperties
  width?: number
  height?: number
  icon?: IconName
  allowAdd?: boolean
  iconProps?: IconProps
  canDelete?: boolean
  secondaryIcon?: IconName
}

export interface DefaultNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: DefaultNodeModelOptions
}

export class DefaultNodeModel extends NodeModel<DefaultNodeModelGenerics> {
  protected portsIn: DefaultPortModel[]
  protected portsOut: DefaultPortModel[]

  constructor(name: string, color: string, icon: IconName)
  constructor(options?: DefaultNodeModelOptions)
  constructor(options: any = {}) {
    if (typeof options === 'string') {
      options = {
        name: options
      }
    }
    super({
      type: DiagramType.Default,
      name: i18n.Untitled,
      icon: 'add',
      allowAdd: false,
      iconProps: {},
      canDelete: true,
      secondaryIcon: 'command-echo',
      customNodeStyle: {},
      width: 64,
      height: 64,
      ...options
    })
    this.portsOut = []
    this.portsIn = []
  }

  doClone(lookupTable: {}, clone: any): void {
    clone.portsIn = []
    clone.portsOut = []
    super.doClone(lookupTable, clone)
  }

  removePort(port: DefaultPortModel): void {
    super.removePort(port)
    if (port.getOptions().in) {
      this.portsIn.splice(this.portsIn.indexOf(port), 1)
    } else {
      this.portsOut.splice(this.portsOut.indexOf(port), 1)
    }
  }

  addPort<T extends DefaultPortModel>(port: T): T {
    super.addPort(port)
    if (port.getOptions().in) {
      if (this.portsIn.indexOf(port) === -1) {
        this.portsIn.push(port)
      }
    } else {
      if (this.portsOut.indexOf(port) === -1) {
        this.portsOut.push(port)
      }
    }
    return port
  }

  addInPort(label: string, after = true): DefaultPortModel {
    const port = new DefaultPortModel({
      in: true,
      name: label,
      label: label,
      alignment: PortModelAlignment.LEFT
    })
    if (!after) {
      this.portsIn.splice(0, 0, port)
    }
    return this.addPort(port)
  }

  addOutPort(label: string, after = true): DefaultPortModel {
    const port = new DefaultPortModel({
      in: false,
      name: label,
      label: label,
      alignment: PortModelAlignment.RIGHT
    })
    if (!after) {
      this.portsOut.splice(0, 0, port)
    }
    return this.addPort(port)
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event)
    this.options.name = event.data.name
    this.options.customNodeStyle = { ...event.data.customNodeStyle }
    this.options.icon = event.data.icon
    this.options.secondaryIcon = event.data.secondaryIcon
    this.portsIn = map(event.data.portsInOrder, id => {
      return this.getPortFromID(id)
    }) as DefaultPortModel[]
    this.portsOut = map(event.data.portsOutOrder, id => {
      return this.getPortFromID(id)
    }) as DefaultPortModel[]
  }

  serialize(): any {
    return {
      ...super.serialize(),
      name: this.options.name,
      customNodeStyle: { ...this.options.customNodeStyle },
      icon: this.options.icon,
      secondaryIcon: this.options.secondaryIcon,
      portsInOrder: map(this.portsIn, port => {
        return port.getID()
      }),
      portsOutOrder: map(this.portsOut, port => {
        return port.getID()
      })
    }
  }

  getInPorts(): DefaultPortModel[] {
    return this.portsIn
  }

  getOutPorts(): DefaultPortModel[] {
    return this.portsOut
  }
}

export interface DefaultNodeEvent {
  entity: DefaultNodeModel
  isSelected: boolean
  callback: () => void
  firing: boolean
  stopPropagation: () => void
}
