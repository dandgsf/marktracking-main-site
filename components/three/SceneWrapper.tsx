'use client'

import dynamic from 'next/dynamic'

const ScrollDrivenScene = dynamic(
  () => import('@/components/three/ScrollDrivenScene'),
  { ssr: false }
)

export default function SceneWrapper() {
  return <ScrollDrivenScene />
}
