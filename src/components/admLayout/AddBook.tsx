import React, { useState } from 'react';
import { createBook } from '../../api/BookAPI';
import { uploadImage } from '../../api/ImageAPI';
import Book from '../../models/BookModel';
import '../../assets/styles/AddBook.css';

interface AddBookProps {
    onSuccess?: () => void;
}

const AddBook = ({ onSuccess }: AddBookProps) => {
    const [bookData, setBookData] = useState<Partial<Book>>({
        bookName: '',
        authorName: '',
        isbn: '',
        description: '',
        listedPrice: 0,
        salePrice: 0,
        quantity: 0,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg');
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBookData(prev => ({
            ...prev,
            [name]: name === 'listedPrice' || name === 'salePrice' || name === 'quantity' 
                ? parseFloat(value) || 0 
                : value
        }));
    };

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
            // Tạo sách mới
            const createdBook = await createBook(bookData as Book);
            if (createdBook && createdBook.bookId) {
                // Nếu có ảnh được chọn, upload ảnh
                if (selectedFile) {
                    try {
                        const imageSuccess = await uploadImage(createdBook.bookId, selectedFile, false);
                        if (!imageSuccess) {
                            throw new Error('Failed to upload image');
                        }
                    } catch (imageError) {
                        console.error('Error uploading image:', imageError);
                        alert('Thêm sách thành công nhưng upload ảnh thất bại!');
                    }
                }
                alert('Thêm sách thành công!');
                // Reset form
                setBookData({
                    bookName: '',
                    authorName: '',
                    isbn: '',
                    description: '',
                    listedPrice: 0,
                    salePrice: 0,
                    quantity: 0,
                });
                setSelectedFile(null);
                setPreviewUrl('https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg');
                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                alert('Thêm sách thất bại!');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Có lỗi xảy ra khi thêm sách!');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="add-book-container">
            <h2>Thêm Sách Mới</h2>
            <form onSubmit={handleSubmit} className="add-book-form">
                <div className="form-group">
                    <div className="book-image-preview">
                        <img src={previewUrl} alt="Book preview" />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="imageInput" className="change-image-btn">
                                Chọn ảnh
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bookName">Tên sách:</label>
                    <input
                        type="text"
                        id="bookName"
                        name="bookName"
                        value={bookData.bookName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="authorName">Tác giả:</label>
                    <input
                        type="text"
                        id="authorName"
                        name="authorName"
                        value={bookData.authorName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN:</label>
                    <input
                        type="text"
                        id="isbn"
                        name="isbn"
                        value={bookData.isbn}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={bookData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="listedPrice">Giá niêm yết:</label>
                    <input
                        type="number"
                        id="listedPrice"
                        name="listedPrice"
                        value={bookData.listedPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="salePrice">Giá bán:</label>
                    <input
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={bookData.salePrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Số lượng:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={bookData.quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isUploading}>
                    {isUploading ? 'Đang thêm...' : 'Thêm sách'}
                </button>
            </form>
        </div>
    );
};

export default AddBook; 