import React, { useEffect, useState } from 'react';
import { my_request } from '../../api/Request';
import '../../assets/styles/OrderList.css';

interface Order {
    orderId: number;
    createdDate: string;
    billingAddress: string;
    shippingAddress: string;
    totalProductPrice: number;
    shippingFee: number;
    paymentFee: number;
    totalPrice: number;
    email: string;
    phoneNumber: string;
    confirmed: boolean;
    orderDate: string;
    deliveryDate: string;
    user: {
        firstName: string;
        lastName: string;
    };
    paymentMethod: {
        paymentMethodName: string;
    };
    shippingMethod: {
        shippingMethodName: string;
    };
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await my_request(
                    "http://localhost:8080/orders",
                    "GET"
                );
                console.log('Orders response:', response);
                if (response && response._embedded && response._embedded.orders) {
                    setOrders(response._embedded.orders);
                } else {
                    setError('Không có dữ liệu đơn hàng');
                }
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                if (err.response) {
                    if (err.response.status === 401) {
                        setError('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
                    } else if (err.response.status === 403) {
                        setError('Bạn không có quyền xem danh sách đơn hàng.');
                    } else {
                        setError(`Lỗi server: ${err.response.status}`);
                    }
                } else {
                    setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="order-list">
            <h1>Danh sách đơn hàng</h1>
            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Địa chỉ giao hàng</th>
                            <th>Phương thức thanh toán</th>
                            <th>Phương thức vận chuyển</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>#{order.orderId}</td>
                                <td>
                                    {order.user.firstName} {order.user.lastName}
                                    <br />
                                    <small>{order.email}</small>
                                </td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.shippingAddress}</td>
                                <td>{order.paymentMethod.paymentMethodName}</td>
                                <td>{order.shippingMethod.shippingMethodName}</td>
                                <td>{order.totalPrice.toLocaleString()} VND</td>
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
    );
};

export default OrderList; 