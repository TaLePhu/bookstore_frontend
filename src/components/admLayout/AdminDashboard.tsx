import React, { useEffect, useState } from 'react';
import { my_request } from '../../api/Request';
import '../../assets/styles/AdminDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBook, 
    faLayerGroup, 
    faShoppingCart, 
    faMoneyBillWave 
} from '@fortawesome/free-solid-svg-icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Order {
    orderId: number;
    createdDate: string;
    totalPrice: number;
}

// Hàm tạo danh sách năm từ năm bắt đầu đến năm hiện tại
function getYearsFrom(startYear: number): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
}

const AdminDashboard = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    // Tạo danh sách năm từ 2023 đến năm hiện tại
    const years = getYearsFrom(2023); // 2023 là năm bắt đầu

    // lấy dữ liệu cho biểu đồ theo tháng
    const getMonthlyData = () => {
        const monthlyData = new Array(12).fill(0);
        const monthlyRevenue = new Array(12).fill(0);

        orders.forEach(order => {
            const date = new Date(order.createdDate);
            if (date.getFullYear() === selectedYear) {
                const month = date.getMonth();
                monthlyData[month]++;
                monthlyRevenue[month] += order.totalPrice;
            }
        });

        return {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Số đơn hàng',
                    data: monthlyData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Doanh thu (VNĐ)',
                    data: monthlyRevenue,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ]
        };
    };

    // lấy dữ liệu cho biểu đồ theo quý
    const getQuarterlyData = () => {
        const quarterlyData = new Array(4).fill(0);
        const quarterlyRevenue = new Array(4).fill(0);

        orders.forEach(order => {
            const date = new Date(order.createdDate);
            if (date.getFullYear() === selectedYear) {
                const month = date.getMonth();
                const quarter = Math.floor(month / 3);
                quarterlyData[quarter]++;
                quarterlyRevenue[quarter] += order.totalPrice;
            }
        });

        return {
            labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
            datasets: [
                {
                    label: 'Số đơn hàng',
                    data: quarterlyData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Doanh thu (VNĐ)',
                    data: quarterlyRevenue,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ]
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API books với size lớn để lấy tất cả sách
                const booksResponse = await my_request(
                    "http://localhost:8080/books?size=1000",
                    "GET"
                );
                if (booksResponse && booksResponse._embedded && booksResponse._embedded.books) {
                    setTotalProducts(booksResponse._embedded.books.length);
                }

                // Gọi API categories
                const categoriesResponse = await my_request(
                    "http://localhost:8080/categories",
                    "GET"
                );
                // Categories API trả về mảng trực tiếp
                if (Array.isArray(categoriesResponse)) {
                    setTotalCategories(categoriesResponse.length);
                }

                // Gọi API orders với size lớn để lấy tất cả đơn hàng
                const ordersResponse = await my_request(
                    "http://localhost:8080/orders?size=1000",
                    "GET"
                );
                if (ordersResponse && ordersResponse._embedded && ordersResponse._embedded.orders) {
                    const ordersData = ordersResponse._embedded.orders;
                    setOrders(ordersData);
                    setTotalOrders(ordersData.length);
                    
                    // Tính tổng doanh thu từ các đơn hàng
                    const revenue = ordersData.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
                    setTotalRevenue(revenue);
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
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Tổng số sách</h3>
                        <p className="stat-value">{totalProducts}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Tổng số thể loại</h3>
                        <p className="stat-value">{totalCategories}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Đơn hàng</h3>
                        <p className="stat-value">{totalOrders}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Doanh thu</h3>
                        <p className="stat-value">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                </div>
            </div>

            <div className="year-selector">
                <label htmlFor="year-select">Chọn năm: </label>
                <select 
                    id="year-select" 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>Thống kê theo tháng năm {selectedYear}</h3>
                    <Line 
                        data={getMonthlyData()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top' as const,
                                },
                                title: {
                                    display: true,
                                    text: 'Thống kê đơn hàng và doanh thu theo tháng'
                                }
                            }
                        }}
                    />
                </div>

                <div className="chart-card">
                    <h3>Thống kê theo quý năm {selectedYear}</h3>
                    <Bar 
                        data={getQuarterlyData()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top' as const,
                                },
                                title: {
                                    display: true,
                                    text: 'Thống kê đơn hàng và doanh thu theo quý'
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 