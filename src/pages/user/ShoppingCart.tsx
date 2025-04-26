import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";
import '../../assets/styles/ShoppingCart.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, saveCartToLocalStorage } = useCart();
  
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   saveCartToLocalStorage(cartItems);
  // }, [cartItems]);

  const handleIncrease = (id: number, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrease = (id: number, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.bookId));
    }
    setSelectAll(!selectAll);
  };


  const handleRemoveSelected = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems([]);
    setSelectAll(false);
  };

  const selectedProducts = cartItems.filter(item =>
    selectedItems.includes(item.bookId)
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { selectedProducts, totalPrice } });

  }

  const totalPrice = cartItems
  .filter(item => selectedItems.includes(item.bookId))
  .reduce((sum, item) => sum + item.salePrice * item.quantity, 0);

 //const totalPrice = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);

  return (
    <div className='container-shopping-cart'>
      <span>Giỏ hàng</span>
      {cartItems.length === 0 ? (
        <p>Chưa có sản phẩm trong giỏ</p>
      ) : (
        <div className='rigon'>
          <div className='total-item'>
            <div className='total-item-title'>
              <div className='title-1'>
                <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}/>
                <span>Chọn tất cả</span>
              </div>
              <span className='title-2'>Số lượng: </span>
              <span className='title-3'>Tổng tiền</span>
              <div>
                <FontAwesomeIcon className='icon-bin' icon={faTrash} onClick={handleRemoveSelected}/>
              </div>
            </div>

            <div className='list-item'>
              {cartItems.map((item) => (
                <div className='info-item' key={item.bookId}>
                  <div className='name-item'>
                    <input 
                        type="checkbox"
                        checked={selectedItems.includes(item.bookId)}
                        onChange={() => handleSelectItem(item.bookId)}
                    />
                    <div className='item-img-info'>
                      <img
                        className='img-size'
                        src={item.image}
                        alt={item.bookName}
                      />
                      <div className='name-info'>
                        <p>{item.bookName}</p>
                        <p>Giá: {item.salePrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className='so-luong'>
                    <button
                      className='btn-so-luong'
                      onClick={() => handleDecrease(item.bookId, item.quantity)}
                    >-</button>
                    <p className='so-luong-number'>{item.quantity}</p>
                    <button
                      className='btn-so-luong'
                      onClick={() => handleIncrease(item.bookId, item.quantity)}
                    >+</button>
                  </div>

                  <p className='total-price'>
                    {(item.salePrice * item.quantity).toLocaleString()}
                  </p>

                  <div className='delete-item'>
                    <FontAwesomeIcon
                      className='icon-bin'
                      icon={faTrash}
                      onClick={() => handleRemove(item.bookId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='payment'>
            <div className='payment-address'>Địa chỉ giao hàng</div>
            <div className='total-payment'>
              <div className='total-payment-title'>
                <span>Tổng tiền:</span>
                <span>{totalPrice.toLocaleString()}</span>
              </div>
              <button className='btn-payment' onClick={handleCheckout} disabled={selectedItems.length === 0}>Thanh toán</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
