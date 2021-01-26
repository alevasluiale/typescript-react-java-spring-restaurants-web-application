import { ModifyUserProps } from "../components/users.component";
import { Meal } from "./Meal";
import { User } from "./User";
import { UserInfo } from "./UserInfo";

export interface AppStateMachineContext {
  currentUser?: User
  meals?: [Meal]
  users?: [UserInfo]
}

export interface AppStateMachineSchema {
  context: AppStateMachineContext
  states: {
    check_user_is_authenticated:{} //checks user is auth 
    home: {}
    login_page: {} // login page
    signed_in: {}
    login_initiated: {}
    sign_up: {} // sign up page
    register_user: {}
    meals: {}
    meals_fetching: {}
    meals_add_meal: {}
    meals_modify_meal:{}
    meals_delete_meal:{}
    meals_error: {}
    users_fetching: {}
    users: {}
    users_error: {}
    users_delete_user:{}
    users_modify_user:{}
    users_add_user:{}
  },
  EventObject: {}
}

export type AddUserEvent = {
  type: 'ADD_USER',
  payload: ModifyUserProps
}
export type ModifyUserEvent = {
  type: 'MODIFY_USER';
  payload: ModifyUserProps
}
export type DeleteUserEvent = {
  type: 'DELETE_USER';
  payload: {
    id: number
  }
}
export type RegisterEvent = {
  type: 'REGISTER';
  payload: {
    username: string,
    email:string,
    password: string
  }
}
export type AddMealEvent = {
  type: 'ADD_MEAL';
  payload: {
    meal: Meal
  }
}
export type DeleteMealEvent = {
  type: 'DELETE_MEAL';
  payload: {
    id: number
  }
}
export type ModifyMealEvent = {
  type: 'MODIFY_MEAL';
  payload: {
    meal: Meal
  }
}
export type OpenZonesForUserEvent = {
  type: 'OPEN_ZONES_FOR_USER';
  payload: {
    id: number
  }
}
export type LoginEvent = {
  type: 'LOGIN';
  payload: {
    userName: string
    password: string
  }
}
export type AppStateMachineEvent = AddMealEvent | LoginEvent 
  | RegisterEvent | DeleteUserEvent | ModifyUserEvent | AddUserEvent | ModifyMealEvent | DeleteMealEvent | OpenZonesForUserEvent
  | {type: 'SIGNED_IN'}
  | {type: 'HOME'}
  | {type: 'LOGIN_PAGE'}
  | {type: 'LOG_OUT'}
  | {type: 'MEALS'}
  | {type: 'SIGN_UP'}
  | {type: 'USERS'}
  | {type: 'ADMIN_PANEL'}
  