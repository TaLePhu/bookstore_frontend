import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table } from 'antd';
import { BookOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface TopProduct {
    key: number;
    bookName: string;
    authorName: string;
    quantity: number;
    totalSales: number;
}

const AdminDashboard: React.FC = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

    // Giả lập dữ liệu - Thay thế bằng API call thực tế
    useEffect(() => {
        // Giả lập dữ liệu
        setTotalProducts(150);
        setTotalUsers(1200);
        setTotalSales(50000000);
        
        setTopProducts([
            {
                key: 1,
                bookName: 'Đắc Nhân Tâm',
                authorName: 'Dale Carnegie',
                quantity: 100,
                totalSales: 5000000
            },
            {
                key: 2,
                bookName: 'Nhà Giả Kim',
                authorName: 'Paulo Coelho',
                quantity: 85,
                totalSales: 4250000
            },
            {
                key: 3,
                bookName: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
                authorName: 'Rosie Nguyễn',
                quantity: 75,
                totalSales: 3750000
            }
        ]);
    }, []);

    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: 'Tác giả',
            dataIndex: 'authorName',
            key: 'authorName',
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalSales',
            key: 'totalSales',
            render: (value: number) => `${value.toLocaleString('vi-VN')} VNĐ`
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Bảng điều khiển quản trị</Title>
            
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng số sản phẩm"
                            value={totalProducts}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng số người dùng"
                            value={totalUsers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalSales}
                            prefix={<ShoppingCartOutlined />}
                            suffix="VNĐ"
                            formatter={(value) => `${value.toLocaleString('vi-VN')}`}
                        />
                    </Card>
                </Col>
            </Row>

            <Card 
                title="Sản phẩm bán chạy nhất" 
                style={{ marginTop: '24px' }}
            >
                <Table 
                    columns={columns} 
                    dataSource={topProducts}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default AdminDashboard; 