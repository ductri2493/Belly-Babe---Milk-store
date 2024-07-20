import { Modal, Typography } from 'antd';

function StaffDetails({
  staff,
  openDetailModal,
  handleCancelDetail,
  handleOkDetail,
}) {
  return (
    <Modal
      open={openDetailModal}
      onCancel={handleCancelDetail}
      onOk={handleOkDetail}
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Chi tiết nhân viên</h5>
      </div>
      <div className='modal-body'>
        <div className='form-group'>
          <label className='form-label'>Tên người dùng:</label>
          <Typography>{staff?.fullName}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Email:</label>
          <Typography>{staff?.email}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Số điện thoại:</label>
          <Typography>{staff?.phoneNumber}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Địa chỉ:</label>
          <Typography>{staff?.address}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Vai trò:</label>
          <Typography>
            {staff?.roleId === 1 ? 'Quản trị viên' : 'Nhân viên'}
          </Typography>
        </div>
      </div>
    </Modal>
  );
}

export default StaffDetails;
