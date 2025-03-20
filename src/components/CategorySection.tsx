import { Link } from "react-router-dom";
import '../assets/styles/ProductCard.css';
import ProductCard from "./ProductCard";

interface Book {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
}

interface Category {
    category: string;
    items: Book[];
}

const CategorySection = ({ category }: { category: Category }) => (
    <div className="list">
        <div className="list-total">
            <h3>{category.category}</h3>
            <Link to="/category">Xem thêm</Link>
        </div>
        <div className="list-item">
            {category.items.slice(0, 10).map((item) => (
                <ProductCard key={item.id} item={item} />
            ))}
        </div>
    </div>
);

export default CategorySection;
