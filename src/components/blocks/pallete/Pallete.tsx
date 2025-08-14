import { useState } from 'react'
import './pallete.scss'
import { Icon } from '../../elements/icon/Icon'
import { useColor } from '../../../contexts/ColorContext'

export const Pallete = () => {
  const [openedPallete, setOpenedPallete] = useState<boolean>(false)
  const { selectedColor, setSelectedColor, colors } = useColor()

  return <div className={`pallete ${openedPallete ? 'opened' : ''}`} onMouseEnter={() => setOpenedPallete(true)} onMouseLeave={() => setOpenedPallete(false)}>
    {!openedPallete && <div className="picked-color" style={{ backgroundColor: selectedColor }}>
    </div>}
    {openedPallete && <div className="pallete-content">
      {colors.map((color) => (
        <div key={color} className={`color ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} onClick={() => setSelectedColor(color)}>
          {selectedColor === color && <Icon name="check" type="fas" color={color === '#FFFFFF' ? 'black' : 'white'} />}
        </div>
      ))}
      <div className="color-picker-container">
        <Icon name="plus" type="fas" color="white" />
      </div>
    </div>}
  </div>
}
