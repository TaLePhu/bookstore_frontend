
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Chưa có sản phẩm trong giỏ</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tạm tính</th>
              <th>Xoá</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.bookId}>
                <td>
                  <img src={item.image} alt={item.bookName} width="60" />
                  <span>{item.bookName}</span>
                </td>
                <td>{item.salePrice.toLocaleString()}đ</td>
                <td>
                  <button
                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >+</button>
                </td>
                <td>{(item.salePrice * item.quantity).toLocaleString()}đ</td>
                <td>
                  <button onClick={() => removeFromCart(item.bookId)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Tổng cộng: {total.toLocaleString()}đ</h3>
    </div>
  );
};

export default CartPage;
