import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from "../../components/Banner";
import CategorySection from "../../components/CategorySection";
import { getAllBook } from "../../api/BookAPI";


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

const SAMPLE_DATA: Category[] = [
    {
        category: "Truyện tranh",
        items: [
            { id: 1, title: "Item 1", price: 300, description: "Description for item 1", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg" },
            { id: 2, title: "Item 2", price: 300, description: "Description for item 2", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg" }
        ]
    },
    {
        category: "Tiểu thuyết",
        items: [
            { id: 3, title: "Item 3", price: 300, description: "Description for item 3", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg" },
            { id: 4, title: "Item 4", price: 300, description: "Description for item 4", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg" }
        ]
    }
];

const Home = () => {
    const [categories, setCategories] = useState<Category[]>(SAMPLE_DATA);

    return (
        <div className="container-home">
            <Banner />
            {categories.map((category) => (
                <CategorySection key={category.category} category={category} />
            ))}
        </div>
    );
};

export default Home;
