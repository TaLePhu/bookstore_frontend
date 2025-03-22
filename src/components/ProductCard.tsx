import '../assets/styles/ProductCard.css';
import { Link } from "react-router-dom";
import { Book } from "../types"; // Import từ types.ts

const ProductCard = ({ item }: { item: Book }) => (
    <div key={item.id} className="box-item">
        <Link to={`/detail/${item.id}`} state={{ product: item }}>
            <img src={item.image || "/default-book.jpg"} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div>
                <span className="txt-promotional-price">{item.salePrice}đ</span>
                <span className="txt-price">{item.price}đ</span>
            </div>
        </Link>
        <div className="box-button">
            <img src="/icons/icons8-heart-32.png" alt="like" />
            <img src="/icons/icons8-cart-red-24.png" alt="cart" />
        </div>
    </div>
);

export default ProductCard;
