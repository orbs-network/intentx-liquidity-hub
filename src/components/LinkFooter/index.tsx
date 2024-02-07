import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

interface Option {
  image: string
  link: string
}

interface LinkFooterProps {
  option: Option
}

const Buttons = styled.a`
  border: 1px solid gray;
  padding: 5px;
  display: flex;
  justify-content: center;
  border-radius: 8px;

  transition: background-color 0.3s linear;

  &:hover {
    background: ${({ theme }) => theme.bgCustom2};
  }
`

export default function LinkFooter({ option }: LinkFooterProps) {
  return (
    <Buttons href={option.link} target="_blank">
      <Image unoptimized={true} src={option.image} alt="Link Image" width={20} height={20} />
    </Buttons>
  )

  
}
