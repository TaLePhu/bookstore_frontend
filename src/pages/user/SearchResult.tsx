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

    const [sortOption, setSortOption] = useState<string>('default');

    const [allBooks, setAllBooks] = useState<BookModel[]>([]);




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

        const fetchData = async () => {
            try {
                let data: BookModel[] = [];

                if (!keyword || keyword === '') {
                    const result = await layToanBoSach(0, 1000); // lấy nhiều sách
                    data = result.result;
                } else if (selectedCategories.length === 0) {
                    const result = await findBook(keyword, 0, 0, 1000);
                    data = result.result;
                } else if (selectedCategories.length === 1) {
                    const result = await findBook(keyword, selectedCategories[0], 0, 1000);
                    data = result.result;
                } else {
                    const result = await findBookCategory(keyword, selectedCategories, 0, 1000);
                    data = result.result;
                }

                const filtered = filterByPrice(data);
                setAllBooks(filtered); // lưu toàn bộ
                setTotalPages(Math.ceil(filtered.length / pageSize));
                setCurrentPage(1); // reset về trang 1
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, [keyword, selectedCategories, selectedPriceRange]);




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

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const sortBooks = () => {
        let sorted = [...allBooks];

        switch (sortOption) {
            case 'price-asc':
                sorted.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
                break;
            case 'price-desc':
                sorted.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
                break;
            case 'name-asc':
                sorted.sort((a, b) => (a.bookName ?? '').localeCompare(b.bookName ?? ''));
                break;
            case 'name-desc':
                sorted.sort((a, b) => (b.bookName ?? '').localeCompare(a.bookName ?? ''));
                break;
            case 'rating-asc':
                sorted.sort((a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0));
                break;
            case 'rating-desc':
                sorted.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
                break;
            case 'best-seller':
                sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)); 
                break;
            default:
                break;
        }

        const start = (currentPage - 1) * 20;
        const end = start + 20;
        return sorted.slice(start, end);
    };

    return (
        <div className="container-home">
            
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
                    <div className="select-search">
                        <p>Kết quả tìm kiếm cho: <span>"{keyword}" ({allBooks.length} sản phẩm)</span></p>
                        <div className="select-item">
                            <p>Sắp xếp theo</p>
                            <select className="select-search-item" value={sortOption} onChange={handleSortChange}>
                                <option value="default">Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                                <option value="name-asc">Tên: A-Z</option>
                                <option value="name-desc">Tên: Z-A</option>
                                <option value="best-seller">Bán chạy nhất</option>
                                <option value="rating-asc">Đánh giá: Thấp đến Cao</option>
                                <option value="rating-desc">Đánh giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </div>
                    <div className="list-item-search">
                        {sortBooks().map((book) => (
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
