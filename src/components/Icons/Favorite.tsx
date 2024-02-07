import React from 'react'

function Favorite({ size = 23, isFavorite }: { size?: number; isFavorite: boolean; [x: string]: any }) {
  return isFavorite ? (
    <svg width={size} height={size} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.60206 22.3841C5.22427 22.614 4.75595 22.2763 4.85479 21.8452L6.47319 14.7874C6.51434 14.608 6.45356 14.4205 6.315 14.2993L0.882879 9.54846C0.551286 9.25846 0.729585 8.71243 1.16842 8.674L8.33915 8.04608C8.52415 8.02988 8.68494 7.91248 8.7567 7.7412L11.5388 1.10071C11.7102 0.69166 12.2898 0.691659 12.4612 1.10071L15.2433 7.7412C15.3151 7.91248 15.4758 8.02988 15.6608 8.04608L22.8316 8.674C23.2704 8.71243 23.4487 9.25846 23.1171 9.54846L17.685 14.2993C17.5464 14.4205 17.4857 14.608 17.5268 14.7874L19.1452 21.8452C19.2441 22.2763 18.7757 22.614 18.3979 22.3841L12.2599 18.649C12.1003 18.5518 11.8997 18.5518 11.7401 18.649L5.60206 22.3841Z"
        fill="url(#paint0_linear_2716_12528)"
        fillOpacity="0.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2716_12528"
          x1="-1.27885e-08"
          y1="14.3049"
          x2="30.7368"
          y2="14.3049"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.56022 18.0618C7.45944 18.4927 7.9268 18.8325 8.30558 18.6037L11.7401 16.5293C11.8998 16.4329 12.0999 16.4334 12.2591 16.5305L15.6906 18.6251C16.0693 18.8563 16.539 18.5165 16.438 18.0845L15.5183 14.1525C15.4763 13.9728 15.5367 13.7845 15.6754 13.6628L18.7114 10.9996C19.0421 10.7095 18.864 10.1646 18.4259 10.1257L14.4304 9.77138C14.2457 9.75499 14.0851 9.63764 14.0135 9.46654L12.4598 5.75802C12.2886 5.34943 11.7099 5.34881 11.5379 5.75704L9.98686 9.43719C9.91496 9.60779 9.75468 9.7247 9.57028 9.74105L5.57413 10.0954C5.13595 10.1343 4.95788 10.6793 5.28858 10.9694L8.32456 13.6325C8.46333 13.7542 8.52374 13.9425 8.4817 14.1223L7.56022 18.0618ZM5.60206 22.3841C5.22427 22.614 4.75595 22.2763 4.85479 21.8452L6.47319 14.7874C6.51434 14.608 6.45357 14.4205 6.315 14.2993L0.882878 9.54846C0.551285 9.25846 0.729585 8.71243 1.16842 8.674L8.33915 8.04608C8.52415 8.02988 8.68494 7.91248 8.7567 7.7412L11.5388 1.10071C11.7102 0.69166 12.2898 0.691659 12.4612 1.10071L15.2433 7.7412C15.3151 7.91248 15.4758 8.02988 15.6608 8.04608L22.8316 8.674C23.2704 8.71243 23.4487 9.25846 23.1171 9.54846L17.685 14.2993C17.5464 14.4205 17.4857 14.608 17.5268 14.7874L19.1452 21.8452C19.2441 22.2763 18.7757 22.614 18.3979 22.3841L12.2599 18.649C12.1003 18.5518 11.8997 18.5518 11.7401 18.649L5.60206 22.3841Z"
        fill="url(#paint0_linear_2716_12525)"
        fillOpacity="0.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2716_12525"
          x1="-1.27885e-08"
          y1="14.3049"
          x2="30.7368"
          y2="14.3049"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Favorite
