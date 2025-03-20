import { useState, useEffect } from "react";
import '../assets/styles/Banner.css';

const BANNER_IMAGES = [
    "https://cdn1.fahasa.com/media/magentothem/banner7/Zen_840x320.png",
    "https://cdn1.fahasa.com/media/magentothem/banner7/Mainbanner_1503_840x320.png",
    "https://cdn1.fahasa.com/media/magentothem/banner7/muasamkhongtienmatT325_840x320.png"
];

const Banner = () => {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner">
            <button className="prev" onClick={() => setCurrentBanner((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)}>❮</button>
            <img src={BANNER_IMAGES[currentBanner]} alt="Banner" className="banner-image" />
            <button className="next" onClick={() => setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length)}>❯</button>
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
    );
};

export default Banner;
