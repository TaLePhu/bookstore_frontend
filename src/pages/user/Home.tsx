import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../assets/styles/Home.css';
import '../../assets/styles/Card.css';
import { getAllBook } from "../../api/BookAPI";


//data
const DATA = [
    {
        category: "Truyện tranh",
        items: [
            { id: 1, title: "Item 1", price: 300, description: "Description for item 1", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg"},
            { id: 2, title: "Item 2", price: 300, description: "Description for item 2", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg" },
            { id: 3, title: "Item 3", price: 300, description: "Description for item 3", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg"},
            { id: 4, title: "Item 4", price: 300, description: "Description for item 4", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg"}
        ]
    },
    {
        category: "Tiểu thuyết",
        items: [
            { id: 5, title: "Item 5", price: 300, description: "Description for item 5", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg"},
            { id: 6, title: "Item 6", price: 300, description: "Description for item 6", image: "https://cdn1.fahasa.com/media/catalog/product/9/7/9786043561272_1_1.jpg"}
        ]
    }
];

const BANNER_IMAGES = [
    "https://cdn1.fahasa.com/media/magentothem/banner7/Zen_840x320.png",
    "https://cdn1.fahasa.com/media/magentothem/banner7/Mainbanner_1503_840x320.png",
    "https://cdn1.fahasa.com/media/magentothem/banner7/muasamkhongtienmatT325_840x320.png"
];

const Home = () => {


    const [currentBanner, setCurrentBanner] = useState(0);

    // Tự động chuyển ảnh mỗi 3 giây
    useEffect(() => {
        const interval = setInterval(() => {
            nextBanner();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentBanner]);

    const nextBanner = () => {
        setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    };

    const prevBanner = () => {
        setCurrentBanner((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
    };

    return (
        <div className="container-home">
            {/* Banner */}
            <div className="banner">
                <button className="prev" onClick={prevBanner}>❮</button>
                <img src={BANNER_IMAGES[currentBanner]} alt="Banner" className="banner-image" />
                <button className="next" onClick={nextBanner}>❯</button>
                {/* Dots in the image */}
                <div className="dots-overlay">
                    {BANNER_IMAGES.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentBanner ? "active" : ""}`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
                </div>
            </div>
            
            

            {/* List item*/}
            {DATA.map(category => (
                <div key={category.category} className="list">
                    <div className="list-total">
                        <h3>{category.category}</h3>
                        <Link to="/category">Xem thêm</Link>
                    </div>
                    <div className="list-item">
                        {category.items.slice(0, 10).map(item => (
                            <div key={item.id} className="box-item">
                                <Link to={`/detail/${item.id}`} state={{ product: item }}>
                                    <img src={item.image} alt={item.title} />
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <div>
                                        <span className="txt-promotional-price">300đ</span>
                                        <span className="txt-price">{item.price}</span>
                                    </div>
                                </Link>
                                <div className="box-button">
                                    <img src="/icons/icons8-heart-32.png" alt="like" />
                                    <img src="/icons/icons8-cart-red-24.png" alt="like" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;