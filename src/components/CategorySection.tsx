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
}

const CategorySection: React.FC<CategorySectionProps> = ({ searchKey, categoryId }) => {
    const [listBook, setListBook] = useState<BookModel[]>([]);
    const [uploadData, setUploadData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);

    // console.log('trang hien tai: ', trangHienTai);

    useEffect(() => {
        setUploadData(true);
        if (searchKey === '' && categoryId === 0) {
            // Nếu không có từ khóa tìm kiếm và không có categoryId thì lấy tất
            layToanBoSach(trangHienTai - 1)
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
            findBook(searchKey, categoryId)
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
                <h3>Danh sách sản phẩm</h3>
                <Link to="/category">Xem thêm</Link>
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

// interface Props {
//     category: Category;
// }

// const CategorySection: React.FC<Props> = ({ category }) => {
//     return (
//         <div className="list">
//             <div className="list-total">
//                 <h3>{category.categoryName}</h3>
//                 <Link to="/category">Xem thêm</Link>
//             </div>
//             <div className="list-item">
//                 {category.items.slice(0, 10).map((item) => (
//                     <ProductCard key={item.bookId} book={{ ...item }} />
//                 ))}
//             </div>
//         </div>
//     );
// };

export default CategorySection;
