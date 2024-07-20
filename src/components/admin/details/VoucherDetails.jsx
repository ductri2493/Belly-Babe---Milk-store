import { Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { VoucherAPI } from '../../../services/voucher';
import UserAPI from '../../../services/account/User';
import CustomNumberFormat from '../../../utils/CustomNumberFormat';

function VoucherDetails({
  voucherId,
  isDetailOpen,
  handleVoucherDetailsCancel,
  handleVoucherDetailsOk,
}) {
  const [voucher, setVoucher] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([]);

  const fetchData = async (voucherId) => {
    console.log(voucherId);
    const [voucherData, userData] = await Promise.all([
      VoucherAPI.fetchVoucher(voucherId),
      UserAPI.fetchAccounts,
    ]);
    setUsers(userData.$values);
    setVoucher(voucherData);
  };

  useEffect(() => {
    if (voucherId) {
      fetchData(voucherId);
    }
  }, [voucherId]);

  return (
    <Modal
      open={isDetailOpen}
      onCancel={handleVoucherDetailsCancel}
      onOk={handleVoucherDetailsOk}
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Chi tiết mã giảm giá</h5>
      </div>
      <div className='modal-body'>
        <div className='form-group'>
          <label className='form-label'>Người dùng:</label>
          <Typography className=''>{voucher?.user}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Tên mã giảm giá:</label>
          <Typography className=''>{voucher?.voucherName}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Mã giảm giá:</label>
          <Typography className=''>{voucher?.voucherCode}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Số lượng hiện có:</label>
          <Typography className=''>{voucher?.quantity}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Ngày hết hạn:</label>
          <Typography className=''>{voucher?.expiredDate}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label htmlFor='' className='form-label'>
            Giá trị giảm giá:
          </label>
          <Typography className=''>
            <CustomNumberFormat numStr={voucher?.price} />
          </Typography>
        </div>
        <div className='form-group mt-3'>
          <label htmlFor='' className='form-label'>
            Giá trị hóa đơn được áp dụng:
          </label>
          <Typography className=''>
            <CustomNumberFormat numStr={voucher?.minimumBillAmount} />
          </Typography>
        </div>
      </div>
    </Modal>
  );
}

export default VoucherDetails;
