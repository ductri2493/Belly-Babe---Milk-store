import { instance } from "../instance"

const ProductCategory = {
    fetchCategories: async () => {
        const category = await instance.get(`ProductCategory/GetAllProductCategories`)
        return category
    },
    fetchCategory: async (params) => {
        const category = await instance.get(`ProductCategory/GetProductCategoryById/${params}`)
        return category
    },
    createCategory: async (data) => {
        const category = await instance.post(`ProductCategory/AddProductCategory`, data)
        return category
    },
    updateCategory: async (params, data) => {
        const category = await instance.put(`ProductCategory/UpdateProductCategory/${params}`, data)
        return category
    },
    deleteCategory: async (params) => {
        const category = await instance.get(`ProductCategory/DeleteProductCategory/${params}`)
        return category
    }
}

export default ProductCategory