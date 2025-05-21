import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookModel from '../../models/BookModel';
import { findBook } from '../../api/BookAPI';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../utils/Pagination';
import '../../assets/styles/CategoryPage.css';

const CategoryPage: React.FC = () => {
    const { categoryId, categoryName } = useParams();
    const [books, setBooks] = useState<BookModel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await findBook('', Number(categoryId), currentPage - 1, 20); // mỗi trang 20
                let sorted = [...res.result];

                switch (sortOption) {
                    case 'name-asc':
                        sorted.sort((a, b) => (a.bookName ?? '').localeCompare(b.bookName ?? ''));
                        break;
                    case 'name-desc':
                        sorted.sort((a, b) => (b.bookName ?? '').localeCompare(a.bookName ?? ''));
                        break;
                    case 'sold-desc':
                        sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
                        break;
                    case 'price-asc':
                        sorted.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
                        break;
                    case 'price-desc':
                        sorted.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
                        break;
                    case 'rating-asc':
                        sorted.sort((a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0));
                        break;
                    case 'rating-desc':
                        sorted.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
                        break;
                    default:
                        break;
                }

                setBooks(sorted);
                setTotalPages(res.totalPages);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBooks();
    }, [categoryId, currentPage, sortOption]);

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="container-category">
            <h2>📖 Thể loại: {categoryName}</h2>

           <div className="category-page">
                <div className="select-item">
                    <label>Sắp xếp: </label>
                    <select className='select-item-select' value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="default">Mới nhất</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="name-asc">Tên: A-Z</option>
                        <option value="name-desc">Tên: Z-A</option>
                        <option value="sold-desc">Bán chạy nhất</option>
                        <option value="rating-asc">Đánh giá: Thấp đến Cao</option>
                        <option value="rating-desc">Đánh giá: Cao đến Thấp</option>
                    </select>
                </div>

                <div className="list-item">
                    {books.map((book) => (
                        <ProductCard key={book.bookId} book={book} />
                    ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} pagination={handlePageChange} />
           </div>
        </div>
    );
};

export default CategoryPage;