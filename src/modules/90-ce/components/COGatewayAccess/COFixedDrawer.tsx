import React from 'react'

interface COFixedDrawerProps {
  content: JSX.Element
}
const COFixedDrawer: React.FC<COFixedDrawerProps> = props => {
  return (
    <div
      style={{
        top: '95px',
        boxShadow: 'rgb(40 41 61 / 4%) 0px 2px 8px, rgb(96 97 112 / 16%) 0px 16px 24px',
        borderRadius: 'var(--spacing-medium)',
        width: '392px',
        bottom: 0,
        right: 0,
        position: 'fixed',
        zIndex: 20,
        backgroundColor: 'var(--white)'
      }}
    >
      {props.content}
    </div>
  )
}

export default COFixedDrawer
