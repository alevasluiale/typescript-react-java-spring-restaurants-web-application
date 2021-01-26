import axios from "axios";
import { Restaurant } from "../models/Restaurant";
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_URL}/restaurants/`;

class RestaurantService {
  getRestaurants() {
    return axios
      .get(API_URL+ 'getAll',{
        headers: authHeader() 
      })
  }

  addRestaurant(restaurant: Restaurant) {
    const name = restaurant.name
    const description = restaurant.description
    return axios
      .post(API_URL+'addRestaurant',{name,description},{
        headers: authHeader()
      })
  }

  modifyRestaurant(restaurant: Restaurant) {
    const name = restaurant.name
    const description = restaurant.description
    return axios
      .post(API_URL+'updateRestaurant',{name,description},{
        params: {
          restaurantId: restaurant.id
        },
        headers: authHeader()
      })
  }

  deleteRestaurant(id:number) {
    console.log(id)
    return axios
      .put(API_URL+'deleteRestaurant',{},{
        params: {
          restaurantId: id
        },
        headers: authHeader()
      })
  }
}

export default new RestaurantService();
