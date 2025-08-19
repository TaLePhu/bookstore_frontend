import { Link } from 'react-router-dom';
import '../assets/styles/ProductCard.css';
import ProductCard from './ProductCard';
import React, { useEffect, useState } from 'react';
import BookModel from '../models/BookModel';
import { findBook, layToanBoSach } from '../api/BookAPI';
import Pagination from '../utils/Pagination';

interface CategorySectionProps {
    searchKey: string;
    categoryId: number;
    categoryName: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ searchKey, categoryId, categoryName }) => {
    const [listBook, setListBook] = useState<BookModel[]>([]);
    const [uploadData, setUploadData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);

    // console.log('trang hien tai: ', trangHienTai);

    useEffect(() => {
        setUploadData(true);
        const pageSize = 5;

        if (searchKey === '' && categoryId === 0) {
            // Nếu không có từ khóa tìm kiếm và không có categoryId thì lấy tất
            console.log('lay toan bo sach');
            layToanBoSach(trangHienTai - 1, pageSize)
                .then((data) => {
                    setListBook(data.result);
                    setTongSoTrang(data.totalPages);
                    setUploadData(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setUploadData(false);
                });
        } else {
            console.log('tim kiem sach');
            findBook(searchKey, categoryId, trangHienTai - 1, pageSize)
                .then((data) => {
                    setListBook(data.result);
                    setTongSoTrang(data.totalPages);
                    setUploadData(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setUploadData(false);
                });
        }
    }, [trangHienTai, searchKey, categoryId]);

    if (uploadData) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Thông báo lỗi bên Category: {error}</h1>
            </div>
        );
    }

    const pagination = (currentPage: number) => {
        setTrangHienTai(currentPage);
    };

    return (
        <div className="list">
            <div className="list-total">
                <h3>📚 {categoryName}</h3>
                <Link to={`/category/${categoryId}/${encodeURIComponent(categoryName)}`}>Xem thêm</Link>
            </div>
            <div className="list-item">
                {listBook.map((item) => (
                    <ProductCard key={item.bookId} book={{ ...item }} />
                ))}
            </div>

            {/* Pagination component */}
            <Pagination currentPage={trangHienTai} totalPages={tongSoTrang} pagination={pagination} />
        </div>
    );
};

export default CategorySection;
