import axios from "axios";
import { Order } from "../models/Order";
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_URL}/orders/`;

class OrderService {
  getOrders() {
    return axios
      .get(API_URL+ 'getAll',{
        headers: authHeader() 
      })
  }

  addOrder(order: any) {
    const restaurantId = order.restaurantId
    const userId = order.userId
    const meals = order.meals
    return axios
      .post(API_URL+'addOrder',{userId,restaurantId,meals},{
        headers: authHeader()
      })
  }

  // modifyOrder(order: Order,mealsIds:Array<Number>) {
  //   const name = order.name
  //   const description = order.description
  //   return axios
  //     .post(API_URL+'updateOrder',{name,description,mealsIds},{
  //       params: {
  //         orderId: order.id
  //       },
  //       headers: authHeader()
  //     })
  // }

  // deleteOrder(id:number) {
  //   return axios
  //     .put(API_URL+'deleteOrder',{},{
  //       params: {
  //         orderId: id
  //       },
  //       headers: authHeader()
  //     })
  // }
}

export default new OrderService();
