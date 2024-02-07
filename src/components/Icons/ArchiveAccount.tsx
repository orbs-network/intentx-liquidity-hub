import React from 'react'

function ArchiveAccount({ isHovering }: { isHovering?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path
        fill={isHovering ? '#BD2738' : '#748090'}
        d="M7 10.5l2.333-2.333-.816-.817-.934.933v-2.45H6.417v2.45l-.934-.933-.816.817L7 10.5zM2.917 4.667v6.416h8.166V4.667H2.917zm0 7.583c-.321 0-.596-.114-.824-.342a1.126 1.126 0 01-.343-.825V3.806a1.148 1.148 0 01.263-.744l.729-.89c.107-.135.24-.24.4-.313.16-.073.328-.11.504-.109h6.708c.175 0 .343.037.504.11.16.073.294.177.4.313l.73.89a1.143 1.143 0 01.262.743v7.277c0 .321-.114.596-.342.825a1.12 1.12 0 01-.825.342H2.917zM3.15 3.5h7.7l-.496-.583H3.646L3.15 3.5z"
      ></path>
    </svg>
  )
}

export default ArchiveAccount
