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
    const [uploadData, setUploadData] = useState(true);
    const [error, setError] = useState(null);

    const bookId: number = props.book.bookId;

    useEffect(() => {
        getAllImage(bookId)
            .then((ImageData) => {
                setListImage(ImageData);
                setUploadData(false);
            })
            .catch((error) => {
                setError(error.message);
                setUploadData(false);
            });
    }, [bookId]);

    if (uploadData) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Thông báo lỗi bên ProductCart: {error}</h1>
            </div>
        );
    }

    // Kiểm tra nếu có hình ảnh, nếu không thì dùng hình mặc định
    const imagePath =
        listImage.length > 0 && listImage[0].path
            ? listImage[0].path
            : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';
    const imageSrc =
        listImage.length > 0 && listImage[0].imageData
            ? listImage[0].imageData
            : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';

    const iconImages = listImage.filter((image) => image.isIcon === true);

    const imageSmall =
        iconImages.length > 0 && iconImages[0].imageData
            ? iconImages[0].imageData
            : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg';

    return (
        <Link
            to={`/detail/${props.book.bookId}`}
            state={{
                product: props.book,
                imageSrc: imageSrc,
                imageSmall: imageSmall,
                iconImages: iconImages,
            }}
            className="box-item"
        >
            {/* <div className="box-item"> */}
            <img src={imageSrc} alt={props.book.bookName} />
            <h4>{props.book.bookName}</h4>
            <p>{props.book.description}</p>
            <div>
                <span className="txt-promotional-price">{props.book.salePrice}đ</span>
                <span className="txt-price">{props.book.listedPrice}đ</span>
            </div>
            <div className="box-button">
                <img src="/icons/icons8-heart-32.png" alt="like" />
                <img src="/icons/icons8-cart-red-24.png" alt="cart" />
            </div>
            {/* </div> */}
        </Link>
    );
};

export default ProductCard;
