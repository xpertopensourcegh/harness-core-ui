import React from 'react'
import { Heading, Text, Icon, IconName, Container } from '@wings-software/uikit'
import { Drawer, IDrawerProps, Position } from '@blueprintjs/core'
import i18n from './BeginWizardDrawer.i18n'
import css from './BeginWizardDrawer.module.scss'

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: true,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true,
  size: 450
}

interface ItemMap {
  label: string
  value: string
  iconName: string
  iconSize: number
}

export interface CategoryItemsMapInterface {
  [category: string]: {
    label: string
    value: string
    items: ItemMap[]
  }
}

export interface ItemClickedInterface {
  category: string
  item: string
}

interface BeginWizardDrawerProps {
  categoryItemsMap: CategoryItemsMapInterface
  onHide: () => void
  onItemClick: (val: ItemClickedInterface) => void
}

export default function BeginWizardDrawer(props: BeginWizardDrawerProps): JSX.Element {
  const { categoryItemsMap, onHide, onItemClick } = props
  const handleItemClick = (val: ItemClickedInterface): void => {
    onHide()
    onItemClick(val)
  }

  return (
    <Drawer {...DrawerProps} onClose={onHide} className={css.main}>
      <div>
        <Heading className={css.title} margin={{ bottom: 'small' }} level={2}>
          {i18n.title}
        </Heading>
        <Text margin={{ bottom: 'xlarge' }}>{i18n.explanationText}</Text>
        {Object.values(categoryItemsMap).map(category => {
          return (
            <>
              <Heading margin={{ bottom: 'small' }} font={{ weight: 'semi-bold' }} level={3}>
                {category.label}
              </Heading>
              <div className={css.itemsContainer}>
                {category.items.map(item => (
                  <Container
                    className={css.item}
                    padding="small"
                    key={item.value}
                    onClick={() => handleItemClick({ category: category.value, item: item.value })}
                  >
                    <div className={css.itemBox}>
                      <Icon name={item.iconName as IconName} size={item.iconSize} />
                    </div>
                    <Text className={css.itemName} font={{ size: 'small', align: 'center' }}>
                      {item.label}
                    </Text>
                  </Container>
                ))}
              </div>
            </>
          )
        })}
      </div>
    </Drawer>
  )
}
