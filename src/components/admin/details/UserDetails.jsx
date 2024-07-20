import { Modal, Typography } from 'antd';

function UserDetail({
  user,
  openDetailModal,
  handleCancelDetail,
  handleOkDetailModal,
  role,
}) {
  return (
    <>
      <Modal
        onCancel={handleCancelDetail}
        onOk={handleOkDetailModal}
        open={openDetailModal}
      >
        <div className='modal-header'>
          <h5 className='modal-title'>Chi tiết người dùng</h5>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label className='form-label'>Họ và tên:</label>
            <Typography className=''>{user?.userName}</Typography>
          </div>
          <div className='form-group mt-3'>
            <label className='form-label'>Email:</label>
            <Typography className=''>{user?.email}</Typography>
          </div>
          <div className='form-group mt-3'>
            <label className='form-label'>Số điện thoại:</label>
            <Typography className=''>{user?.phoneNumber}</Typography>
          </div>
          <div className='form-group mt-3'>
            <label className='form-label'>Địa chỉ:</label>
            <Typography className=''>{user?.address}</Typography>
          </div>
          <div className='form-group mt-3'>
            <label className='form-label'>Vai trò:</label>
            <Typography className=''>{role[user?.roleId]}</Typography>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserDetail;
