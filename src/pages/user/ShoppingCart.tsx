import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";
import '../../assets/styles/ShoppingCart.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { getBookById } from "../../api/BookAPI";


const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, removeMultipleFromCart } = useCart();
  
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
 const [product, setProduct] = useState<BookModel[]>([]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   saveCartToLocalStorage(cartItems);
  // }, [cartItems]);

  console.log("cartItems", cartItems);
  console.log("id", cartItems.map(item => item.bookId));

  useEffect(() => {
    const fetchBooks = async () => {
      const ids = cartItems.map(item => item.bookId);
      if (ids.length === 0) return;

      try {
        const books = await Promise.all(
          ids.map(id => getBookById(id))
        );
        setProduct(books.filter((b): b is BookModel => b !== null)); // Mảng các sách tương ứng
      } catch (error) {
        console.error("Lỗi khi tải nhiều sách:", error);
      }
    };

    fetchBooks();
  }, [cartItems]);

  useEffect(() => {
    const availableBookIds = cartItems
      .filter(item => {
        const book = product.find(p => p.bookId === item.bookId);
        return book && (book.quantity ?? 0) > 0;
      })
      .map(item => item.bookId);

    setSelectAll(
      availableBookIds.length > 0 &&
      availableBookIds.every(id => selectedItems.includes(id))
    );
  }, [selectedItems, cartItems, product]);

  console.log("product", product);

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
      setSelectedItems(
        cartItems
          .filter(item => {
            const book = product.find(p => p.bookId === item.bookId);
            return book && (book.quantity ?? 0) > 0;
          })
          .map(item => item.bookId)
      );
    }
    setSelectAll(!selectAll);
  };


  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    await removeMultipleFromCart(selectedItems); // Gọi đúng hàm với cả mảng bookIds
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

            <div className='list-item-cart'>
              {cartItems.map((item) => (
                <div className='info-item' key={item.bookId}>
                  <div className='name-item'>
                    <input 
                        type="checkbox"
                        checked={selectedItems.includes(item.bookId)}
                        disabled={
                          (Number(product.find(p => p.bookId === item.bookId)?.quantity) || 0) <= 0
                        }
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
                <p>Tổng tiền:</p>
                <span>{totalPrice.toLocaleString()} vnd</span>
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
