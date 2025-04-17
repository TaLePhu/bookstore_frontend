import '../../assets/styles/Home.css';
import '../../assets/styles/ProductCard.css';
import Banner from '../../components/Banner';
import CategorySection from '../../components/CategorySection';

interface HomeProps {
    searchKey: string;
}

const Home: React.FC<HomeProps> = ({ searchKey }) => {
    return (
        <div className="container-home">
            <Banner />
            <CategorySection searchKey={searchKey} />
        </div>
    );
};

export default Home;
