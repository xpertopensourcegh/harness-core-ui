import React, { useState } from 'react'
import { Button, Color, Container, Layout } from '@wings-software/uicore'
import css from './VerticalNav.module.scss'

interface VerticalNavSubComponents {
  Option: React.FC<{ id: any; name: string; component: React.FC<any> }>
}

const Option: React.FC<{ id: any; name: string; component: React.FC<any> }> = () => <></>
const VerticalNav: React.FC<{ initialTab: string; sharedProps?: any }> & VerticalNavSubComponents = ({
  initialTab,
  children: rawChildren,
  sharedProps = {}
}) => {
  const [selected, setSelected] = useState<string>(initialTab)
  const children = React.Children.toArray(rawChildren)

  const selectedChild = children.find((c: any) => c.props.id === selected) as JSX.Element
  const Comp = selectedChild.props.component

  return (
    <Layout.Horizontal height="100%" width="100%">
      <Layout.Vertical
        height="100%"
        background={Color.GREY_200}
        spacing="medium"
        padding={{ top: 'xxxlarge', bottom: 'xxxlarge', left: 'xlarge', right: 'xlarge' }}
      >
        {children.map((child: any) => {
          const { id, name } = child.props
          return (
            <Button
              large
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              className={css.navOption}
              key={id}
              onClick={() => setSelected(id)}
              minimal={selected !== id}
              intent={selected === id ? 'primary' : undefined}
            >
              {name}
            </Button>
          )
        })}
      </Layout.Vertical>
      <Container width="100%">
        <Comp {...sharedProps} />
      </Container>
    </Layout.Horizontal>
  )
}

VerticalNav.Option = Option

export default VerticalNav
