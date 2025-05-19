import '../assets/styles/ProductCard.css';
import { Link } from 'react-router-dom';
// import { Book } from "../types"; // Import từ types.ts
import BookModel from '../models/BookModel';
import ImageModel from '../models/ImageModel';
import { getAllImage } from '../api/ImageAPI';
import React, { useEffect, useState } from 'react';

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

<<<<<<< HEAD
    const iconImages = listImage.filter((image) => image.isIcon === true);

    // const imageSmall =
    //     iconImages.length > 0 && iconImages[0].imageData
    //         ? iconImages[0].imageData
    //         : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';
=======
    // Get icon images
    const iconImages = listImage.filter(img => img.isIcon);
    const imageSmall = iconImages[0]?.imageData || imageSrc;
>>>>>>> 3e5d61a38c50ce4efad7272e9327d38d98a371d2

    const salePrice = props.book.salePrice ?? 0;
    const listedPrice = props.book.listedPrice ?? 1;
    const discount = Math.round(100 - (salePrice / listedPrice) * 100);

    return (
        <Link
            to={`/detail/${props.book.bookId}`}
            // state={{
            //     product: props.book,
            //     imageSrc: imageSrc,
            //     //imageSmall: imageSmall,
            //     iconImages: iconImages,
            // }}
            className="box-item"
        >
            {/* <div className="box-item"> */}
            <img src={imageSrc} alt={props.book.bookName} />
            {discount > 0 && (
                <div className="discount-tag">-{discount}%</div>
            )}
            <h4>{props.book.bookName}</h4>
            <p>{props.book.description}</p>
            <div>
                <span className="txt-promotional-price">{props.book.salePrice}đ</span>
                <span className="txt-price">{props.book.listedPrice}đ</span>
            </div>
            {/* <div className="box-button">
                <img src="/icons/icons8-heart-32.png" alt="like" />
                <img src="/icons/icons8-cart-red-24.png" alt="cart" />
            </div> */}
            {/* </div> */}
        </Link>
    );
};

export default ProductCard;
