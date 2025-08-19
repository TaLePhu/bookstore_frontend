import '../assets/styles/ProductCard.css';
import { Link } from 'react-router-dom';
// import { Book } from "../types"; // Import từ types.ts
import BookModel from '../models/BookModel';
import ImageModel from '../models/ImageModel';
import { getAllImage } from '../api/ImageAPI';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

interface ProductCardInterface {
    book: BookModel;
}

const ProductCard: React.FC<ProductCardInterface> = (props) => {
    const [listImage, setListImage] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const bookId: number = props.book.bookId;

    const loadImages = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const imageData = await getAllImage(bookId);
            setListImage(imageData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load images');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [bookId]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>Error loading images: {error}</p>
            </div>
        );
    }

    // Get main image
    const mainImage = listImage.find(img => !img.isIcon) || listImage[0];
    const imageSrc = mainImage?.imageData || 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';

    // const imageSmall =
    //     iconImages.length > 0 && iconImages[0].imageData
    //         ? iconImages[0].imageData
    //         : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';

    // Get icon images
    const iconImages = listImage.filter(img => img.isIcon);
    const imageSmall = iconImages[0]?.imageData || imageSrc;


    const salePrice = props.book.salePrice ?? 0;
    const listedPrice = props.book.listedPrice ?? 1;
    const discount = Math.round(100 - (salePrice / listedPrice) * 100);

    function renderStars(averageRating: any) {
        const stars = [];
        // Lấy số nguyên phần sao đầy đủ
        const fullStars = Math.floor(averageRating);
        // Kiểm tra có sao nửa không
        const hasHalfStar = averageRating - fullStars >= 0.5;
        // Số sao trống
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Thêm sao đầy đủ
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={'full-' + i} icon={faStarSolid} style={{ color: '#f8ce0b' }} className='start-icon'/>);
        }

        // Thêm sao nửa
        if (hasHalfStar) {
            stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} style={{ color: '#f8ce0b' }} className='start-icon' />);
        }

        // Thêm sao trống (màu xám)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FontAwesomeIcon key={'empty-' + i} icon={faStarRegular} style={{ color: '#ccc' }}  className='start-icon'/>);
        }

        return stars;
    }

    return (
        <Link
            to={`/detail/${props.book.bookId}`}
            className="box-item"
        >
            <img src={imageSrc} alt={props.book.bookName} />
            {discount > 0 && (
                <div className="discount-tag">-{discount}%</div>
            )}
            {(Number(props.book.quantity) || 0) == 0 && (
                <div className="sold-outp">Hết hàng</div>
            )}
            <h4>{props.book.bookName}</h4>
            <p>{props.book.description}</p>
            <div>
                <span className="txt-promotional-pricep">{props.book.salePrice?.toLocaleString()} đ</span>
                <span className="txt-price">{props.book.listedPrice?.toLocaleString()} đ</span>
            </div>
            <span className="txt-rating">{renderStars(props.book.averageRating)}</span>
            <span className="txt-sold">{props.book.sold} đã bán</span>
        </Link>
    );
};

export default ProductCard;
