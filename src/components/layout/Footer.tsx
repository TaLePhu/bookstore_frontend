import { Link } from 'react-router-dom';
import '../../assets/styles/Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="region-1">
                {/* icon FB */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-facebook-24.png" alt="icon-fb" />
                    </div>
                </a>
                {/* icon X */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-x-32.png" alt="icon-X" />
                    </div>
                </a>
                {/* icon GG */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-google-24.png" alt="icon-gg" />
                    </div>
                </a>
                {/* icon IG */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-instagram-48.png" alt="icon-ig" />
                    </div>
                </a>
                {/* icon In */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-inlink-48.png" alt="icon-in" />
                    </div>
                </a>
                {/* icon github */}
                <a href="/">
                    <div className="box-icon">
                        <img className="icon-size" src="/icons/icons8-github-30.png" alt="icon-github" />
                    </div>
                </a>
            </div>
            <div className="region-2">
                <p>Đăng ký nhận bảng tin</p>
                <input className="input-email" placeholder="Nhập Email" />
                <button className="btn-dk">Đăng ký</button>
            </div>

            <div className="region-3">
                <div className="region-3-box">
                    <span>Dịch vụ</span>
                    <ul>
                        <li>
                            <Link to="/">Điều khoản sử dụng</Link>
                        </li>
                        <li>
                            <Link to="/">Chính sách bảo mật thông tin cá nhân</Link>
                        </li>
                        <li>
                            <Link to="/">Chính sách bảo mật thanh toán</Link>
                        </li>
                        <li>
                            <Link to="/">Hệ thống trung tâm - nhà sách</Link>
                        </li>
                    </ul>
                </div>
                <div className="region-3-box">
                    <span>Hỗ trợ</span>
                    <ul>
                        <li>
                            <Link to="/">Chính sách đổi - trả - hoàn tiền</Link>
                        </li>
                        <li>
                            <Link to="/">Chính sách bảo hành - bồi hoàn</Link>
                        </li>
                        <li>
                            <Link to="/">Chính sách vận chuyển</Link>
                        </li>
                        <li>
                            <Link to="/">Chính sách khách sỉ</Link>
                        </li>
                    </ul>
                </div>
                <div className="region-3-box">
                    <span>Tài khoản của tôi</span>
                    <ul>
                        <li>
                            <Link to="/">Đăng nhập/Tạo mới tài khoản</Link>
                        </li>
                        <li>
                            <Link to="/">Thay đổi địa chỉ khách hàng</Link>
                        </li>
                        <li>
                            <Link to="/">Chi tiết tài khoản</Link>
                        </li>
                        <li>
                            <Link to="/">Lịch sử mua hàng</Link>
                        </li>
                    </ul>
                </div>
                <div className="region-3-box">
                    <iframe
                        title="Footer Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8582379826526!2d106.68427047480563!3d10.822158889329419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1745600818021!5m2!1sen!2s"
                        width="500"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

            <p>&copy; 2025 Team12</p>
        </div>
    );
};

export default Footer;
