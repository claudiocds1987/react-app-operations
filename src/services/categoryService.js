import axios from "axios"

class CategoryService{

    async getCategories() {
        try {
          const { data } = await axios({
            method: "get",
            url: "http://localhost:4000/api/categories",
            responseType: "json",
          });
          return data;
        } catch (e) {
          alert("Error al intentar obtener las categorias");
        }
    }

}

export default CategoryService;