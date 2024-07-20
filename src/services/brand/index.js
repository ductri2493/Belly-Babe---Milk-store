import { instance } from "../instance";

const BrandAPI = {
  fetchBrands: async () => {
    try {
      const brand = await instance.get('Brand/GetAllBrands')
      return brand
    }
    catch (error) {
      console.error(error);
    }
  },
  fetchBrand: async (params) => {
    try {
      const brand = await instance.get(`Brand/GetBrandById/${params}`)
      return brand
    }
    catch (error) {
      console.error(error);
    }
  },
  createBrand: async (data) => {
    try {
      const brand = await instance.post('Brand/AddBrand', data)
      return brand
    }
    catch (error) {
      console.error(error);
    }
  },
  updateBrand: async (params, data) => {
    try {
      const brand = await instance.put(`Brand/UpdateBrand/${params}`, data)
      return brand
    }
    catch (error) {
      console.error(error);
    }
  },
  deleteBrand: async (params) => {
    try {
      const brand = await instance.delete(`Brand/DeleteBrand/${params}`)
      return brand
    }
    catch (error) {
      console.error(error);
    }
  }
}
export default BrandAPI