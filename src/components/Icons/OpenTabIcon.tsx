import React from 'react'
import styled from 'styled-components'

const StyledOpenTabIcon = styled.svg`
  path {
    transition: all 0.3s ease-in-out;
  }
`

const OpenTabIcon = ({ isHovering }: { isHovering: boolean }) => (
  <StyledOpenTabIcon xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none">
    <path
      fill={isHovering ? '#FF0420' : '#b0bbce'}
      d="M8.333 6.25A2.083 2.083 0 0 0 6.25 8.333v8.334a2.083 2.083 0 0 0 2.083 2.083h8.334a2.083 2.083 0 0 0 2.083-2.083v-2.084a1.041 1.041 0 1 1 2.083 0v2.084a4.167 4.167 0 0 1-4.166 4.166H8.333a4.166 4.166 0 0 1-4.166-4.166V8.333a4.167 4.167 0 0 1 4.166-4.166h2.084a1.042 1.042 0 1 1 0 2.083H8.333Zm6.25 0a1.042 1.042 0 0 1 0-2.083h5.209a1.042 1.042 0 0 1 1.041 1.041v5.209a1.041 1.041 0 1 1-2.083 0V7.723l-3.43 3.431a1.044 1.044 0 0 1-1.474-1.475l3.431-3.429h-2.694Z"
    />
  </StyledOpenTabIcon>
)

export default OpenTabIcon
