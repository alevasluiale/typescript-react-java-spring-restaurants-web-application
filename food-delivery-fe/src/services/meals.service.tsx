import axios from "axios";
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_URL}/meals/`;

class MealsService {
  getMeals(userId: number) {
    return axios
      .get(API_URL+ 'get',{
        params: {
          userId: userId,
        },
        headers: authHeader() 
      })
  }

  addMeal(name: String, zoneName: String,gmt: String,id:number) {
    return axios
      .post(API_URL+'add',{name,zoneName,gmt},{

        params: {
          userId: id
        },
        headers: authHeader()
      })
  }

  modifyMeal(name: String, zoneName: String,gmt: String,id: number) {
    return axios
      .post(API_URL+'modify',{name,zoneName,gmt},{

        params: {
          mealId: id
        },
        headers: authHeader()
      })
  }

  deleteMeal(id:number) {
    console.log(id)
    return axios
      .put(API_URL+'delete',{},{
        params: {
          mealId: id
        },
        headers: authHeader()
      })
  }
}

export default new MealsService();
