import React, { FC, useEffect, useMemo, useState } from 'react'
import { AvatarGroup, AvatarGroupProps, Button, ButtonVariation, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { Variation } from 'services/cf'
import { VariationWithIcon } from '@cf/components/VariationWithIcon/VariationWithIcon'
import ItemVariationDialog, { ItemVariationDialogProps } from './ItemVariationDialog'
import css from './ServeVariationToItem.module.scss'

export interface ServeVariationToItemProps {
  dialogTitle: ItemVariationDialogProps['title']
  itemLabel: ItemVariationDialogProps['itemLabel']
  itemPlaceholder: ItemVariationDialogProps['itemPlaceholder']
  itemFieldName: string
  specPrefix: string
  serveItemString: string
  serveItemsString: string
  clearField: (fieldName: string) => void
  setField: (fieldName: string, value: unknown) => void
  items: ItemVariationDialogProps['items']
  selectedItems: ItemVariationDialogProps['selectedItems']
  variations: Variation[]
  selectedVariation?: Variation
  selectedVariationIndex?: number
}

const ServeVariationToItem: FC<ServeVariationToItemProps> = ({
  dialogTitle,
  itemLabel,
  itemPlaceholder,
  itemFieldName,
  specPrefix,
  serveItemString,
  serveItemsString,
  variations,
  selectedVariation,
  selectedVariationIndex,
  items,
  selectedItems,
  setField,
  clearField
}) => {
  const { getString } = useStrings()
  const [itemVariationDialogOpen, setItemVariationDialogOpen] = useState<boolean>(false)

  const avatars = useMemo<AvatarGroupProps['avatars']>(
    () => selectedItems.map(({ name, identifier }) => ({ name, id: identifier })),
    [selectedItems]
  )

  const handleIncludeChange: ItemVariationDialogProps['onChange'] = (newItems, newVariation) => {
    setField(`${specPrefix}.variation`, newVariation.identifier)
    setField(
      `${specPrefix}.${itemFieldName}`,
      newItems.map(({ identifier }) => identifier)
    )
  }

  const handleCloseDialog: ItemVariationDialogProps['closeDialog'] = () => {
    setItemVariationDialogOpen(false)
  }

  useEffect(
    () => () => {
      clearField(`${specPrefix}.variation`)
      clearField(`${specPrefix}.${itemFieldName}`)
    },
    []
  )

  return (
    <>
      {selectedVariation && typeof selectedVariationIndex === 'number' && selectedItems.length && (
        <Layout.Vertical spacing="medium" border={{ bottom: true }} padding={{ bottom: 'medium' }}>
          <p className={css.variationParagraph}>
            {getString('cf.pipeline.flagConfiguration.serve')}
            <VariationWithIcon
              textStyle={{ fontWeight: 'bold' }}
              variation={selectedVariation}
              index={selectedVariationIndex}
            />
            {selectedItems.length > 1 ? serveItemsString : serveItemString}:
          </p>
          <div className={css.avatars}>
            <AvatarGroup avatars={avatars} restrictLengthTo={15} />
            <Text>({selectedItems.length})</Text>
          </div>
        </Layout.Vertical>
      )}

      <span>
        <Button
          className={css.addButton}
          variation={ButtonVariation.LINK}
          text={dialogTitle}
          onClick={e => {
            e.preventDefault()
            setItemVariationDialogOpen(true)
          }}
        />
      </span>

      <ItemVariationDialog
        title={dialogTitle}
        itemPlaceholder={itemPlaceholder}
        itemLabel={itemLabel}
        isOpen={itemVariationDialogOpen}
        items={items}
        variations={variations}
        closeDialog={handleCloseDialog}
        selectedVariation={selectedVariation}
        selectedItems={selectedItems}
        onChange={handleIncludeChange}
      />
    </>
  )
}

export default ServeVariationToItem
