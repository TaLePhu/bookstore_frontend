import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();

    return(
        <div>
            <h2>Chi tiết sản phẩm</h2>
            <p>ID sản phẩm: {id}</p>
        </div>
    );
};

export default ProductDetails;