import CustomPagination from 'components/CustomPagination'

export default function Footer({
  pageCount,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  initRowPage,
  finalRowPage,
  totalRows,
}: {
  pageCount: number
  initRowPage: number
  finalRowPage: number
  totalRows: number
  currentPage: number
  onPageChange: (value: number) => any
  rowsPerPage: number
  onRowsPerPageChange: (...args: any) => any
}) {
  return (
    <>
      <CustomPagination
        currentPage={currentPage}
        pageCount={pageCount}
        initRowPage={initRowPage}
        finalRowPage={finalRowPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  )
}
