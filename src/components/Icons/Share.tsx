import React from 'react'

export default function Share({
  size = 16,
  color = 'white',
  ...rest
}: {
  size?: number
  color?: string
  [x: string]: any
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.498 2.66673H6.80733C6.93402 2.66677 7.05596 2.7149 7.14853 2.80138C7.2411 2.88787 7.29738 3.00627 7.30602 3.13265C7.31465 3.25904 7.27499 3.384 7.19505 3.48227C7.1151 3.58054 7.00083 3.6448 6.87533 3.66207L6.80733 3.66673H4.498C4.11802 3.66668 3.75219 3.81083 3.47438 4.07007C3.19658 4.32931 3.02751 4.68433 3.00133 5.0634L2.998 5.16673V11.5001C2.99812 11.88 3.14244 12.2458 3.40181 12.5235C3.66117 12.8012 4.01626 12.9701 4.39533 12.9961L4.498 13.0001H10.8313C11.2115 13.0003 11.5776 12.8561 11.8556 12.5967C12.1336 12.3373 12.3026 11.982 12.3287 11.6027L12.332 11.5001V11.1681C12.332 11.0414 12.3802 10.9194 12.4667 10.8269C12.5531 10.7343 12.6715 10.678 12.7979 10.6694C12.9243 10.6607 13.0493 10.7004 13.1475 10.7804C13.2458 10.8603 13.3101 10.9746 13.3273 11.1001L13.332 11.1681V11.5001C13.3319 12.1401 13.0863 12.7556 12.6459 13.22C12.2055 13.6843 11.6038 13.9621 10.9647 13.9961L10.8313 14.0001H4.498C3.85789 14.0001 3.24215 13.7546 2.77766 13.3142C2.31316 12.8738 2.0353 12.2719 2.00133 11.6327L1.998 11.4994V5.16607C1.99811 4.52618 2.24358 3.9107 2.68386 3.44637C3.12413 2.98203 3.7257 2.70419 4.36467 2.67007L4.498 2.66673ZM9.66734 4.34673V2.50007C9.66728 2.4081 9.69259 2.31789 9.74048 2.23938C9.78837 2.16086 9.857 2.09708 9.9388 2.05504C10.0206 2.01301 10.1124 1.99434 10.2041 2.00111C10.2958 2.00788 10.3839 2.03981 10.4587 2.0934L10.5133 2.13873L14.51 5.97207C14.6967 6.1514 14.7133 6.43873 14.5607 6.6374L14.51 6.69407L10.5133 10.5287C10.447 10.5925 10.3643 10.6367 10.2745 10.6564C10.1846 10.6762 10.091 10.6708 10.0041 10.6408C9.91707 10.6108 9.84004 10.5574 9.78146 10.4865C9.72287 10.4156 9.685 10.3298 9.672 10.2387L9.66734 10.1674V8.35073L9.43867 8.37073C7.83867 8.5374 6.30533 9.25807 4.82867 10.5441C4.482 10.8461 3.94733 10.5607 4.004 10.1054C4.44733 6.55873 6.302 4.60473 9.468 4.3594L9.668 4.34607L9.66734 4.34673ZM10.6673 3.67207V4.8334C10.6673 4.96601 10.6147 5.09319 10.5209 5.18695C10.4271 5.28072 10.2999 5.3334 10.1673 5.3334C7.58534 5.3334 5.98467 6.45073 5.29333 8.7714L5.24 8.95673L5.47533 8.79873C6.966 7.82473 8.53267 7.3334 10.1667 7.3334C10.2876 7.33343 10.4044 7.37728 10.4955 7.45683C10.5866 7.53638 10.6457 7.64624 10.662 7.76607L10.6667 7.8334V8.9954L13.4413 6.3334L10.668 3.67207H10.6673Z"
        fill={color}
        fillOpacity="0.7"
      />
    </svg>
  )
}