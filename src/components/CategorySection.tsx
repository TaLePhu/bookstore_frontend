import { Link } from "react-router-dom";
import '../assets/styles/ProductCard.css';
import ProductCard from "./ProductCard";
//import { Book, Category } from "../types"; // Import từ types.ts
import {Category} from "../interface/Category";
import React, { useEffect, useState } from "react";
import BookModel from "../models/BookModel"; 
import ImageModel from "../models/ImageModel"; 
import { getAllBook } from '../api/BookAPI';

// const CategorySection = ({ category }: { category: Category }) => (
//     <div className="list">
//         <div className="list-total">
//             <h3>{category.category}</h3>
//             <Link to="/category">Xem thêm</Link>
//         </div>
//         <div className="list-item">
//             {category.items.slice(0, 10).map((item) => (
//                 <ProductCard key={item.id} item={{ ...item }} /> 
//                 // Đảm bảo dữ liệu phù hợp với ProductCard
//             ))}
//         </div>
//     </div>
// );

const CategorySection: React.FC = () => {
    const [listBook, setListBook] = useState<BookModel[]>([]);
    const [uploadData, setUploadData] = useState(true);
    const[error, setError] = useState(null);

    useEffect(() => {
            getAllBook().then(
                BookData => {
                    setListBook(BookData);
                    setUploadData(false);
                }
            ).catch(
                error => {
                    setError(error.message);
                    setUploadData(false);
                }
            )
                
        }, []);

    if(uploadData) {
        return <div>
            <h1>Loading...</h1>
        </div>;
    }

    if(error) {
        return <div>
            <h1>Thông báo lỗi bên Category: {error}</h1>    
        </div>;
    } 

    return(
        <div className="list">
            <div className="list-total">
                <h3>Danh sách sản phẩm</h3>
                <Link to="/category">Xem thêm</Link>
            </div>
            <div className="list-item">
                {listBook.slice(0, 10).map((item) => (
                    <ProductCard key={item.bookId} book={{ ...item }} /> 
                    // Đảm bảo dữ liệu phù hợp với ProductCard
                ))}
            </div>
        </div>
    )

}

export default CategorySection;
