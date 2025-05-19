import React, { useEffect, useState } from 'react';
import { my_request } from '../../api/Request';
import '../../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API books
                const booksResponse = await my_request(
                    "http://localhost:8080/books?size=1000",
                    "GET"
                );
                console.log('Books response:', booksResponse);
                const totalBooks = booksResponse._embedded.books.length;
                setTotalProducts(totalBooks);

                // Gọi API categories
                const categoriesResponse = await my_request(
                    "http://localhost:8080/categories",
                    "GET"
                );
                console.log('Categories response:', categoriesResponse);
                const totalCats = categoriesResponse._embedded.categories.length;
                setTotalCategories(totalCats);

                // Gọi API orders
                try {
                    const ordersResponse = await my_request(
                        "http://localhost:8080/orders",  // Thay đổi endpoint
                        "GET"
                    );
                    console.log('Orders response:', ordersResponse);
                    if (ordersResponse && Array.isArray(ordersResponse)) {
                        setTotalOrders(ordersResponse.length);
                    } else if (ordersResponse && ordersResponse._embedded && ordersResponse._embedded.orders) {
                        setTotalOrders(ordersResponse._embedded.orders.length);
                    } else {
                        setTotalOrders(0);
                    }
                } catch (orderError) {
                    console.error('Error fetching orders:', orderError);
                    // Không set error chung nếu chỉ lỗi orders
                    setTotalOrders(0);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Tổng số sách</h3>
                    <p className="stat-value">{totalProducts}</p>
                </div>
                <div className="stat-card">
                    <h3>Tổng số thể loại</h3>
                    <p className="stat-value">{totalCategories}</p>
                </div>
                <div className="stat-card">
                    <h3>Tổng số đơn hàng</h3>
                    <p className="stat-value">{totalOrders}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 