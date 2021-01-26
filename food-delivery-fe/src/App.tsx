import React,{useState} from "react";
import "./style/index.css";
import AuthService from "./services/auth.service";
import {useMachine} from '@xstate/react';
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Match from "./utils/Match";
import Users, { ModifyUserProps } from "./components/users.component";
import Meals from "./components/meals.component";
import { Meal } from "./models/Meal";
import { createAppStateMachine } from "./models/AppStateMachine";
import Restaurants from "./components/restaurants.component";
import { Restaurant } from "./models/Restaurant";

export const App:  React.FC = () => {
  
  const [current,send] = useMachine(createAppStateMachine(AuthService.getCurrentUser()))
  
  const [userIdForZones,setUserIdForZones] = useState({
    id: 0,
    username: ''
  })

  function clearUserForZone() {
    setUserIdForZones({
      id: 0,
      username: ''
    })
    localStorage.removeItem('userIdForZone')
  }

    return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark unselectable">
        <span style={{cursor: 'pointer'}} className="navbar-brand unselectable" onClick={e=>{
          clearUserForZone()
          send({type:'HOME'})}}>
          TopTal
        </span>
            <div className="navbar-nav mr-auto  unselectable">
            
						{current.context.currentUser && 
              (<li className="nav-item" onClick={e => {
                clearUserForZone()
                send({type: 'RESTAURANTS'})}}>
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{
                  clearUserForZone()
                  // send({type: 'OPEN_ZONES_FOR_USER',payload:{
                  //   id: current.context.currentUser?.id ?? 0
									// }})
									}}>
                  Restaurants
                </span>
              </li>
            )}

            {current.context.currentUser && 
              (<li className="nav-item" onClick={e => {
                clearUserForZone()
                send({type: 'MEALS'})}}>
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{
                  clearUserForZone()
                  // send({type: 'OPEN_ZONES_FOR_USER',payload:{
                  //   id: current.context.currentUser?.id ?? 0
									// }})
									}}>
                  Meals
                </span>
              </li>
            )}


            {current.context.currentUser && 
              ( current.context.currentUser.roles.includes("ROLE_USER_MANAGER") ||
              current.context.currentUser.roles.includes("ROLE_ADMIN") ) && (
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{
                  clearUserForZone()
                  send({type:'USERS'})}}>
                  Users
                </span>
              </li>
            )}
          </div>

          {current.context.currentUser ? (
            <div className="navbar-nav ml-auto unselectable">
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable">
                  {current.context.currentUser.username}
                </span>
              </li>
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={ e => {
                  clearUserForZone()
                  send({type: 'LOG_OUT'})}}>
                  LogOut
                </span>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto unselectable">
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" 
                  onClick={e=> {
                    clearUserForZone()
                    send({
                    type: 'LOGIN_PAGE'
                    })}}>
                  Login
                  </span>
              </li>

              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{send({
                  type: 'SIGN_UP'
                })}}>
                  Sign Up
                </span>
              </li>
            </div>
          )}
        </nav>

  
      <div className="container py-4">
        <Match state={['home','signed_in']} current={current}>
          <Home/>
        </Match>

        <Match state={'login_page'} current={current}>
          <Login onLogin={
            (userName: string,password:string) => {
              send({
              type:'LOGIN',
              payload: {
                userName: userName,
                password: password
              }
            })
            }
          }/>
        </Match>

        <Match state={"sign_up"} current={current}>
          <Register
            onRegister={(username: string,email:string,password:string) => 
              send({
                type: 'REGISTER',
                payload: {
                  username: username,
                  email: email,
                  password: password
                }
              })}
          />
        </Match>

        <Match state={"meals"} current={current}>
          <Meals meals={current.context.meals} 
					deleteMeal={ (id:number) => {
						send({type:'DELETE_MEAL',payload:{id:id}})
					}}
					modifyMeal={  (meal:Meal) => {
						send({type: 'MODIFY_MEAL',payload: {meal:meal }})
					}}
					addMeal={  (meal:Meal) => {
							send({type: 'ADD_MEAL',payload: {meal:meal }})
						}
					}>
					</Meals>      
        </Match>

				<Match state={"restaurants"} current={current}>
          <Restaurants restaurants={current.context.restaurants} 
					deleteRestaurant={ (id:number) => {
						send({type:'DELETE_RESTAURANT',payload:{restaurantId:id}})
					}}
					modifyRestaurant={  (restaurant:Restaurant) => {
						send({type: 'MODIFY_RESTAURANT',payload: {restaurant:restaurant }})
					}}
					addRestaurant={  (restaurant:Restaurant) => {
							send({type: 'ADD_RESTAURANT',payload: {restaurant:restaurant }})
						}
					}>
					</Restaurants>      
        </Match>

        <Match state={"users"} current={current}>
          <Users 
            users={current.context.users}
            deleteUser={(id: number) => {
              send({
                type: 'DELETE_USER',
                payload: {
                  id: id
                }
              })
            }}
            modifyUser={(values: ModifyUserProps) => send({
              type: 'MODIFY_USER',
              payload: values
            })}
            addUser={(values: ModifyUserProps) => send({
              type: 'ADD_USER',
              payload: values
            })}
            openZonesForUser={(id: number,username:string) => {
              setUserIdForZones({
                id:id,
                username: username
              })
              localStorage.setItem('userIdForZone',id.toString())
              // send({
              //   type: 'OPEN_ZONES_FOR_USER',
              //   payload: {
              //     id: id
              //   }
              // })
            }}
          />
        </Match>

      </div>
    </div>
    )
}

export default App;
