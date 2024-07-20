/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import StatusAPI from "../../services/order/status";

export default function EditOrder({
  order,
  onCancel,
  onOk,
  form,
  open,
  setSelectedOrderEdit,
}) {
  const [currentOrder, setCurrentOrder] = useState({
    userName: order.userName,
    statusName: order.statusName,
    note: order.note,
    deliveryName: order.deliveryName,
    totalPrice: order.totalPrice,
    orderDate: order.orderDate,
    recipientName: order.recipientName,
    recipientPhone: order.recipientPhone,
    recipientAddress: order.recipientAddress,
  });
  const [updateOrder, setUpdateOrder] = useState({
    userName: "",
    statusName: "",
    note: "",
    deliveryName: "",
    totalPrice: 0,
    orderDate: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);

  const handleFetchStatus = async () => {
    const statusOptions = await StatusAPI.fetchStatus();
    if (statusOptions) {
      setStatusOptions(
        statusOptions.map((item) => ({ label: item.name, value: item.id })),
      );
    }
  };

  useEffect(() => {
    handleFetchStatus();
  }, []);

  const handleOnCancel = () => {
    if (onCancel) onCancel();
  };
  const handleOnOk = () => {
    if (onOk) onOk();
  };
  const handleOnFinish = () => {};
  const handleOnChange = (value, field) => {
    setUpdateOrder((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  return (
    <Modal
      title={"Đơn hàng"}
      open={open}
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <Form form={form} onFinish={handleOnFinish}>
        <Form.Item label={"Tên khách hàng"} name={"userName"}>
          <Input
            onChange={(event) => {
              handleOnChange(event.target.value, "userName");
            }}
          />
        </Form.Item>
        <Form.Item label={"Trạng thái đơn hàng"} name={"statusName"}>
          <Select
            options={statusOptions}
            onChange={(event) => {
              handleOnChange(event.target.value, "statusName");
            }}
          />
        </Form.Item>
        <Form.Item label={"Ghi chú"} name={"note"}>
          <TextArea
            onChange={(event) => {
              handleOnChange(event.target.value, "note");
            }}
          />
        </Form.Item>
        <Form.Item label={"Phương thức giao hàng"} name={"deliveryName"}>
          <Select
            options={statusOptions}
            onChange={(event) => {
              handleOnChange(event.target.value, "statusName");
            }}
          />
        </Form.Item>
        <Form.Item label={"Tổng thanh toán"} name={"totalPrice"}></Form.Item>
        <Form.Item label={"Ngày đặt hàng"} name={"orderDate"}></Form.Item>
        <Form.Item label={"Tên người nhận"} name={"recipientName"}></Form.Item>
        <Form.Item label={"SĐT người nhận"} name={"recipientPhone"}></Form.Item>
        <Form.Item
          label={"Địa chỉ người nhận"}
          name={"recipientAddress"}
        ></Form.Item>
      </Form>
    </Modal>
  );
}
