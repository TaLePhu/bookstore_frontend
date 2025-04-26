import { Form, Input, Button, message, Card, Radio , Alert, Modal } from 'antd';
import { faCreditCard, faMoneyBill, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import "../../assets/styles/Checkout.css";

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from "react-select";
import { SingleValue } from "react-select";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { NavigateFunction } from 'react-router-dom';


interface ShippingMethod {
    shippingMethodId: number;
    shippingMethodName: string;
    description: string;
    shippingCost: number;
}

interface PaymentMethod {
    paymentMethodId: number;
    paymentMethodName: string;
    description: string;
    paymentFee: number;
}

interface Product {
    bookId: number;
    quantity: number;
    salePrice: number;
    image: string;
    bookName: string;
  }
  

const Checkout: React.FC = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState("Chưa chọn địa chỉ");
    const [selectedProvince, setSelectedProvince] = useState<{ value: number, label: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ value: number, label: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ value: number, label: string } | null>(null);

    const [deliveryMethod, setDeliveryMethod] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<number>(1);

    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];
    const totalPrice = location.state?.totalPrice || 0;

    const { removeMultipleFromCart } = useCart();

    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const navigate = useNavigate();

    // axios.get<ShippingMethod[]>("http://localhost:8080/api/shipping-methods")

    useEffect(() => {
        axios.get<ShippingMethod[]>("http://localhost:8080/api/shipping-methods") 
          .then(response => {
            setShippingMethods(response.data);
          })
          .catch(error => {
            console.error("Lỗi khi lấy danh sách phương thức vận chuyển:", error);
          });
    }, []);

    console.log("Danh sách phương thức vận chuyển:", shippingMethods);

    useEffect(() => {
        const token = localStorage.getItem("token"); // lấy JWT từ localStorage
      
        axios.get<PaymentMethod[]>("http://localhost:8080/api/payment-methods", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            setPaymentMethods(response.data);
          })
          .catch(error => {
            console.error("Lỗi khi lấy danh sách phương thức thanh toán:", error.response?.status, error.response?.data);
          });
      }, []);


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
        } else {
            alert("Vui lòng chọn đầy đủ tỉnh, huyện, xã.");
        }
    };

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    }

    const handleCheckout = () => {
        // Xử lý gửi đơn hàng...
      
        const bookIdsToRemove = selectedProducts.map((item: { bookId: number }) => item.bookId);
        removeMultipleFromCart(bookIdsToRemove);
    };

    const calculateTotalAmount = () => {
        const selectedShipping = shippingMethods.find(method => method.shippingMethodId === deliveryMethod);
        const selectedPayment = paymentMethods.find(method => method.paymentMethodId === paymentMethod);
    
        const shippingCost = selectedShipping ? selectedShipping.shippingCost : 0;
        const paymentFee = selectedPayment ? selectedPayment.paymentFee || 0 : 0;
    
        const total = totalPrice + shippingCost + paymentFee;
    
        return total;
    };

    const selectedShipping = shippingMethods.find(method => method.shippingMethodId === deliveryMethod);
    const selectedPayment = paymentMethods.find(method => method.paymentMethodId === paymentMethod);

    const calculateTotalDelivery = () => {
        const selectedShipping = shippingMethods.find(method => method.shippingMethodId === deliveryMethod);
        const selectedPayment = paymentMethods.find(method => method.paymentMethodId === paymentMethod);

        const shippingCost = selectedShipping ? selectedShipping.shippingCost : 0;
        const paymentFee = selectedPayment ? selectedPayment.paymentFee || 0 : 0;

        const total = shippingCost + paymentFee;
        return total;
    }

    const handleSuccessModal = (navigate: NavigateFunction) => {
        let secondsToGo = 5;
        const modal = Modal.success({
          title: 'Đặt hàng thành công!',
          content: `Bạn sẽ được chuyển về trang chủ sau ${secondsToGo} giây.`,
          centered: true,
          okButtonProps: { style: { display: 'none' } }, // Ẩn nút OK nếu muốn
        });
      
        const interval = setInterval(() => {
          secondsToGo -= 1;
          modal.update({
            content: `Bạn sẽ được chuyển về trang chủ sau ${secondsToGo} giây.`,
          });
        }, 1000);
      
        setTimeout(() => {
          clearInterval(interval);
          modal.destroy();
          navigate('/');
        }, secondsToGo * 1000);
    };

    const [form] = Form.useForm();

    const handleCheckoutReal = async () => {
        try {
          // Lấy dữ liệu từ form (các input địa chỉ người nhận)
          const values = await form.validateFields();
      
          // Kiểm tra các trường bắt buộc khác
          if (!selectedProvince || !selectedDistrict || !selectedWard) {
            message.error("Vui lòng chọn đầy đủ địa chỉ giao hàng!");
            return;
          }
      
          if (!deliveryMethod) {
            message.error("Vui lòng chọn phương thức vận chuyển!");
            return;
          }
      
          if (!paymentMethod) {
            message.error("Vui lòng chọn phương thức thanh toán!");
            return;
          }
      
          if (selectedProducts.length === 0) {
            message.error("Bạn chưa chọn sản phẩm nào!");
            return;
          }
      
          // Tạo object đơn hàng
          const orderData = {
            userId: 0, // hoặc lấy từ context nếu có đăng nhập
            billingAddress: `${values.address}, ${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`,
            shippingAddress: `${values.address}, ${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`,
            shippingMethodId: deliveryMethod,
            paymentMethodId: paymentMethod,
            totalProductPrice: totalPrice, // hoặc tính riêng nếu cần
            shippingFee: selectedShipping?.shippingCost, // hoặc truyền giá trị thực
            paymentFee: selectedPayment?.paymentFee,
            totalPrice: totalPrice,
            orderDetails: selectedProducts.map((product: Product) => ({
              bookId: product.bookId,
              quantity: product.quantity,
              salePrice: product.salePrice,
            }))
          };
      
          console.log("Đơn hàng gửi đi:", orderData);
      
          // Gọi API gửi đơn hàng
          const response = await axios.post('http://localhost:8080/api/orders', orderData);
      
          if (response.status === 200) {
            message.success("Đặt hàng thành công!");
            const bookIdsToRemove = selectedProducts.map((item: { bookId: number }) => item.bookId);
            removeMultipleFromCart(bookIdsToRemove);
            handleSuccessModal(navigate);
            // Có thể redirect hoặc reset form tại đây
          } else {
            message.error("Đặt hàng thất bại!");
          }
        } catch (error) {
          console.error("Lỗi khi đặt hàng:", error);
          message.error("Vui lòng kiểm tra lại thông tin đơn hàng!");
        }
        


      };


	return (
		<div className='container-checkout'>
			<div className='card-login'>
                <div className="icon-warning">
                    <FontAwesomeIcon icon={faWarning} />
                </div>
                <p>Bạn đã là thành viên ?</p>
                <a href="">Đăng nhập ngay</a>
            </div>

            <Card className='card-checkout'>
                <div className="title-info">
                    <p>Địa chỉ giao hàng</p>
                </div>
                <Form
                    requiredMark={false}
                    name="checkout"
                    className="checkout-form"
                    initialValues={{ remember: true }}
                    labelCol={{ style: { width: 150 } }}
                    form={form} onFinish={handleCheckoutReal}
                >
                    <Form.Item
                        label="Họ người nhận"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ người nhận!' },
                            { pattern: /^[^\d]+$/, message: 'Họ không được chứa số!' }
                        ]}
                    >  
                        <Input placeholder="Nhập họ người nhận" />
                    </Form.Item>

                    <Form.Item
                        label="Tên người nhận"
                        name="firstName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên người nhận!' },
                            { pattern: /^[^\d]+$/, message: 'Tên không được chứa số!' }
                        ]}
                    >  
                        <Input placeholder="Nhập tên người nhận" />
                    </Form.Item>

                    <Form.Item
                        label="Emal"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >  
                        <Input placeholder="Nhập emal" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                              pattern: /^(0|\+84)[0-9]{9}$/,
                              message: 'Số điện thoại không hợp lệ!'
                            }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}>
                        <Select
                            options={provinces}
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            
                            placeholder="Chọn tỉnh/thành phố"
                            className="select-item"
                        />
                    </Form.Item>

                    <Form.Item label="Quận/Huyện" >
                        <Select
                            options={districts}
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            isDisabled={!selectedProvince}
                            className="select-item"
                        />
                    </Form.Item>

                    <Form.Item label="Phường/Xã">
                        <Select
                            options={wards}
                            value={selectedWard}
                            onChange={handleWardChange}
                            placeholder="Chọn phường/xã"
                            isDisabled={!selectedDistrict}
                            className="select-item"
                        />
                    </Form.Item>


                    <Form.Item
                        label="Địa chỉ nhận hàng"
                        name="address"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ nhận hàng!' },
                            { max: 100, message: 'Địa chỉ quá dài (tối đa 100 ký tự)!' }
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ nhận hàng" />
                    </Form.Item>

                    
                    
                </Form>
            </Card>

            <Card className='card-checkout'>
                <div className="title-info">
                    <p>Phương thức vận chuyển</p>
                </div>
                <Form
                    requiredMark={false}
                    name="checkout"
                    className="checkout-form"
                    initialValues={{ remember: true }}
                    labelCol={{ style: { width: 150 } }}
                    form={form} onFinish={handleCheckoutReal}
                >   
                    {/* <Form.Item 
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className='address-item'
                    >
                        <Radio.Group
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                            value={deliveryMethod}
                        >
                            <Radio value="home">
                                <div>
                                    <div>Giao tận nhà: <span>5.000 đ</span></div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <span>Dự kiến giao:</span>
                                        <span>Thứ hai - 14/04</span>
                                    </div>
                                </div>
                            </Radio>
                            <Radio value="store">Nhận tại cửa hàng</Radio>
                        </Radio.Group>
                    </Form.Item> */}
                    <Form.Item
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        className='address-item'
                    >
                        <Radio.Group
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                            value={deliveryMethod}
                        >
                            {shippingMethods.map((method) => (
                            <Radio key={method.shippingMethodId} value={method.shippingMethodId}>
                                <div className="delivery-home">
                                <div className="title-delivery">
                                    <span>{method.shippingMethodName}:</span>
                                    <span>{method.shippingCost.toLocaleString()} đ</span>
                                </div>

                                {method.shippingMethodId !== 2 && (
                                    <div className="delivery-time">
                                    <span>Dự kiến giao:</span>
                                    <span>Thứ hai - 14/04</span>
                                    </div>
                                )}
                                </div>
                            </Radio>
                            ))}
                        </Radio.Group>
                        </Form.Item>
                </Form>
                
            </Card>

            <Card className='card-checkout'>
                <div className="title-info">
                    <p>Phương thức thanh toán</p>
                </div>
                <Form
                    requiredMark={false}
                    name="checkout"
                    className="checkout-form"
                    initialValues={{ remember: true }}
                    labelCol={{ style: { width: 150 } }}
                    form={form} onFinish={handleCheckoutReal}
                >   
                    <Form.Item 
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    >
                        <Radio.Group
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            value={paymentMethod}
                        >
                            {/* <Radio value="cash">
                                <div className="delivery-home">
                                    <div className='title-payment'>
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        <span>Thanh toán khi nhận hàng:</span> 
                                        <span>5.000 đ</span>
                                    </div>
                                </div>
                            </Radio>
                            <Radio value="card-credit">
                                <div className="delivery-home">
                                    <div className='title-payment'>
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        <span>Thanh toán bằng thẻ tín dụng</span>
                                    </div>
                                </div>
                            </Radio> */}

                            {paymentMethods.map((method) => (
                                <Radio key={method.paymentMethodId} value={method.paymentMethodId}>
                                    <div className="delivery-home">
                                        <div className='title-payment'>
                                            <FontAwesomeIcon 
                                                icon={method.paymentMethodId === 1 ? faMoneyBill : faCreditCard} 
                                                style={{ marginRight: '8px' }} 
                                            />
                                            {method.paymentMethodName}: 
                                            <span>{method.paymentFee.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Form>
                
            </Card>

            <Card className='card-checkout'>
                <div className="title-info">
                    <p>KIỂM TRA LẠI ĐƠN HÀNG</p>
                </div>

                <div className="list-item-product">
                    <div className="each-item">
                        <div className="title-table-item">
                            <p>Ảnh sản phẩm</p>
                        </div>
                        <div className="title-table-item">
                            <p>Tên sản phẩm</p>
                        </div>
                        <div className="title-table-item">
                            <p>Giá khuyến mãi</p>
                        </div>
                        <div className="title-table-item">
                            <p>Số lượng</p> 
                        </div>
                        <div className="title-table-item">
                            <p>Tổng tiền</p>
                        </div>
                    </div>
                {selectedProducts.length === 0 ? (
                    <p>Không có sản phẩm nào được chọn.</p>
                ) : (
                    selectedProducts.map((product: any) => (
                    <div className="each-item">
                        <div className="img-book">
                            <img src={product.image} alt="" />
                        </div>
                        <div className="title-book">
                            <p>{product.bookName}</p>
                        </div>
                        <div className="price-product">
                            <p>{product.salePrice.toLocaleString()}</p>
                        </div>
                        <div className="quantity-book">
                            <p>{product.quantity}</p> 
                        </div>
                        <div className="total-price">
                            <p>{totalPrice.toLocaleString()}</p>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </Card>

            <div className="footer-checkout">
                <div className="full-price">
                    <div className="total">
                        <p>Thành tiền</p>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="shipping-fee">
                        <p>Phí vận chuyển</p>
                        <span>{formatPrice(calculateTotalDelivery())}</span>
                    </div>
                    <div className="total-amount">
                        <p>Tổng Số Tiền (gồm VAT)</p>
                        <span>{formatPrice(calculateTotalAmount())}</span>
                    </div>
                </div>
                <div className="footer-btn">
                    <div className="btn-checkout" onClick={handleCheckoutReal}>
                        <p>Xác nhận thanh toán</p>
                    </div>
                </div>
            </div>
		</div>
	);
}

export default Checkout;