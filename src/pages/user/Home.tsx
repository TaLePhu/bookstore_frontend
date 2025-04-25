import { useParams } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from '../../components/Banner';
import CategorySection from '../../components/CategorySection';
// import { getAllBookAndCategories } from "../../api/BookAPI";
import { useEffect, useState } from 'react';
import Category from '../../interface/Category';

interface HomeProps {
    searchKey: string;
}

const Home: React.FC<HomeProps> = ({ searchKey }) => {
    const { categoryId } = useParams();

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
    return (
        <div className="container-home">
            <Banner />
            <CategorySection searchKey={searchKey} categoryId={categoryIdNumber} />
        </div>
    );
};
// const Home = () => {
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await getAllBookAndCategories();
//                 setCategories(data);
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="container-home">
//             <Banner />
//             {isLoading ? (
//                 <p>Đang tải dữ liệu...</p>
//             ) : error ? (
//                 <p>Lỗi: {error}</p>
//             ) : (
//                 categories.map((cat) => (
//                     <CategorySection key={cat.categoryName} category={cat} />
//                 ))
//             )}
//         </div>
//     );
// };

export default Home;
