import { useState } from 'react';
import '../../assets/styles/ShoppingCart.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";

const ShoppingCart = () => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const pricePerItem = 100000;
  const totalPrice = quantity * pricePerItem;

  return (
    <div className='container-shopping-cart'>
      <span>Giỏ hàng</span>
      <div className='rigon'>
        <div className='total-item'>
          <div className='total-item-title'>
            <div className='title-1'>
              <input type="checkbox" />
              <span>Chọn tất cả</span>
            </div>
            <span className='title-2'>Số lượng</span>
            <span className='title-3'>Tổng tiền</span>
            <div>
              <FontAwesomeIcon className='icon-bin' icon={faTrash} />
            </div>
          </div>

          <div className='list-item'>
            {/* item */}
            <div className='info-item'>
              <div className='name-item'>
                <input type="checkbox" />
                <div className='item-img-info'>
                  <img
                    className='img-size'
                    src="https://i.pinimg.com/736x/2f/09/2a/2f092ab71433cbf00325066c2acf3140.jpg"
                  />
                  <div className='name-info'>
                    <p>Sách</p>
                    <p>Giá: {pricePerItem.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* button tăng giảm số lượng */}
              <div className='so-luong'>
                <button className='btn-so-luong' onClick={handleDecrease}>-</button>
                <p className='so-luong-number'>{quantity}</p>
                <button className='btn-so-luong' onClick={handleIncrease}>+</button>
              </div>

              <p className='total-price'>{totalPrice.toLocaleString()}</p>
              <div className='delete-item'>
                <FontAwesomeIcon className='icon-bin' icon={faTrash} />
              </div>
            </div>
          </div>
        </div>

        <div className='payment'>
          <div className='payment-address'>s</div>
          <div className='total-payment'>
            <div className='total-payment-title'>
              <span>Tổng tiền:</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <button className='btn-payment'>Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
