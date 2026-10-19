import { useState } from 'react'
import { products } from '../data/products'
import { Campaign } from './home/Campaign'
import { ColorLab } from './home/ColorLab'
import { Featured } from './home/Featured'
import { FinalCta } from './home/FinalCta'
import { Hero } from './home/Hero'
import { Story } from './home/Story'

/**
 * Homepage choreography: the preserved hero, then a calm editorial story, a product
 * line-up, the interactive colour lab, a campaign spread and the closing call to action.
 * Sections alternate between dark and light so each dramatic moment has room around it.
 */
export default function Home() {
  const [index, setIndex] = useState(0)
  return (
    <>
      <Hero index={index} onIndexChange={setIndex} />
      <Story fromColor={products[index].theme.bgTo} />
      <Featured />
      <ColorLab />
      <Campaign />
      <FinalCta />
    </>
  )
}
