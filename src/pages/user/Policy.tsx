import '../../assets/styles/Policy.css';

const Policy = () => {
    return (
        <div style={{ backgroundColor: '#f8f9fa', padding: '60px' }}>
            <div className="policy-container">
                <h1>CHÍNH SÁCH ĐỔI / TRẢ / HOÀN TIỀN</h1>
                <p>
                    Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách hàng khi trải nghiệm mua hàng tại{' '}
                    <strong>PTTN</strong>. Do đó chúng tôi luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục vụ mọi nhu
                    cầu mua sắm của quý khách.
                </p>
                <p>
                    <strong>PTTN</strong> chúng tôi luôn luôn cam kết tất cả các sản phẩm bán tại <strong>PTTN</strong>{' '}
                    100% là những sản phẩm chất lượng và xuất xứ nguồn gốc rõ ràng, hợp pháp cũng như an toàn cho người
                    tiêu dùng. Để việc mua sắm của quý khách tại <strong>PTTN</strong> là trải nghiệm dịch vụ thân
                    thiện, chúng tôi hy vọng quý khách sẽ kiểm tra kỹ các nội dung sau trước khi nhận hàng:
                </p>
                <ul>
                    <li>Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.</li>
                    <li>Số lượng sản phẩm.</li>
                </ul>
                <p>
                    Trong trường hợp hiếm hoi sản phẩm quý khách nhận được có khiếm khuyết, hư hỏng hoặc không như mô
                    tả,
                    <strong>PTTN</strong> cam kết bảo vệ khách hàng bằng chính sách đổi trả/hoàn tiền trên tinh thần bảo
                    vệ quyền lợi người tiêu dùng nhằm cam kết với quý khách về chất lượng sản phẩm và dịch vụ của chúng
                    tôi.
                </p>
                <p>
                    Khi quý khách hàng có hàng hóa mua tại <strong>PTTN</strong> cần đổi/trả/bảo hành/hoàn tiền, xin quý
                    khách hàng liên hệ với chúng tôi qua hotline <strong>1900636467</strong> hoặc truy cập
                    <a href="https://pttn.com/chinh-sach-doi-tra-hang" target="_blank" rel="noopener noreferrer">
                        {' '}
                        pttn.com/chinh-sach-doi-tra-hang
                    </a>{' '}
                    để tìm hiểu thêm về chính sách đổi/trả.
                </p>

                <h2>1. Thời gian áp dụng đổi/trả</h2>
                <table className="policy-table">
                    <thead>
                        <tr>
                            <th>KỂ TỪ KHI PTTN GIAO HÀNG THÀNH CÔNG</th>
                            <th>SẢN PHẨM LỖI (do nhà cung cấp)</th>
                            <th>SẢN PHẨM KHÔNG LỖI (*)</th>
                            <th>SẢN PHẨM LỖI DO NGƯỜI SỬ DỤNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Sản phẩm Điện tử, Đồ chơi điện - điện tử, điện gia dụng,... (có tem phiếu bảo hành từ
                                nhà cung cấp)
                            </td>
                            <td>
                                7 ngày đầu tiên
                                <br />
                                Đổi mới
                            </td>
                            <td>Trả hàng không thu phí</td>
                            <td>Bảo hành hoặc sửa chữa có thu phí theo quy định của nhà cung cấp.</td>
                        </tr>
                        <tr>
                            <td>8 - 30 ngày</td>
                            <td>Bảo hành</td>
                            <td>Trả không thu phí</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>30 ngày trở đi</td>
                            <td>Bảo hành</td>
                            <td>Không hỗ trợ đổi/trả</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Voucher/ E-voucher</td>
                            <td>
                                30 ngày đầu tiên
                                <br />
                                Đổi mới
                            </td>
                            <td>Không hỗ trợ đổi/trả</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Policy;
