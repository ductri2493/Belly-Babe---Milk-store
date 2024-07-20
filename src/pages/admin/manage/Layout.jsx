import { Button, Input, Pagination } from 'antd';
import ControlTable from '../../../components/ControlTable';

const Layout = ({
  name,
  searchQuery,
  setSearchQuery,
  handleSearch,
  deleteMultiple,
  data,
  currentPage,
  pageSize,
  handlePageChange,
  handleOpenModal,
  handleRefresh,
  isBtn = true,
  recycleBin = true,
  columns,
  dataSource,
  onRow,
  rowKey,
  rowSelection,
  newBtn,
  newBtnHeader,
}) => {
  return (
    <div className='container-xxl flex-grow-1 container-p-y'>
      <h4 className='font-bold py-3 mb-4 absolute top-5 z-10'>
        <span className='text-muted fw-light'>Quản Lí /</span> {name}
      </h4>
      {newBtnHeader && (
        <div className='flex gap-8 justify-normal items-center mb-2'>
          {newBtnHeader}
        </div>
      )}
      <div className='card'>
        <div className='card-header d-flex items-center justify-between'>
          <h5 className='mb-0'>{name}</h5>
          <div className='input-group w-2/5'>
            <Input
              type='search'
              className='form-control'
              placeholder='Tìm kiếm...'
              aria-label='Search'
              name='search-form'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className='btn-primary h-[34px]'
              type='button'
              onClick={handleSearch}
            >
              <i className='bx bx-search fs-3 lh-0' />
            </Button>
          </div>
          <div className='float-right flex gap-2'>
            {recycleBin && (
              <Button type='button' className='' onClick={deleteMultiple}>
                <i className='icon-trash'></i>
                Thùng rác
              </Button>
            )}
            {isBtn && (
              <Button
                className='btn-primary flex'
                type='button'
                onClick={handleOpenModal}
              >
                Tạo mới {name.toLowerCase()}
              </Button>
            )}
            <Button type='default' size='middle' onClick={handleRefresh}>
              Làm mới
            </Button>
          </div>
        </div>
        {newBtn && <div className='container flex gap-4 mb-4'>{newBtn}</div>}
        <div className='table-responsive text-nowrap'>
          {/* <table className='table'>
            <thead>
              <tr>{tableHeader}</tr>
            </thead>

            <tbody className='table-border-bottom-0'>{children}</tbody>
          </table> */}
          <ControlTable
            columns={columns}
            dataSource={dataSource}
            onRow={onRow}
            rowKey={rowKey}
            rowSelection={rowSelection}
          />
        </div>
        <div className='d-flex justify-content-end p-3'>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <hr className='my-5' />
    </div>
  );
};

export default Layout;
