import styled from 'styled-components'
import { Icon } from 'types/traderIncentives'

export const LinkIcon: Icon = ({ width = 25, height = 25, ...props }: any) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={width} height={height} {...props}>
      <path
        fill="url(#a)"
        d="M8.334 6.25A2.083 2.083 0 0 0 6.25 8.333v8.334a2.083 2.083 0 0 0 2.084 2.083h8.333a2.083 2.083 0 0 0 2.083-2.083v-2.084a1.042 1.042 0 0 1 2.084 0v2.084a4.167 4.167 0 0 1-4.167 4.166H8.334a4.167 4.167 0 0 1-4.167-4.166V8.333a4.167 4.167 0 0 1 4.167-4.166h2.083a1.042 1.042 0 0 1 0 2.083H8.334Zm6.25 0a1.042 1.042 0 1 1 0-2.083h5.208a1.042 1.042 0 0 1 1.042 1.041v5.209a1.042 1.042 0 0 1-2.084 0V7.723l-3.429 3.431a1.043 1.043 0 0 1-1.475-1.475l3.431-3.429h-2.693Z"
      />
      <defs>
        <linearGradient id="a" x1={12.5} x2={12.5} y1={4.167} y2={20.833} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0420" />
          <stop offset={1} stopColor="#BD2738" />
        </linearGradient>
      </defs>
    </svg>
  )
}
