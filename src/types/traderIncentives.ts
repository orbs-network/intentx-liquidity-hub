import { FC, SVGProps } from 'react'

export type Icon = FC<SVGProps<SVGSVGElement>>

export interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  btnFunc?: () => void
  url?: string
  animated?: boolean
}
