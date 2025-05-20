import { useParams } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from '../../components/Banner';
import CategorySection from '../../components/CategorySection';
// import { getAllBookAndCategories } from "../../api/BookAPI";
import { useEffect, useState } from 'react';
import Category from '../../models/Category';
import { getAllCategories } from '../../api/CategoryAPI';
import BestSellerSection from '../../components/BestSellerSection';


interface HomeProps {
    searchKey: string;
}

const Home: React.FC<HomeProps> = ({ searchKey }) => {
    const { categoryId, categoryName } = useParams();
    const [categories, setCategories] = useState<Category[]>([]);

    let categoryIdNumber = 0;

    try {
        categoryIdNumber = parseInt(categoryId + ''); 
    } catch (error) {
        categoryIdNumber = 0;
        console.log('error categoryId: ', error);
    }

    if (Number.isNaN(categoryIdNumber)) {
        categoryIdNumber = 0;
    }
     useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thể loại:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container-home">
            <Banner />
            <BestSellerSection/>
            {/* <CategorySection searchKey={searchKey} categoryId={categoryIdNumber} /> */}
            {searchKey === '' && categories.map((category) => (
                <div key={category.categoryId} className="category-block">
                    <CategorySection searchKey={searchKey} categoryId={category.categoryId}  categoryName={category.categoryName} />
                </div>
            ))}
        </div>
    );
};
export default Home;
