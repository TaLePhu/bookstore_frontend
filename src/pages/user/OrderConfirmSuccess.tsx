import React from "react";
import { Form, Input, Button, message, Card, Radio , Alert, Modal, notification } from 'antd';
import { useNavigate } from "react-router-dom";

const OrderConfirmSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mt-4 text-center">
        Xác nhận đơn hàng thành công!
      </h1>
      <p className="text-gray-600 mt-2 text-center">
        Cảm ơn bạn đã xác nhận đơn hàng. Chúng tôi đã gửi chi tiết đơn hàng qua email của bạn.
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </div>
  );
};

export default OrderConfirmSuccess;