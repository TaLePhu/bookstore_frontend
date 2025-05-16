import '../../assets/styles/ProductManagement.css';
import ProductList from '../../components/admLayout/ProductList';

const ProductManagement = () => {
    return (
        <div className="container-product-management">
            <div className="title-manager">
                <p>Quản lí sản phẩm</p>
            </div>

            <div className="content-management">
                <ProductList />
            </div>
        </div>
    );
};

export default ProductManagement;
