import { useParams } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from '../../components/Banner';
import CategorySection from '../../components/CategorySection';

interface HomeProps {
    searchKey: string;
}

const Home: React.FC<HomeProps> = ({ searchKey }) => {
    const { categoryId } = useParams(); // get categoryId từ url gán vào categoryId

    let categoryIdNumber = 0;

    try {
        categoryIdNumber = parseInt(categoryId + ''); // NaN
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

export default Home;
