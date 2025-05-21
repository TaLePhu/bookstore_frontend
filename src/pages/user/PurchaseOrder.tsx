import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/PurchaseOrder.css';
import { getAllOrdersUser, Order } from '../../api/OrderAPI';

const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersUser();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container-purchase-order">
        <div className="category-link">
            <a href="/">Trang chủ</a> &gt; <span>Đơn hàng của tôi</span>
        </div>
      {error && <p className="error">{error}</p>}
      <div className="list-purchase-order">
        {orders.length === 0 && <p>Bạn chưa có đơn hàng nào.</p>}
        {orders
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .filter((order) => order.confirmed)
            .map((order) => (
            <div className="item-purchase-order" key={order.orderId}>
                <div className="time-ship">
                    
                    {order.shippingMethod.shippingMethodId == 2 ? (
                        <>
                            <p className={order.delivered ? "delivered" : "pending-delivery"}>
                                {order.delivered ? "Đã giao hàng" : "Đang chờ bạn đến lấy hàng"}
                            </p>
                            {!order.delivered && (
                                <p className="date-delivery">Vui lòng ghé cửa hàng lấy sớm nhất ngày: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className={order.delivered ? "delivered" : "pending-delivery"}>
                                {order.delivered ? "Đã giao hàng" : "Đang chờ giao hàng"}
                            </p>
                            {!order.delivered && (
                                <p  className="date-delivery">Đơn hàng sẽ được giao sớm nhất ngày: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                            )}
                            
                        </>
                    )}
                </div>
                <div className="list-book-order">
                {order.orderDetails.map((detail) => (
                    <div className="book-order" key={detail.orderDetailId}>
                    <img
                        className="img-book"
                        src={detail.book.images[0]?.imageData || "https://cdn.pixabay.com/photo/2025/05/07/18/46/lake-9585821_1280.jpg"} 
                        alt={detail.book.bookName}
                    />
                    <div className="book-info">
                        <div className="book-title">
                            <p>{detail.book.bookName}</p>
                            <span>x{detail.quantity}</span>
                        </div>
                        <p className="price-book">Giá: {detail.salePrice.toLocaleString("vi-VN")}đ</p>
                    </div>
                    </div>
                ))}
                </div>
                <div className="order-total">
                    <p>Tổng tiền:</p>
                    <span> {order.totalPrice.toLocaleString("vi-VN")}đ</span>

                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrder;
