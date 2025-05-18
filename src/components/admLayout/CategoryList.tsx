import { useEffect, useState } from 'react';
import { getAllCategories, updateCategory, addCategory } from '../../api/CategoryAPI';
import { findBook } from '../../api/BookAPI';
import Category from '../../interface/Category';
import '../../assets/styles/CategoryList.css'

interface CategoryWithCount extends Category {
    bookCount: number;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryInput, setNewCategoryInput] = useState('');

    const fetchCategoriesAndCounts = async () => {
        try {
            const categoriesData = await getAllCategories();
            const categoriesWithCounts = await Promise.all(
                categoriesData.map(async (category) => {
                    try {
                        const result = await findBook('', category.categoryId);
                        return {
                            ...category,
                            bookCount: result.totalBook
                        };
                    } catch (err) {
                        console.error(`Error fetching books for category ${category.categoryName}:`, err);
                        return {
                            ...category,
                            bookCount: 0
                        };
                    }
                })
            );
            setCategories(categoriesWithCounts);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesAndCounts();
    }, []);

    const handleEdit = (category: CategoryWithCount) => {
        setEditingCategory(category.categoryId);
        setNewCategoryName(category.categoryName);
    };

    const handleSave = async (categoryId: number) => {
        if (!newCategoryName.trim()) {
            alert('Tên thể loại không được để trống');
            return;
        }

        const success = await updateCategory(categoryId, newCategoryName);
        if (success) {
            setEditingCategory(null);
            fetchCategoriesAndCounts();
        } else {
            alert('Không thể cập nhật thể loại. Vui lòng thử lại sau.');
        }
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setNewCategoryName('');
    };

    const handleAddCategory = async () => {
        if (!newCategoryInput.trim()) {
            alert('Tên thể loại không được để trống');
            return;
        }

        const success = await addCategory(newCategoryInput);
        if (success) {
            setIsAddingCategory(false);
            setNewCategoryInput('');
            fetchCategoriesAndCounts();
        } else {
            alert('Không thể thêm thể loại. Vui lòng thử lại sau.');
        }
    };

    if (loading) {
        return <div>Đang tải danh sách thể loại...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="content-management">
            <div className='category-list-container'>
                <div className='category-list-header'>
                    <h2>Danh sách thể loại</h2>
                    {isAddingCategory ? (
                        <div className="add-category-form">
                            <input
                                type="text"
                                value={newCategoryInput}
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                placeholder="Nhập tên thể loại mới"
                                className="add-category-input"
                            />
                            <button 
                                className="btn-save"
                                onClick={handleAddCategory}
                            >
                                Thêm
                            </button>
                            <button 
                                className="btn-cancel"
                                onClick={() => {
                                    setIsAddingCategory(false);
                                    setNewCategoryInput('');
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <button 
                            className='add-catogory-btn'
                        >
                            Thêm thể loại
                        </button>
                    )}
                </div>
                
                <div className="category-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên thể loại</th>
                                <th>Số lượng sách</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={index}>
                                    <td>
                                        {editingCategory === category.categoryId ? (
                                            <div className="edit-category">
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    className="edit-input"
                                                />
                                                <div className="edit-actions">
                                                    <button 
                                                        className="btn-save"
                                                        onClick={() => handleSave(category.categoryId)}
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button 
                                                        className="btn-cancel"
                                                        onClick={handleCancel}
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            category.categoryName
                                        )}
                                    </td>
                                    <td>{category.bookCount}</td>
                                    <td>
                                        {editingCategory === category.categoryId ? (
                                            <button className="btn-edit" disabled>Sửa</button>
                                        ) : (
                                            <button 
                                                className="btn-edit"
                                            >
                                                Sửa
                                            </button>
                                        )}
                                        <button className="btn-delete">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
