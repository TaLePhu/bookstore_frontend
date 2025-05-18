import '../../assets/styles/ProductManagement.css';
import ProductList from '../../components/admLayout/ProductList';
import CategoryList from '../../components/admLayout/CategoryList';
import { useState } from 'react';

const ProductManagement = () => {
    const [activeComponent, setActiveComponent] = useState('product'); // 'product' hoặc 'category'

    return (
        <div className="container-product-management">
            <div className="title-manager">
                <p>Quản lí sản phẩm</p>
                <div className='box-btn-manager'>
                    <button 
                        className={`btn-manager ${activeComponent === 'product' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('product')}
                    >
                        Quản lí sách
                    </button>
                    <button 
                        className={`btn-manager ${activeComponent === 'category' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('category')}
                    >
                        Quản lí thể loại
                    </button>
                </div>
            </div>

            <div className="content-management">
                {activeComponent === 'product' ? <ProductList /> : <CategoryList />}
            </div>
        </div>
    );
};

export default ProductManagement;
