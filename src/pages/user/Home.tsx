import { useState, useEffect } from 'react';
import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from '../../components/Banner';
import CategorySection from '../../components/CategorySection';
//import { Book, ApiBook, Category } from "../../types"; // Import từ types.ts
import { Book } from '../../interface/Book';
import { ApiBook } from '../../interface/ApiBook';
import { Category } from '../../interface/Category';

const Home = () => {
    return (
        <div className="container-home">
            <Banner />
            {/* {categories.length > 0 ? (
                categories.map(category => (
                    <CategorySection key={category.category} category={category} />
                ))
            ) : (
                <p>Không có sách nào để hiển thị.</p>
            )} */}
            <CategorySection />
        </div>
    );
};

export default Home;
