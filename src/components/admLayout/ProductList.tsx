import { useEffect, useState } from 'react';
import { layToanBoSach, deleteBook, updateBook } from '../../api/BookAPI';
import { searchProducts } from '../../api/ProductSearchAPI';
import BookModel from '../../models/BookModel';
import { getAllImage, uploadImage } from '../../api/ImageAPI';
import ImageModel from '../../models/ImageModel';
import AddBook from './AddBook';
import '../../assets/styles/ProductList.css';

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: BookModel | null;
    currentImage: string;
    onUpdate: () => void;
}

const EditBookModal = ({ isOpen, onClose, book, currentImage, onUpdate }: EditBookModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(currentImage);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen || !book) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const updatedBook = {
                ...book,
                bookName: formData.get('bookName') as string,
                authorName: formData.get('authorName') as string,
                isbn: formData.get('isbn') as string,
                quantity: parseInt(formData.get('quantity') as string),
                listedPrice: parseFloat(formData.get('listedPrice') as string),
                salePrice: parseFloat(formData.get('salePrice') as string),
                description: formData.get('description') as string,
            };

            const success = await updateBook(book.bookId, updatedBook);
            
            if (selectedFile) {
                const imageSuccess = await uploadImage(book.bookId, selectedFile, false);
                if (!imageSuccess) {
                    throw new Error('Failed to upload image');
                }
            }

            if (success) {
                alert('Cập nhật sách thành công!');
                onClose();
                onUpdate();
            } else {
                throw new Error('Failed to update book');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Có lỗi xảy ra khi cập nhật sách.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="edit-book-modal-overlay">
            <div className="edit-book-modal-content">
                <div className="edit-book-modal-header">
                    <h2>Sửa thông tin sách</h2>
                    <button className="edit-book-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="edit-book-form">
                    <div className="edit-book-form-group">
                        <div className="edit-book-image-preview">
                            <img src={previewUrl} alt={book.bookName} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="imageInput" className="edit-book-change-image-btn">
                                    Chọn ảnh mới
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="edit-book-form-row">
                        <div className="edit-book-form-group">
                            <label htmlFor="bookName">Tên sách:</label>
                            <input 
                                type="text" 
                                id="bookName" 
                                name="bookName"
                                defaultValue={book.bookName}
                            />
                        </div>
                        <div className="edit-book-form-group">
                            <label htmlFor="authorName">Tác giả:</label>
                            <input 
                                type="text" 
                                id="authorName" 
                                name="authorName"
                                defaultValue={book.authorName}
                            />
                        </div>
                    </div>

                    <div className="edit-book-form-row">
                        <div className="edit-book-form-group">
                            <label htmlFor="isbn">ISBN:</label>
                            <input 
                                type="text" 
                                id="isbn" 
                                name="isbn"
                                defaultValue={book.isbn}
                            />
                        </div>
                        <div className="edit-book-form-group">
                            <label htmlFor="quantity">Số lượng:</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                name="quantity"
                                defaultValue={book.quantity}
                            />
                        </div>
                    </div>

                    <div className="edit-book-form-row">
                        <div className="edit-book-form-group">
                            <label htmlFor="listedPrice">Giá gốc:</label>
                            <input 
                                type="number" 
                                id="listedPrice" 
                                name="listedPrice"
                                defaultValue={book.listedPrice}
                            />
                        </div>
                        <div className="edit-book-form-group">
                            <label htmlFor="salePrice">Giá bán:</label>
                            <input 
                                type="number" 
                                id="salePrice" 
                                name="salePrice"
                                defaultValue={book.salePrice}
                            />
                        </div>
                    </div>

                    <div className="edit-book-form-group">
                        <label htmlFor="description">Mô tả:</label>
                        <textarea 
                            id="description" 
                            name="description"
                            defaultValue={book.description}
                        />
                    </div>

                    <div className="edit-book-modal-buttons">
                        <button type="button" className="edit-book-cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="edit-book-save-btn" disabled={isUploading}>
                            {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface BookDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: BookModel | null;
    bookImage: string;
}

const BookDetailModal = ({ isOpen, onClose, book, bookImage }: BookDetailModalProps) => {
    if (!isOpen || !book) return null;

    const formatCurrency = (price?: number) => {
        if (!price) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Chi tiết sách</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="book-image">
                        <img src={bookImage} alt={book.bookName} />
                    </div>
                    <div className="book-details">
                        <div className="detail-item">
                            <label>ID:</label>
                            <span>{book.bookId}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tên sách:</label>
                            <span>{book.bookName}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tác giả:</label>
                            <span>{book.authorName}</span>
                        </div>
                        <div className="detail-item">
                            <label>ISBN:</label>
                            <span>{book.isbn}</span>
                        </div>
                        <div className="detail-item">
                            <label>Giá gốc:</label>
                            <span>{formatCurrency(book.listedPrice)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Giá bán:</label>
                            <span>{formatCurrency(book.salePrice)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Số lượng:</label>
                            <span>{book.quantity}</span>
                        </div>
                        <div className="detail-item">
                            <label>Đánh giá:</label>
                            <span>{book.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="detail-item description">
                            <label>Mô tả:</label>
                            <p>{book.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductList = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BookModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookImages, setBookImages] = useState<{ [key: number]: string }>({});
    const [pageInput, setPageInput] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [editingBook, setEditingBook] = useState<BookModel | null>(null);
    const [selectedBook, setSelectedBook] = useState<BookModel | null>(null);
    const [showAddBook, setShowAddBook] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Load books initially and when page changes
    useEffect(() => {
        loadBooks();
    }, [currentPage]);

    // Filter books when search keyword changes
    useEffect(() => {
        if (!searchKeyword.trim()) {
            setFilteredBooks(books);
            return;
        }

        handleSearch();
    }, [searchKeyword]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const response = await layToanBoSach(currentPage - 1);
            setBooks(response.result);
            setFilteredBooks(response.result);
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

    const handleDelete = async (bookId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
            try {
                setDeleteLoading(bookId);
                const success = await deleteBook(bookId);
                if (success) {
                    // Nếu xóa thành công, tải lại danh sách sách
                    await loadBooks();
                } else {
                    alert('Không thể xóa sách. Vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Có lỗi xảy ra khi xóa sách.');
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const handleEdit = (book: BookModel) => {
        setEditingBook(book);
    };

    const handleBookClick = (book: BookModel) => {
        setSelectedBook(book);
    };

    const formatCurrency = (price?: number) => {
        if (!price) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        
        if (!searchKeyword.trim()) {
            loadBooks();
            return;
        }

        try {
            const response = await searchProducts(searchKeyword);
            setBooks(response.result);
            setFilteredBooks(response.result);
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
            console.error('Error searching books:', error);
            alert('Có lỗi xảy ra khi tìm kiếm sách.');
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>Danh sách Sách</h2>
                <div className="product-list-actions">
                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Nhập tên sách, tác giả hoặc ISBN..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        {searchKeyword && (
                            <button 
                                className="cancel-search-btn"
                                onClick={() => {
                                    setSearchKeyword('');
                                    loadBooks();
                                }}
                            >
                                Huỷ tìm kiếm
                            </button>
                        )}
                    </div>
                    <button 
                        className="add-product-btn"
                        onClick={() => setShowAddBook(!showAddBook)}
                    >
                        {showAddBook ? 'Đóng form thêm sách' : 'Thêm sách mới'}
                    </button>
                </div>
            </div>

            {showAddBook ? (
                <AddBook onSuccess={() => {
                    setShowAddBook(false);
                    loadBooks();
                }} />
            ) : (
                <>
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
                                {filteredBooks.map((book) => (
                                    <tr key={book.bookId} onClick={() => handleBookClick(book)} style={{ cursor: 'pointer' }}>
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
                                                <button 
                                                    className="edit-btn-bookk"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(book);
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button 
                                                    className="delete-btn-bookk"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(book.bookId);
                                                    }}
                                                    disabled={deleteLoading === book.bookId}
                                                >
                                                    {deleteLoading === book.bookId ? 'Đang xóa...' : 'Xóa'}
                                                </button>
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
                </>
            )}

            {editingBook && (
                <EditBookModal
                    isOpen={true}
                    onClose={() => setEditingBook(null)}
                    book={editingBook}
                    currentImage={bookImages[editingBook.bookId] || 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg'}
                    onUpdate={loadBooks}
                />
            )}

            {selectedBook && (
                <BookDetailModal
                    isOpen={true}
                    onClose={() => setSelectedBook(null)}
                    book={selectedBook}
                    bookImage={bookImages[selectedBook.bookId] || 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg'}
                />
            )}
        </div>
    );
};

export default ProductList;
