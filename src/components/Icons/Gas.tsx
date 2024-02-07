import React from 'react'

export default function Gas({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '1em'}
      height={height || '1em'}
      viewBox={`0 0 ${width || 20} ${height || 18}`}
      fill="none"
      {...rest}
    >
      <path
        d="M18.8281 5.94219L17.3172 4.43281C17.1999 4.31554 17.0409 4.24965 16.875 4.24965C16.7091 4.24965 16.5501 4.31554 16.4328 4.43281C16.3155 4.55009 16.2497 4.70915 16.2497 4.875C16.2497 5.04085 16.3155 5.19991 16.4328 5.31719L17.9422 6.82812C18.0588 6.94486 18.1245 7.10297 18.125 7.26797V13.625C18.125 13.7908 18.0592 13.9497 17.9419 14.0669C17.8247 14.1842 17.6658 14.25 17.5 14.25C17.3342 14.25 17.1753 14.1842 17.0581 14.0669C16.9408 13.9497 16.875 13.7908 16.875 13.625V10.5C16.875 10.0027 16.6775 9.52581 16.3258 9.17417C15.9742 8.82254 15.4973 8.625 15 8.625H13.75V4.875C13.75 4.37772 13.5525 3.90081 13.2008 3.54917C12.8492 3.19754 12.3723 3 11.875 3H5.625C5.12772 3 4.65081 3.19754 4.29917 3.54917C3.94754 3.90081 3.75 4.37772 3.75 4.875V16.75H2.5C2.33424 16.75 2.17527 16.8158 2.05806 16.9331C1.94085 17.0503 1.875 17.2092 1.875 17.375C1.875 17.5408 1.94085 17.6997 2.05806 17.8169C2.17527 17.9342 2.33424 18 2.5 18H15C15.1658 18 15.3247 17.9342 15.4419 17.8169C15.5592 17.6997 15.625 17.5408 15.625 17.375C15.625 17.2092 15.5592 17.0503 15.4419 16.9331C15.3247 16.8158 15.1658 16.75 15 16.75H13.75V9.875H15C15.1658 9.875 15.3247 9.94085 15.4419 10.0581C15.5592 10.1753 15.625 10.3342 15.625 10.5V13.625C15.625 14.1223 15.8225 14.5992 16.1742 14.9508C16.5258 15.3025 17.0027 15.5 17.5 15.5C17.9973 15.5 18.4742 15.3025 18.8258 14.9508C19.1775 14.5992 19.375 14.1223 19.375 13.625V7.26797C19.3759 7.02181 19.3281 6.77791 19.2342 6.55036C19.1404 6.3228 19.0023 6.1161 18.8281 5.94219ZM5 16.75V4.875C5 4.70924 5.06585 4.55027 5.18306 4.43306C5.30027 4.31585 5.45924 4.25 5.625 4.25H11.875C12.0408 4.25 12.1997 4.31585 12.3169 4.43306C12.4342 4.55027 12.5 4.70924 12.5 4.875V16.75H5ZM11.25 9.25C11.25 9.41576 11.1842 9.57473 11.0669 9.69194C10.9497 9.80915 10.7908 9.875 10.625 9.875H6.875C6.70924 9.875 6.55027 9.80915 6.43306 9.69194C6.31585 9.57473 6.25 9.41576 6.25 9.25C6.25 9.08424 6.31585 8.92527 6.43306 8.80806C6.55027 8.69085 6.70924 8.625 6.875 8.625H10.625C10.7908 8.625 10.9497 8.69085 11.0669 8.80806C11.1842 8.92527 11.25 9.08424 11.25 9.25Z"
        fill="#BC2738"
      />
    </svg>
  )
}
