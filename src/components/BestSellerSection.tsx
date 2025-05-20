import React, { useEffect, useState } from 'react';
import BookModel from '../models/BookModel';
import { layToanBoSach } from '../api/BookAPI';
import ProductCard from './ProductCard';

const BestSellerSection: React.FC = () => {
    const [bestSellers, setBestSellers] = useState<BookModel[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const result = await layToanBoSach(0, 1000); // lấy toàn bộ
                const sorted = result.result
                    .filter(book => typeof book.sold === 'number')
                    .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
                    .slice(0, 5);
                setBestSellers(sorted);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBooks();
    }, []);

    if (error) {
        return <div>❌ Lỗi khi tải sách bán chạy: {error}</div>;
    }

    return (
        <div className="list">
            <div className="list-total">
                <h3>🔥 Sản phẩm bán chạy</h3>
            </div>
            <div className="list-item">
                {bestSellers.map((book) => (
                    <ProductCard key={book.bookId} book={book} />
                ))}
            </div>
            
        </div>
    );
};

export default BestSellerSection;