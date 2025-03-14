import { useLocation } from "react-router-dom";
import '../../assets/styles/ProductDetails.css';
import { useState } from "react";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1); 

    // Hàm tăng số lượng
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Hàm giảm số lượng, nhưng không nhỏ hơn 1
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const location = useLocation();
    const product = location.state?.product; 
    if (!product) return <p>Không tìm thấy sản phẩm</p>;

    return(
        <div className="container-details">
            <div className="details">
                <div className="img-info">
                    <div className="img-all">
                        <div className="img-main">
                            <img src={product.image} alt={product.title} className="imgMain"/>
                        </div>
                        <div className="img-orther">
                            <div className="img-orther-item">
                                <img src={product.image} alt={product.title} className="imgOrther"/>
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
                            <span>Thêm vào giỏ hàng</span>
                        </div>
                        <div className="btn-buy">
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
                        <p className="title-product">{product.title}</p>
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
                                    <span className="info-product1-value"> aaaa</span>
                                </p>
                                <p className="info-product1-label">Hình thức bìa: 
                                    <span className="info-product1-value"> bbbb</span>
                                </p>
                            </div>
                        </div>
                        <div className="info-product2">
                            <div className="info-product2-item">
                                <p className="info-product2-label">Đã bán: 
                                    <span className="info-product2-value"> 2.1k</span>
                                </p>
                            </div>
                        </div>
                        <div className="price">
                            <p>61.300 đ</p>
                            <span>109.000 đ</span>
                        </div>
                    </div>
                    <div className="info-ship">
                        <p className="title-info-ship">Thông tin vận chuyển</p>
                        <div className="ship-address">
                            <span>Giao hàng đến: </span>
                            <span className="address">Phường Bến Nghé, Quận 1, Hồ Chí Minh</span>
                            <a href="#" className="change-address">Thay đổi</a>
                        </div>
                        <div className="shipping-option">
                                <p className="shipping-method">🚛<strong>Giao hàng tiêu chuẩn</strong></p>
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
                                <button className="quantity-btn" onClick={decreaseQuantity}><p>-</p></button>
                                <span className="quantity-value">{quantity}</span>
                                <button className="quantity-btn" onClick={increaseQuantity}><p>+</p></button>
                            </div>
                        </div>
                    </div>

                    <div className="info-details">
                        <p className="title-info-ship">Thông tin chi tiết</p>
                        <div className="info-details-main">
                            <div className="info-details-item">
                                <p className="info-details-label">Mã hàng: </p> 
                                <p className="info-details-value">1314000</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Tên nhà cung cấp: </p>
                                <p className="info-details-value">123456789</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Tác giả: </p>
                                <p className="info-details-value">123456789</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Nhà xuất bản: </p>
                                <p className="info-details-value">123456789</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Năm xuất bản: </p>
                                <p className="info-details-value">2019</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Số trang: </p>
                                <p className="info-details-value">123</p>
                            </div>
                            <div className="info-details-item">
                                <p className="info-details-label">Hình thức: </p>
                                <p className="info-details-value">123456789</p>
                            </div>
                        </div>
                        <p className="add-info">Giá sản phẩm trên Website đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...</p>
                    </div>
                    <div className="desc-product">
                        <p className="title-info-ship">Mô tả sản phẩm</p>
                        <p className="content-info">Chúng ta thực sự có hạnh phúc không? Chúng ta có đang sống cuộc đời mình không? Chúng ta có dám dũng cảm chiến thắng mọi khuôn mẫu, định kiến, đi ngược đám đông để khẳng định bản sắc riêng của mình không?. Có bao giờ bạn tự hỏi như thế, rồi có câu trả lời cho chính mình? <br />

                            Tôi biết biết, không phải ai cũng đang sống cuộc đời của mình, không phải ai cũng dám vượt qua mọi lối mòn để sáng tạo và thành công… Dựa trên việc nghiên cứu, tìm hiểu, chắt lọc, tìm kiếm, ghi chép từ các câu chuyện trong đời sống, cũng như trải nghiệm của bản thân, tôi viết cuốn sách này. <br />

                            Cuốn sách sẽ giải mã bạn là ai, bạn cần Tư duy ngược để thành công và hạnh phúc như thế nào và các phương pháp giúp bạn dũng cảm sống cuộc đời mà bạn muốn.</p>
                    </div>
                </div>
            </div>
            {/* <div className="reviews">

            </div> */}
        </div>
    );
};

export default ProductDetails;