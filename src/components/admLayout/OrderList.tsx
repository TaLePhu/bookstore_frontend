import React, { useEffect, useState } from 'react';
import { getAllOrders, Order, deleteOrder } from '../../api/OrderAPI';
import '../../assets/styles/OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleRowClick = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;
        if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
        try {
            await deleteOrder(selectedOrder.orderId); // Gọi API xóa
            setShowModal(false);
            setSelectedOrder(null);
            fetchOrders(); // Refresh lại danh sách
        } catch (err: any) {
            alert('Xóa đơn hàng thất bại!');
        }
    };

    if (loading) {
        return <div>Đang tải danh sách đơn hàng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="content-management">
            <div className="order-list-container">
                <div className="order-list-header">
                    <h2>Danh sách đơn hàng</h2>
                </div>
                <div className="order-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Khách hàng</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.orderId}
                                    onClick={() => handleRowClick(order)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>#{order.orderId}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                    <td>{`${order.user.firstName} ${order.user.lastName}`}</td>
                                    <td>{order.email}</td>
                                    <td>{order.phoneNumber}</td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>
                                        <span className={`status ${order.confirmed ? 'confirmed' : 'pending'}`}>
                                            {order.confirmed ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal hiển thị chi tiết đơn hàng */}
            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal} title="Đóng"></button>
                        <h3>Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
                        <p>
                            <b>Khách hàng:</b> {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                        </p>
                        <p>
                            <b>Email:</b> {selectedOrder.email}
                        </p>
                        <p>
                            <b>Số điện thoại:</b> {selectedOrder.phoneNumber}
                        </p>
                        <p>
                            <b>Ngày đặt:</b> {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p>
                            <b>Tổng tiền:</b> {selectedOrder.totalPrice?.toLocaleString('vi-VN') ?? 'N/A'} VNĐ
                        </p>
                        <h4>Sách trong đơn hàng:</h4>
                        <table className="order-detail-table">
                            <thead>
                                <tr>
                                    <th>Tên sách</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.orderDetails.map((item: any) => (
                                    <tr key={item.orderDetailId}>
                                        <td>{item.book?.bookName || 'Không rõ'}</td>
                                        <td>{item.quantity ?? 'N/A'}</td>
                                        <td>
                                            {typeof item.salePrice === 'number'
                                                ? item.salePrice.toLocaleString('vi-VN') + ' VNĐ'
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-actions-bottom">
                            <button className="delete-btn" onClick={handleDeleteOrder}>
                                Xóa đơn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
