import { useEffect, useState } from 'react';
import { layToanBoSach } from '../../api/BookAPI';
import BookModel from '../../models/BookModel';
import { getAllImage } from '../../api/ImageAPI';
import ImageModel from '../../models/ImageModel';
import '../../assets/styles/ProductList.css';

const ProductList = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookImages, setBookImages] = useState<{ [key: number]: string }>({});
    const [pageInput, setPageInput] = useState('');

    useEffect(() => {
        loadBooks();
    }, [currentPage]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const response = await layToanBoSach(currentPage - 1);
            setBooks(response.result);
            setTotalPages(response.totalPages);
            
            // Load images for each book
            const imagePromises = response.result.map(async (book) => {
                try {
                    const images = await getAllImage(book.bookId);
                    const mainImage = images.find(img => !img.isIcon)?.imageData || 
                                    images[0]?.imageData || 
                                    'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';
                    return { bookId: book.bookId, imageUrl: mainImage };
                } catch (error) {
                    console.error(`Error loading image for book ${book.bookId}:`, error);
                    return { bookId: book.bookId, imageUrl: 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg' };
                }
            });

            const imageResults = await Promise.all(imagePromises);
            const imageMap = imageResults.reduce((acc, { bookId, imageUrl }) => {
                acc[bookId] = imageUrl;
                return acc;
            }, {} as { [key: number]: string });

            setBookImages(imageMap);
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setPageInput('');
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPageInput(value);
        }
    };

    const handlePageInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const page = parseInt(pageInput);
        if (page >= 1 && page <= totalPages) {
            handlePageChange(page);
        }
    };

    const formatCurrency = (price?: number) => {
        if (!price) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>Danh sách sản phẩm</h2>
                <button className="add-product-btn">Thêm sản phẩm</button>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>ID</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>ISBN</th>
                            <th>Giá gốc</th>
                            <th>Giá bán</th>
                            <th>Số lượng</th>
                            <th>Đánh giá</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookId}>
                                <td>
                                    <div className="product-image">
                                        <img 
                                            src={bookImages[book.bookId] || 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg'} 
                                            alt={book.bookName || 'Book image'} 
                                        />
                                    </div>
                                </td>
                                <td>{book.bookId}</td>
                                <td>{book.bookName}</td>
                                <td>{book.authorName}</td>
                                <td>{book.isbn}</td>
                                <td>{formatCurrency(book.listedPrice)}</td>
                                <td>{formatCurrency(book.salePrice)}</td>
                                <td>{book.quantity}</td>
                                <td>{book.averageRating?.toFixed(1) || '0.0'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn">Sửa</button>
                                        <button className="delete-btn">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Trước
                </button>
                <form onSubmit={handlePageInputSubmit} className="page-input-form">
                    <input
                        type="text"
                        value={pageInput || currentPage}
                        onChange={handlePageInputChange}
                        className="page-input"
                        aria-label="Page number"
                    />
                    <span className="page-separator">/</span>
                    <span className="total-pages">{totalPages}</span>
                </form>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default ProductList;
