'use client'

import dynamic from 'next/dynamic'

export const LuminousPearl = dynamic(() => import('./LuminousPearl'), { ssr: false })
export const FloatingMetricCards = dynamic(() => import('./FloatingMetricCards'), { ssr: false })
export const DataRibbon = dynamic(() => import('./DataRibbon'), { ssr: false })
export const TopographicTerrain = dynamic(() => import('./TopographicTerrain'), { ssr: false })
export const CrystalPrism = dynamic(() => import('./CrystalPrism'), { ssr: false })
