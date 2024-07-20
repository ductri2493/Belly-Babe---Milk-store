import { Table } from 'antd';

const ControlTable = ({ columns, dataSource, rowSelection, onRow, rowKey }) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
      onRow={onRow}
      rowKey={rowKey}
      pagination={false}
    />
  );
};

export default ControlTable;
