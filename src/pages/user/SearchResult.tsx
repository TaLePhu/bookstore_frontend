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

    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');


    // useEffect(() => {
    //     const pageSize = 20;

    //     if (!keyword || keyword === '') {
    //         // Nếu không có từ khóa, lấy toàn bộ sách
    //         layToanBoSach(currentPage - 1, pageSize)
    //             .then((data) => {
    //                 setBooks(data.result);
    //                 setTotalPages(data.totalPages);
    //             })
    //             .catch((error) => {
    //                 setError(error.message);
    //             });
    //     } else if (keyword !== '' && selectedCategories.length === 1) {
    //         // Có từ khóa nhưng chưa chọn thể loại → chỉ tìm theo tên sách
    //         findBook(keyword, selectedCategories[0], currentPage - 1, pageSize)
    //             .then((data) => {
    //                 setBooks(data.result);
    //                 setTotalPages(data.totalPages);
    //             })
    //             .catch((error) => setError(error.message));
    //     } else {
    //         // Có từ khóa và có chọn thể loại → lọc nâng cao
    //         findBookCategory(keyword, selectedCategories, currentPage - 1, pageSize)
    //             .then((data) => {
    //                 setBooks(data.result);
    //                 setTotalPages(data.totalPages);
    //             })
    //             .catch((error) => setError(error.message));
    //     }
    // }, [keyword, selectedCategories, currentPage]);


    useEffect(() => {
        const pageSize = 20;

        // Hàm lọc giá
        const filterByPrice = (books: BookModel[]) => {
            if (!selectedPriceRange) return books;

            if (selectedPriceRange === '>500000') {
                return books.filter(
                    (book) => typeof book.salePrice === 'number' && book.salePrice > 500000 
                );
            }

            const [min, max] = selectedPriceRange.split('-').map(Number);
            return books.filter(
                (book) => typeof book.salePrice === 'number' && book.salePrice >= min && book.salePrice <= max
            );
        };

        if (!keyword || keyword === '') {
            console.log('🔎 Không có keyword → Lấy toàn bộ sách');
            layToanBoSach(currentPage - 1, pageSize)
                .then((data) => {
                    const filteredBooks = filterByPrice(data.result);
                    setBooks(filteredBooks);
                    setTotalPages(data.totalPages);
                })
                .catch((error) => {
                    setError(error.message);
                });
        } else {
            if (selectedCategories.length === 0) {
                console.log('🔍 Có keyword, không có category → Tìm theo keyword');
                findBook(keyword, 0, currentPage - 1, pageSize)
                    .then((data) => {
                        const filteredBooks = filterByPrice(data.result);
                        setBooks(filteredBooks);
                        setTotalPages(data.totalPages);
                    })
                    .catch((error) => setError(error.message));
            } else if (selectedCategories.length === 1) {
                console.log('📁 Có keyword + 1 category → Tìm theo keyword + category');
                findBook(keyword, selectedCategories[0], currentPage - 1, pageSize)
                    .then((data) => {
                        const filteredBooks = filterByPrice(data.result);
                        setBooks(filteredBooks);
                        setTotalPages(data.totalPages);
                    })
                    .catch((error) => setError(error.message));
            } else {
                console.log('🎯 Tìm nâng cao với nhiều category', selectedCategories);
                findBookCategory(keyword, selectedCategories, currentPage - 1, pageSize)
                    .then((data) => {
                        const filteredBooks = filterByPrice(data.result);
                        setBooks(filteredBooks);
                        setTotalPages(data.totalPages);
                    })
                    .catch((error) => setError(error.message));
            }
        }
    }, [keyword, selectedCategories, currentPage, selectedPriceRange]);



    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error('Lỗi khi lấy thể loại:', err));
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                // Bỏ chọn
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                // Thêm vào
                return [...prevSelected, categoryId];
            }
        });
    };



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
                                            checked={selectedCategories.includes(category.categoryId)}
                                            onChange={() => handleCategoryChange(category.categoryId)}
                                        />
                                        {' '}{category.categoryName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="item-filter">
                        <p>Khoảng giá</p>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        name="price"
                                        value="0-100000"
                                        checked={selectedPriceRange === "0-100000"}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    />
                                    {' '}Dưới 100.000
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        name="price"
                                        value="100000-200000"
                                        checked={selectedPriceRange === "100000-200000"}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    />
                                    {' '}100.000 - 200.000
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        name="price"
                                        value="200000-500000"
                                        checked={selectedPriceRange === "200000-500000"}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    />
                                    {' '}200.000 - 500.000
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        name="price"
                                        value=">500000"
                                        checked={selectedPriceRange === ">500000"}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    />
                                    {' '}Trên 500.000
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        name="price"
                                        value=""
                                        checked={selectedPriceRange === ""}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    />
                                    {' '}Tất cả
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="search-result-secsion">
                    <div className="list-item-search">
                        {books.map((book) => (
                            <ProductCard key={book.bookId} book={book} />
                        ))}
                        
                    </div>
                    <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages} 
                            pagination={handlePageChange}
                        />
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
