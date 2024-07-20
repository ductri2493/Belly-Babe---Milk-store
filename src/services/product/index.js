import { instance } from "../instance";

export const productAPI = {
  fetchProducts: async () => {
    const fetch = await instance.get("Product/GetAllProducts");
    return fetch;
  },
  fetchProduct: async (params) => {
    const fetch = await instance.get(`Product/GetProductById/${params}`);
    return fetch;
  },
  createProduct: async (data) => {
    const post = await instance.post(`Product/AddProduct`, null, {
      params: data,
    });
    return post;
  },
  updateProduct: async (params, data) => {
    const _update = await instance.put(
      `Product/UpdateProduct/${params}`,
      null,
      {
        params: data,
      }
    );
    return _update;
  },
  deleteProduct: async (params) => {
    const del = await instance.delete(`Product/DeleteProduct/${params}`);
    return del;
  },
  searchByName: async (params) => {
    const search = await instance.get(`Product/SearchByName/${params}`);
    return search;
  },
  searchByStatus: async (params) => {
    const search = await instance.get(`Product/search-by-status/${params}`);
    return search;
  },
  sortByName: async () => {
    const sort = await instance.get(`Product/sort-by-name`);
    return sort;
  },
  sortByPrice: async () => {
    const sort = await instance.get(`Product/sort-by-price`);
    return sort;
  },
  preOrder: async (dataPreOrder) => {
    const post = await instance.post(`PreOrder`, dataPreOrder);
    return post;
  },
};

export const getProduct = async () => {
  try {
    // console.log(instance)
    const fetch = await instance.get("product");
    // console.log(fetch)
    return fetch;
  } catch (error) {
    console.error(error);
  }
};

export const createProduct = async (data) => {
  try {
    const post = await instance.post("product", data);
    // .then(function (response) {
    //     console.log(response)
    // })
    return post;
  } catch (error) {
    console.error(error);
  }
};

export const deleteProductById = async (id) => {
  try {
    const del = await instance.delete(`product/${id}`);
    return del;
  } catch (error) {
    console.error(error);
  }
};

export const updateProductById = async (id, data) => {
  try {
    const updateRes = await instance.put(`product/${id}`, data);
    return updateRes;
  } catch (error) {
    console.error(error);
  }
};

export const getProductByID = async (id) => {
  try {
    // console.log(instance)
    const fetch = await instance.get(`product/${id}`);
    // console.log(fetch)
    return fetch;
  } catch (error) {
    console.error(error);
  }
};

export const getProductByName = async (name) => {
  try {
    const fetch = await instance.get(`product/${name}`);
    return fetch;
  } catch (error) {
    console.error(error);
  }
};
