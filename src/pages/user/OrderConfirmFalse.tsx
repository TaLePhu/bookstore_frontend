import React from "react";
import { Form, Input, Button, message, Card, Radio , Alert, Modal, notification } from 'antd';
import { useNavigate } from "react-router-dom";

const OrderConfirmFalse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mt-4 text-center">
        Đơn hàng đã quá hạn!
      </h1>
      <p className="text-gray-600 mt-2 text-center">
        Xin lỗi, đơn hàng này đã quá 1 ngày và không thể xác nhận nữa. Vui lòng đặt lại đơn hàng.
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </div>
  );
};

export default OrderConfirmFalse;