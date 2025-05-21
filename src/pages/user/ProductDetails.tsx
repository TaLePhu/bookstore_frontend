// install các thư viện này để dùng được
// npm install --save @fortawesome/fontawesome-svg-core
// npm install --save @fortawesome/free-solid-svg-icons
// npm install --save @fortawesome/react-fontawesome
//npm install react-modal

import { useLocation, useParams } from "react-router-dom";
import '../../assets/styles/ProductDetails.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faStar as faStarSolid, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Modal from "react-modal";
import axios from "axios";
import Select from "react-select";
import { SingleValue } from "react-select";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import BookModel from '../../models/BookModel';
import ImageModel from '../../models/ImageModel';
import { getBookById } from '../../api/BookAPI';
import { getAllImage } from '../../api/ImageAPI';
import toast from 'react-hot-toast';

// Modal.setAppElement("#root");
interface UserModel {
  firstName: string;
  lastName: string;
}

interface ReviewModel {
  reviewId: number;
  ratingScore: number;
  comment: string;
  createdAt: string; // hoặc Date
  user: UserModel;
}

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1); 

    //Thêm modal chọn địa chỉ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState("Chưa chọn địa chỉ");
    const [selectedProvince, setSelectedProvince] = useState<{ value: number, label: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: number, label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: number, label: string } | null>(null);

    const navigate = useNavigate();

    const [user, setUser] = useState<any | null>(null);

    const location = useLocation();
    //const { product, imageSrc } = location.state;

    const { id } = useParams();
    const [product, setProduct] = useState<BookModel | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isModalOpenReviews, setIsModalOpennReviews] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchBook = async () => {
            if (!id) return;
            try {
                const fetchedBook = await getBookById(Number(id));
                const fetchedImages = await getAllImage(Number(id));
                setProduct(fetchedBook);
                setImages(fetchedImages);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };
        fetchBook();
    }, [id]);

    const fetchReviews = async () => {
        if (!id) return;
        try {
        const res = await fetch(`http://localhost:8080/books/${id}/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
        } catch (error) {
        console.error("Lỗi tải đánh giá:", error);
        }
    };
    useEffect(() => {
        fetchReviews();
    }, [id]);

    console.log("Reviewa: ", reviews);

    const handleSubmitReview = async () => {
        if (!product || !user) return;

        if (newRating === 0) {
            toast.error("Vui lòng chọn số sao trước khi gửi!");
            return;
        }
        if (!newComment.trim()) {
            toast.error("Vui lòng nhập nhận xét!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không có token. Người dùng chưa đăng nhập?");
            return;
        }

        try {
            await axios.post(
            "http://localhost:8080/reviews",
            {
                ratingScore: newRating,
                comment: newComment,
                bookId: product.bookId,
                userId: user.userId,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            }
            );

            fetchReviews();
            toast.success("Gửi đánh giá thành công!");
            setIsModalOpennReviews(false);
            setNewRating(0);
            setNewComment("");
        } catch (error) {
            console.error("Lỗi gửi đánh giá:", error);
        }
    };

    
    // Hàm tăng số lượng
    const increaseQuantity = () => {
        if (product && quantity < (product.quantity ?? 0)) {
            setQuantity(prev => prev + 1);
        } else {
            alert("Vượt quá số lượng có sẵn trong kho.");
        }
    };

    // Hàm giảm số lượng, nhưng không nhỏ hơn 1
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Load danh sách tỉnh
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/")
            .then(response => {
                setProvinces(response.data.map((prov: { code: number, name: string }) => ({
                    value: prov.code, label: prov.name
                })));
            });
    }, []);

    interface District {
        code: string;
        name: string;
      }
      
      interface Ward {
        code: string;
        name: string;
      }
    // Khi chọn tỉnh, load danh sách huyện
    const handleProvinceChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setSelectedWard(null);
        if (selectedOption) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedOption.value}?depth=2`)
                .then(response => {
                    setDistricts(response.data.districts.map((dist: District) => ({
                        value: dist.code, label: dist.name
                    })));
                });
        }
    };

    // Khi chọn huyện, load danh sách xã
    const handleDistrictChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        setSelectedDistrict(selectedOption);
        setSelectedWard(null);
        if (selectedOption) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedOption.value}?depth=2`)
                .then(response => {
                    setWards(response.data.wards.map((ward: Ward) => ({
                        value: ward.code, label: ward.name
                    })));
                });
        }
    };

    // Khi chọn xã
    const handleWardChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        setSelectedWard(selectedOption);
    };

    // Xác nhận địa chỉ
    const handleSaveAddress = () => {
        if (selectedProvince && selectedDistrict && selectedWard) {
            setSelectedAddress(`${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`);
            setIsModalOpen(false);
        } else {
            alert("Vui lòng chọn đầy đủ tỉnh, huyện, xã.");
        }
    };

    //add to cart
    const { addToCart } = useCart();

      //dinh dang tien 
      const formatCurrency = (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    
    //Lấy dữ liệu từ trang Home
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    console.log("User trong detail: ",user);
    const token = localStorage.getItem("token");
    console.log("token: ", token);
    
    if (!product) return <p>Không tìm thấy sản phẩm</p>;
    //console.log("imageSrc", imageSrc);

    const handleAddToCart = async () => {
        if (quantity > (product.quantity ?? 0)) {
            alert("Không đủ hàng trong kho.");
            return;
        }
        const item = {
            bookId: product.bookId,
            bookName: product.bookName ?? "", 
            quantity,
            salePrice: product.salePrice ?? 0,
            stock: product.quantity ?? 0,
            image: images[0]?.imageData || "",
        };

        addToCart(item);
    };

      
      const handleBuyNow = () => {
        if (quantity > (product.quantity ?? 0)) {
          alert("Không đủ hàng trong kho.");
          return;
        }
      
        const item = {
            bookId: product.bookId,
            bookName: product.bookName ?? "", 
            quantity,
            salePrice: product.salePrice ?? 0,
            stock: product.quantity ?? 0,
            image: images[0]?.imageData || "",
        };
      
        addToCart(item);
        navigate("/cart"); // chuyển sang trang giỏ hàng
    };

    function renderStars(averageRating: any) {
        const stars = [];
        // Lấy số nguyên phần sao đầy đủ
        const fullStars = Math.floor(averageRating);
        // Kiểm tra có sao nửa không
        const hasHalfStar = averageRating - fullStars >= 0.5;
        // Số sao trống
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Thêm sao đầy đủ
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={'full-' + i} icon={faStarSolid} style={{ color: '#f8ce0b' }} />);
        }

        // Thêm sao nửa
        if (hasHalfStar) {
            stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} style={{ color: '#f8ce0b' }} />);
        }

        // Thêm sao trống (màu xám)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FontAwesomeIcon key={'empty-' + i} icon={faStarRegular} style={{ color: '#ccc' }} />);
        }

        return stars;
    }

    const isOutOfStock = (Number(product.quantity) || 0) <= 0;

    const totalScore = reviews.reduce((sum, review) => sum + review.ratingScore, 0);
    const averageScore = reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : "0.0";

    return(
        <div className="container-details">
            <div className="details">
                <div className="img-info">
                    <div className="img-all">
                        <div className="img-main">
                            <img src={images[0]?.imageData} alt={product.bookName} className="imgMain"/>
                        </div>
                        <div className="img-orther">
                            <div className="img-orther-item">
                                <img src={images[0]?.imageData} alt={product.bookName} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={images[0]?.imageData} alt={product.bookName} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={images[0]?.imageData} alt={product.bookName} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={images[0]?.imageData} alt={product.bookName} className="imgOrther"/>
                            </div>
                        </div>
                    </div>
                    <div className="btn-all">
                        <div
                            className={`btn-add-cart ${isOutOfStock ? 'disabled' : ''}`}
                            onClick={!isOutOfStock ? handleAddToCart : undefined}
                        >
                            <img src="/icons/icons8-cart-24.png" alt="icon-cart" />
                            <span>Thêm vào giỏ hàng</span>
                        </div>
                        <div
                            className={`btn-buy ${isOutOfStock ? 'disabled' : ''}`}
                            onClick={!isOutOfStock ? handleBuyNow : undefined}
                        >
                            <span>Mua ngay</span>
                        </div>
                    </div>
                    <div className="promotional-info">
                        <h3 className="policy-title">Chính sách ưu đãi:</h3>
                        <div className="policy-item">
                            <p className="policy-label">Thời gian giao hàng: <span className="policy-value">Giao nhanh và uy tín</span></p>
                            
                        </div>
                        <div className="policy-item">
                            <p className="policy-label">Chính sách đổi trả: <span className="policy-value">Đổi trả miễn phí toàn quốc</span></p>
                            
                        </div>
                        <div className="policy-item">
                            <p className="policy-label">Chính sách bảo hành: <span className="policy-value">Bảo hành chính hãng</span></p>
                        </div>
                    </div>
                </div>
                <div className="detail-info">
                    <div className="info-product">
                        <p className="title-product">{product.bookName}</p>
                        <div className="info-product1">
                            <div className="info-product1-item info-left">
                                <p className="info-product1-label">Nhà cung cấp: 
                                    <span className="info-product1-value"> {product.supplier}</span>
                                </p>
                                <p className="info-product1-label">Nhà xuất bản: 
                                    <span className="info-product1-value"> {product.publisher}</span>
                                </p>
                            </div>
                            <div className="info-product1-item info-right">
                                <p className="info-product1-label">Tác giả: 
                                    <span className="info-product1-value"> {product.authorName}</span>
                                </p>
                                {/* <p className="info-product1-label">Hình thức bìa: 
                                    <span className="info-product1-value"> bbbb</span>
                                </p> */}
                            </div>
                        </div>
                        <div className="info-product2">
                            <div className="info-product2-review">
                                <div className="star-reviews">
                                    {renderStars(Number(averageScore))}
                                </div>
                                <p className="info-product2-reviews-label">({reviews.length} đánh giá)</p>
                            </div>
                            <div className="info-product2-separator" >|</div>
                            <div className="info-product2-item">
                                <p className="info-product2-label">Số lượng: 
                                    <span className="info-product2-value"> {product.quantity}</span>
                                </p>
                            </div>
                        </div>
                        <div className="price">
                            <p>{formatCurrency(product.salePrice ?? 0)}</p>
                            <span>{formatCurrency(product.listedPrice ?? 0)}</span>
                        </div>
                    </div>
                    <div className="info-ship">
                        <p className="title-info-ship">Thông tin vận chuyển</p>
                        <div className="ship-address">
                            <span>Giao hàng đến: </span>
                            <span className="address">{selectedAddress}</span>
                            <a className="change-address" onClick={() => setIsModalOpen(true)}>Thay đổi</a>
                        </div>
                    {/* Modal chọn địa chỉ */}
                    <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="ReactModal__Content">
                        <h2>Chọn địa chỉ</h2>
                        
                        <Select
                            options={provinces}
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            placeholder="Chọn tỉnh/thành phố"
                            className="select-item"
                        />

                        <Select
                            options={districts}
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            isDisabled={!selectedProvince}
                            className="select-item"
                        />

                        <Select
                            options={wards}
                            value={selectedWard}
                            onChange={handleWardChange}
                            placeholder="Chọn phường/xã"
                            isDisabled={!selectedDistrict}
                            className="select-item"
                        />

                        <button onClick={handleSaveAddress} className="btn-save">Xác nhận</button>
                        <button onClick={() => setIsModalOpen(false)} className="btn-dong">Đóng</button>
                    </Modal>
                   

                        <div className="shipping-option">
                                <p className="shipping-method"><FontAwesomeIcon icon={faTruck} /><strong> Giao hàng tiêu chuẩn</strong></p>
                                <p className="shipping-date">Dự kiến giao <strong>Thứ bảy - 15/03</strong></p>
                        </div>
                        <div className="related-deals">
                            <div className="deals-header">
                                <strong>Ưu đãi liên quan</strong>
                                {/* <a href="#" className="view-more">Xem thêm</a> */}
                            </div>
                            <div className="deals-list">
                                <div className="deal-item"><span className="icon">🎟️</span> Mã giảm 10k - Tất cả</div>
                                <div className="deal-item"><span className="icon">🎟️</span> Mã giảm 25k - Tiki</div>
                                <div className="deal-item"><span className="icon">💳</span> Home credit: Giảm 5%</div>
                                <div className="deal-item"><span className="icon">💰</span> Zalopay: Giảm 20%</div>
                            </div>
                        </div>
                        <div className="quantity">
                            <p className="quantity-label">Số lượng:</p>
                            <div className="quantity-controls">
                                <button className="quantity-btn" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><p>-</p></button>
                                {/* <span className="quantity-value">{quantity}</span> */}
                                <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    max={product.quantity}
                                    readOnly
                                    className="quantity-value"

                                    onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setQuantity(isNaN(value) ? 1 : Math.min(value, product.quantity ?? value));
                                        
                                }}
                                />
                                <button className="quantity-btnt" onClick={() => setQuantity(prev => Math.min(product.quantity ?? prev + 1, prev + 1))}><p>+</p></button>
                            </div>
                        </div>
                    </div>

                    <div className="info-details">
                        <p className="title-info-ship">Thông tin chi tiết</p>
                        <div className="info-details-main">
                            <div className="info-details-item">
                                <p className="info-details-label">Mã hàng: </p> 
                                <p className="info-details-value"> {product.bookId}</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">ISBN: </p>
                                <p className="info-details-value"> {product.isbn}</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Tác giả: </p>
                                <p className="info-details-value"> {product.authorName}</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Nhà xuất bản: </p>
                                <p className="info-details-value"> {product.publisher}</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Số trang: </p>
                                <p className="info-details-value"> {product.numberOfPages}</p>
                            </div>
                        </div>
                        <p className="add-info">Giá sản phẩm trên Website đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...</p>
                    </div>
                    <div className="desc-product">
                        <p className="title-info-ship">Mô tả sản phẩm</p>
                        <p className="content-info"> {product.description}</p>
                    </div>
                </div>
            </div>
            <div className="reviews">
                <div className="reviews-box">
                    <p className="reviews-header">Đánh giá sản phẩm</p>
                    <div className="reviews-content">
                        <div className="point-section">
                            <div className="point-reviews">
                                <p>{averageScore}</p>
                                <span> /5</span>
                            </div>
                            <div className="star-reviews">
                                {renderStars(Number(averageScore))}    
                            </div>
                            <p className="reviews-label">({reviews.length} đánh giá)</p>
                        </div>
                        .
                        {user && (
                            <div className="btn-reviews" onClick={() => setIsModalOpennReviews(true)}>
                                <p>Viết đánh giá</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="review-list">
                    {reviews.length === 0 ? (
                        <p>Chưa có đánh giá nào.</p>
                    ) : (
                        reviews.map((review) => (
                        <div key={review.reviewId} className="review-item">
                            <div className="review-item-user">
                                <div className="review-item-user-name">
                                    {review.user.firstName} {review.user.lastName}
                                </div>
                                <div className="review-item-user-rating">
                                    {renderStars(review.ratingScore)}
                                </div>
                            </div>
                            <div className="comment">
                                <div className="review-item-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                                <p className="reviews-comment">{review.comment}</p>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            {isModalOpenReviews && (
                <div className="modal-review">
                    <div className="modal-content">
                        <h2 className="modal-header">Viết đánh giá</h2>

                        <label className="select-star-header">Chọn số sao:</label>
                        <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className="select-star"
                        >
                            <option value={0}>Chọn sao</option>
                            {[5, 4, 3, 2, 1].map((val) => (
                                <option key={val} value={val}> 
                                   {val} {'⭐'.repeat(val)} 
                                </option>
                            ))}
                        </select>

                        <label className="comment-header">Nhận xét:</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-input"
                            rows={3}
                        />

                        <div className="btn-modal-reviews">
                            <button className="btn-cancle-reviews" onClick={() => setIsModalOpennReviews(false)}>
                                Hủy
                            </button>
                            <button className="btn-send-reviews" onClick={handleSubmitReview}>
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default ProductDetails;