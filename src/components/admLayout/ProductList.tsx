import { useEffect, useState } from 'react';
import { layToanBoSach, deleteBook, updateBook } from '../../api/BookAPI';
import BookModel from '../../models/BookModel';
import { getAllImage } from '../../api/ImageAPI';
import ImageModel from '../../models/ImageModel';
import '../../assets/styles/ProductList.css';

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: BookModel | null;
    currentImage: string;
    onUpdate: () => void;
}

const EditBookModal = ({ isOpen, onClose, book, currentImage, onUpdate }: EditBookModalProps) => {
    if (!isOpen || !book) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        if (success) {
            alert('Cập nhật sách thành công!');
            onClose();
            onUpdate();
        } else {
            alert('Cập nhật sách thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Sửa thông tin sách</h2>
                <form onSubmit={handleSubmit} className="edit-book-form">
                    <div className="form-group">
                        <div className="book-image-preview">
                            <img src={currentImage} alt={book.bookName} />
                            <button type="button" className="change-image-btn">Thay đổi ảnh</button>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="bookName">Tên sách:</label>
                            <input 
                                type="text" 
                                id="bookName" 
                                name="bookName"
                                defaultValue={book.bookName}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="authorName">Tác giả:</label>
                            <input 
                                type="text" 
                                id="authorName" 
                                name="authorName"
                                defaultValue={book.authorName}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="isbn">ISBN:</label>
                            <input 
                                type="text" 
                                id="isbn" 
                                name="isbn"
                                defaultValue={book.isbn}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Số lượng:</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                name="quantity"
                                defaultValue={book.quantity}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="listedPrice">Giá gốc:</label>
                            <input 
                                type="number" 
                                id="listedPrice" 
                                name="listedPrice"
                                defaultValue={book.listedPrice}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salePrice">Giá bán:</label>
                            <input 
                                type="number" 
                                id="salePrice" 
                                name="salePrice"
                                defaultValue={book.salePrice}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả:</label>
                        <textarea 
                            id="description" 
                            name="description"
                            rows={4}
                            defaultValue={book.description}
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Hủy
                        </button>
                        <button type="submit" className="save-btn">
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProductList = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookImages, setBookImages] = useState<{ [key: number]: string }>({});
    const [pageInput, setPageInput] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [editingBook, setEditingBook] = useState<BookModel | null>(null);

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
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(book)}
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(book.bookId)}
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

            {editingBook && (
                <EditBookModal
                    isOpen={true}
                    onClose={() => setEditingBook(null)}
                    book={editingBook}
                    currentImage={bookImages[editingBook.bookId] || 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg'}
                    onUpdate={loadBooks}
                />
            )}
        </div>
    );
};

export default ProductList;
