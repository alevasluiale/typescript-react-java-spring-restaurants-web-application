import { Meal } from "./Meal";
import { Restaurant } from "./Restaurant";

export interface Order {
  id?: number
  date: Date
  totalAmount: number
  restaurant: [Restaurant]
  orderStatutes: Array<{
    status: {
      name: string
    }
  }>
  orderMeals: Array<{
    meal: Meal
    quantity: number
  }>
}