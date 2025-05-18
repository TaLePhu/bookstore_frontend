import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookModel from '../../models/BookModel';
import Category from '../../models/Category';
import ProductCard from '../../components/ProductCard';
import '../../assets/styles/SearchResult.css';
import { layToanBoSach, findBook, findBookCategory } from '../../api/BookAPI';
import { getAllCategories } from '../../api/CategoryAPI';
import Pagination from '../../utils/Pagination';
import { Form } from 'antd';


const SearchResult: React.FC = () => {
    const { keyword } = useParams();
    const [books, setBooks] = useState<BookModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    
        // console.log('trang hien tai: ', trangHienTai);
    
    // useEffect(() => {
    //     const pageSize = 20;

    //     if (!keyword || keyword === '') {
    //         layToanBoSach(currentPage - 1, pageSize)
    //             .then((data) => {
    //                 setBooks(data.result);
    //                 setTotalPages(data.totalPages); // ✅ sửa
    //             })
    //             .catch((error) => {
    //                 setError(error.message);
    //             });
    //     } else {
    //         findBook(keyword, 0, currentPage - 1, pageSize) // ✅ sửa
    //             .then((data) => {
    //                 setBooks(data.result || []);
    //                 setTotalPages(data.totalPages || 1);
    //             })
    //             .catch((error) => setError(error.message));
    //     }
    // }, [keyword, currentPage]); // ✅ thêm currentPage

    useEffect(() => {
        const pageSize = 20;

        if (!keyword || keyword === '') {
            // Nếu không có từ khóa, lấy toàn bộ sách
            layToanBoSach(currentPage - 1, pageSize)
                .then((data) => {
                    setBooks(data.result);
                    setTotalPages(data.totalPages);
                })
                .catch((error) => {
                    setError(error.message);
                });
        } else if (selectedCategories.length === 0) {
            // Có từ khóa nhưng chưa chọn thể loại → chỉ tìm theo tên sách
            findBook(keyword, 0, currentPage - 1, pageSize)
                .then((data) => {
                    setBooks(data.result);
                    setTotalPages(data.totalPages);
                })
                .catch((error) => setError(error.message));
        } else {
            // Có từ khóa và có chọn thể loại → lọc nâng cao
            findBookCategory(keyword, selectedCategories, currentPage - 1, pageSize)
                .then((data) => {
                    setBooks(data.result);
                    setTotalPages(data.totalPages);
                })
                .catch((error) => setError(error.message));
        }
    }, [keyword, selectedCategories, currentPage]);

    // useEffect(() => {
    //     const fetchBooks = async () => {
    //         const pageSize = 20;
    //         if (keyword) {
    //             try {
    //                 const data = await findBook(keyword, currentPage - 1, pageSize);
    //                 setBooks(data.result || []);
    //                 setTotalPages(data.totalPages || 1);
    //             } catch (error) {
    //                 console.error('Lỗi khi tìm sách:', error);
    //             }
    //         }
    //     };

    //     fetchBooks();
    // }, [keyword, currentPage]);

    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error('Lỗi khi lấy thể loại:', err));
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // const pagination = (currentPage: number) => {
    //     setTrangHienTai(currentPage);
    // };

    return (
        <div className="container-home">
            <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
            <div className="container-search">
                <div className="filter-section">
                    <p className='header-filter'>Lọc theo</p>
                    <div className="item-filter">
                        <p>Thể loại</p>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {categories.map(category => (
                                <li key={category.categoryId}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={category.categoryId}
                                            onChange={() => handleCategoryChange(category.categoryId)}
                                        />
                                        {' '}{category.categoryName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="search-result-secsion">
                    <div className="list-item-search">
                        {books.map((book) => (
                            <ProductCard key={book.bookId} book={book} />
                        ))}
                        <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages} 
                        pagination={handlePageChange}
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
