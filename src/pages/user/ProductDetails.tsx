// install các thư viện này để dùng được
// npm install --save @fortawesome/fontawesome-svg-core
// npm install --save @fortawesome/free-solid-svg-icons
// npm install --save @fortawesome/react-fontawesome
//npm install react-modal

import { useLocation } from "react-router-dom";
import '../../assets/styles/ProductDetails.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faStar } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import Select from "react-select";
import { SingleValue } from "react-select";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// Modal.setAppElement("#root");

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1); 

    // Hàm tăng số lượng
    const increaseQuantity = () => {
        if (quantity < product.quantity) {
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

    //Thêm modal chọn địa chỉ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // const [selectedProvince, setSelectedProvince] = useState(null);
    // const [selectedDistrict, setSelectedDistrict] = useState(null);
    // const [selectedWard, setSelectedWard] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("Chưa chọn địa chỉ");
    const [selectedProvince, setSelectedProvince] = useState<{ value: number, label: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: number, label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: number, label: string } | null>(null);

    const navigate = useNavigate();

    const [user, setUser] = useState<any | null>(null);
    


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
    const location = useLocation();
    const { product, imageSrc, imageSmall } = location.state;
    if (!product) return <p>Không tìm thấy sản phẩm</p>;
    //console.log("imageSrc", imageSrc);

    const handleAddToCart = async () => {
        if (quantity > product.quantity) {
            alert("Không đủ hàng trong kho.");
            return;
        }
        const item = {
          bookId: product.bookId,
          bookName: product.bookName,
          quantity,
          salePrice: product.salePrice,
          stock: product.quantity, // số lượng còn trong kho
          image: imageSrc,
        };
        // try {
        //     const jwt = localStorage.getItem("jwt");
        //     await axios.post("http://localhost:8080/api/cart/add", item, {
        //     headers: {
        //         Authorization: `Bearer ${jwt}`,
        //     },
        //     });
        //     alert("Đã thêm vào giỏ hàng!");
        // } catch (err) {
        //     console.error("Lỗi thêm giỏ hàng:", err);
        //     alert("Lỗi khi thêm giỏ hàng");
        // }
        addToCart(item);
      };

      
      const handleBuyNow = () => {
        if (quantity > product.quantity) {
          alert("Không đủ hàng trong kho.");
          return;
        }
      
        const item = {
          bookId: product.bookId,
          bookName: product.bookName,
          quantity,
          salePrice: product.salePrice,
          stock: product.quantity,
          image: imageSrc,
        };
      
        addToCart(item);
        navigate("/cart"); // chuyển sang trang giỏ hàng
    };

    return(
        <div className="container-details">
            <div className="details">
                <div className="img-info">
                    <div className="img-all">
                        <div className="img-main">
                            <img src={imageSrc} alt={product.title} className="imgMain"/>
                        </div>
                        <div className="img-orther">
                            <div className="img-orther-item">
                                <img src={imageSmall} alt={product.title} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={product.image} alt={product.title} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={product.image} alt={product.title} className="imgOrther"/>
                            </div>
                            <div className="img-orther-item">
                                <img src={product.image} alt={product.title} className="imgOrther"/>
                            </div>
                        </div>
                    </div>
                    <div className="btn-all">
                        <div className="btn-add-cart">
                            <img src="/icons/icons8-cart-24.png" alt="icon-cart" />
                            <span onClick={handleAddToCart}>Thêm vào giỏ hàng</span>
                        </div>
                        <div className="btn-buy" onClick={handleBuyNow}>
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
                                    <span className="info-product1-value"> CÔNG TY CỔ PHẦN SBOOKS</span>
                                </p>
                                <p className="info-product1-label">Nhà xuất bản: 
                                    <span className="info-product1-value"> Dân trí</span>
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
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                                <p className="info-product2-reviews-label">({product.averageRating} đánh giá)</p>
                            </div>
                            <div className="info-product2-separator" >|</div>
                            <div className="info-product2-item">
                                <p className="info-product2-label">Số lượng: 
                                    <span className="info-product2-value"> {product.quantity}</span>
                                </p>
                            </div>
                        </div>
                        <div className="price">
                            <p>{formatCurrency(product.salePrice)}</p>
                            <span>{formatCurrency(product.listedPrice)}</span>
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
                                    setQuantity(isNaN(value) ? 1 : Math.min(value, product.quantity));
                                }}
                                />
                                <button className="quantity-btn" onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}><p>+</p></button>
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
                                <p className="info-details-value"> Dân trí</p>
                            </div>
                            {/* <div className="info-details-item">
                                <p className="info-details-label">Năm xuất bản: </p>
                                <p className="info-details-value"> 2019</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Số trang: </p>
                                <p className="info-details-value">123</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Hình thức: </p>
                                <p className="info-details-value">123456789</p>
                            </div> */}
                        </div>
                        <p className="add-info">Giá sản phẩm trên Website đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...</p>
                    </div>
                    <div className="desc-product">
                        <p className="title-info-ship">Mô tả sản phẩm</p>
                        <p className="content-info"> {product.description}</p>
                    </div>
                </div>
            </div>
            {/* <div className="reviews">

            </div> */}
        </div>
    );
};

export default ProductDetails;