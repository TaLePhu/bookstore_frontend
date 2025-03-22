import { Link } from "react-router-dom";
import '../assets/styles/ProductCard.css';
import ProductCard from "./ProductCard";
import { Book, Category } from "../types"; // Import từ types.ts

const CategorySection = ({ category }: { category: Category }) => (
    <div className="list">
        <div className="list-total">
            <h3>{category.category}</h3>
            <Link to="/category">Xem thêm</Link>
        </div>
        <div className="list-item">
            {category.items.slice(0, 10).map((item) => (
                <ProductCard key={item.id} item={{ ...item }} /> 
                // Đảm bảo dữ liệu phù hợp với ProductCard
            ))}
        </div>
    </div>
);

export default CategorySection;
