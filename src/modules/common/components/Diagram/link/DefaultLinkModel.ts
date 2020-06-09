import {
  LabelModel,
  LinkModel,
  LinkModelGenerics,
  LinkModelListener,
  PortModel,
  PortModelAlignment
} from '@projectstorm/react-diagrams-core'
import { DefaultLabelModel } from '../label/DefaultLabelModel'
import { BezierCurve } from '@projectstorm/geometry'
import type { BaseEntityEvent, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core'
import { DiagramType, Event } from '../Constants'

export interface DefaultLinkModelListener extends LinkModelListener {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void
}

export interface DefaultLinkModelOptions extends BaseModelOptions {
  width?: number
  color?: string
  selectedColor?: string
  curvyness?: number
  type?: string
  testName?: string
}

export interface DefaultLinkModelGenerics extends LinkModelGenerics {
  LISTENER: DefaultLinkModelListener
  OPTIONS: DefaultLinkModelOptions
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelGenerics> {
  constructor(options: DefaultLinkModelOptions = {}) {
    super({
      type: DiagramType.Default,
      width: options.width || 3,
      color: options.color || 'var(--diagram-grey)',
      selectedColor: options.selectedColor || 'var(--diagram-selected)',
      curvyness: 50,
      ...options
    })
  }

  calculateControlOffset(port: PortModel): [number, number] {
    if (port.getOptions().alignment === PortModelAlignment.RIGHT) {
      return [this.options.curvyness || 0, 0]
    } else if (port.getOptions().alignment === PortModelAlignment.LEFT) {
      return [-(this.options.curvyness || 0), 0]
    } else if (port.getOptions().alignment === PortModelAlignment.TOP) {
      return [0, -(this.options.curvyness || 0)]
    }
    return [0, this.options.curvyness || 0]
  }

  getSVGPath(): string | undefined {
    if (this.points.length == 2) {
      const curve = new BezierCurve()
      curve.setSource(this.getFirstPoint().getPosition())
      curve.setTarget(this.getLastPoint().getPosition())
      curve.setSourceControl(this.getFirstPoint().getPosition().clone())
      curve.setTargetControl(this.getLastPoint().getPosition().clone())

      if (this.sourcePort) {
        curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()))
      }

      if (this.targetPort) {
        curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()))
      }
      return curve.getSVGCurve()
    }
  }

  serialize(): any {
    return {
      ...super.serialize(),
      width: this.options.width,
      color: this.options.color,
      curvyness: this.options.curvyness,
      selectedColor: this.options.selectedColor
    }
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event)
    this.options.color = event.data.color
    this.options.width = event.data.width
    this.options.curvyness = event.data.curvyness
    this.options.selectedColor = event.data.selectedColor
  }

  addLabel(label: LabelModel | string): void {
    if (label instanceof LabelModel) {
      return super.addLabel(label)
    }
    const labelOb = new DefaultLabelModel()
    labelOb.setLabel(label)
    return super.addLabel(labelOb)
  }

  setWidth(width: number): void {
    this.options.width = width
    this.fireEvent({ width }, Event.widthChanged)
  }

  setColor(color: string): void {
    this.options.color = color
    this.fireEvent({ color }, Event.colorChanged)
  }
}
