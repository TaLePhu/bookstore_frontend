interface PaginationInterface {
    currentPage: number;
    totalPages: number;
    pagination: any;
}

export const Pagination: React.FC<PaginationInterface> = (props) => {
    const listPage = [];

    //logic pagination
    if (props.currentPage === 1) {
        listPage.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            listPage.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            listPage.push(props.currentPage + 2);
        }
    } else if (props.currentPage > 1) {
        if (props.currentPage >= 3) {
            listPage.push(props.currentPage - 2);
        }
        if (props.currentPage >= 2) {
            listPage.push(props.currentPage - 1);
        }
        listPage.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            listPage.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            listPage.push(props.currentPage + 2);
        }
    }
    return (
        <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item" onClick={() => props.pagination(1)}>
                    <button className="page-link">Trang Đầu</button>
                </li>
                {listPage.map((page) => (
                    <li className="page-item" key={page} onClick={() => props.pagination(page)}>
                        <button className={'page-link ' + (props.currentPage === page ? 'active' : '')}>{page}</button>
                    </li>
                ))}
                <li className="page-item" onClick={() => props.pagination(props.totalPages)}>
                    <button className="page-link">Trang Cuối</button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
