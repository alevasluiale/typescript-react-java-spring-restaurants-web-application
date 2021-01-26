import React, { useState } from "react";
import "./style/index.css";
import AuthService from "./services/auth.service";
import { useMachine } from '@xstate/react';
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
import Orders from "./components/orders.component";
import { Order } from "./models/Order";

export const App: React.FC = () => {

  const [current, send] = useMachine(createAppStateMachine(AuthService.getCurrentUser()))



  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark unselectable">
        <span style={{ cursor: 'pointer' }} className="navbar-brand unselectable" onClick={e => {
          send({ type: 'HOME' })
        }}>
          TopTal
        </span>
        <div className="navbar-nav mr-auto  unselectable">

          {current.context.currentUser &&
            (<li className="nav-item" onClick={e => {
              send({ type: 'RESTAURANTS' })
            }}>
              <span style={{ cursor: 'pointer' }} className="nav-link unselectable">
                Restaurants
                </span>
            </li>
            )}

          {current.context.currentUser &&
            (<li className="nav-item" onClick={e => {
              send({ type: 'ORDERS' })
            }}>
              <span style={{ cursor: 'pointer' }} className="nav-link unselectable">
                Orders
                </span>
            </li>
            )}

          {current.context.currentUser &&
            current.context.currentUser.roles[0] !== "ROLE_USER" &&
            (<li className="nav-item" onClick={e => {
              send({ type: 'MEALS' })
            }}>
              <span style={{ cursor: 'pointer' }} className="nav-link unselectable">
                Meals
                </span>
            </li>
            )}


          {current.context.currentUser &&
            current.context.currentUser.roles.includes("ROLE_ADMIN") && (
              <li className="nav-item">
                <span style={{ cursor: 'pointer' }} className="nav-link unselectable" onClick={e => {
                  send({ type: 'USERS' })
                }}>
                  Users
                </span>
              </li>
            )}
        </div>

        {current.context.currentUser ? (
          <div className="navbar-nav ml-auto unselectable">
            <li className="nav-item">
              <span style={{ cursor: 'pointer' }} className="nav-link unselectable">
                {current.context.currentUser.username}
              </span>
            </li>
            <li className="nav-item">
              <span style={{ cursor: 'pointer' }} className="nav-link unselectable" onClick={e => {
                send({ type: 'LOG_OUT' })
              }}>
                LogOut
                </span>
            </li>
          </div>
        ) : (
            <div className="navbar-nav ml-auto unselectable">
              <li className="nav-item">
                <span style={{ cursor: 'pointer' }} className="nav-link unselectable"
                  onClick={e => {
                    send({
                      type: 'LOGIN_PAGE'
                    })
                  }}>
                  Login
                  </span>
              </li>

              <li className="nav-item">
                <span style={{ cursor: 'pointer' }} className="nav-link unselectable" onClick={e => {
                  send({
                    type: 'SIGN_UP'
                  })
                }}>
                  Sign Up
                </span>
              </li>
            </div>
          )}
      </nav>


      <div className="container py-4">
        <Match state={['home', 'signed_in']} current={current}>
          <Home />
        </Match>

        <Match state={'login_page'} current={current}>
          <Login onLogin={
            (userName: string, password: string) => {
              send({
                type: 'LOGIN',
                payload: {
                  userName: userName,
                  password: password
                }
              })
            }
          } />
        </Match>

        <Match state={"sign_up"} current={current}>
          <Register
            onRegister={(username: string, email: string, password: string) =>
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
            deleteMeal={(id: number) => {
              send({ type: 'DELETE_MEAL', payload: { id: id } })
            }}
            modifyMeal={(meal: Meal) => {
              send({ type: 'MODIFY_MEAL', payload: { meal: meal } })
            }}
            addMeal={(meal: Meal) => {
              send({ type: 'ADD_MEAL', payload: { meal: meal } })
            }
            }>
          </Meals>
        </Match>

        <Match state={"restaurants"} current={current}>
          <Restaurants
            restaurants={current.context.restaurants}
            meals={current.context.meals}
            isRegularUser={current.context.currentUser?.roles[0] === "ROLE_USER"}
            deleteRestaurant={(id: number) => {
              send({ type: 'DELETE_RESTAURANT', payload: { restaurantId: id } })
            }}
            modifyRestaurant={(restaurant: Restaurant, mealsIds: Array<Number>) => {
              send({ type: 'MODIFY_RESTAURANT', payload: { restaurant: restaurant, mealsIds: mealsIds } })
            }}
            addRestaurant={(restaurant: Restaurant, mealsIds: Array<Number>) => {
              send({ type: 'ADD_RESTAURANT', payload: { restaurant: restaurant, mealsIds: mealsIds } })
            }
            }>
          </Restaurants>
        </Match>

        <Match state={"orders"} current={current}>
          <Orders orders={current.context.orders}
            deleteOrder={(id: number) => {
              send({ type: 'DELETE_MEAL', payload: { id: id } })
            }}
            modifyOrder={(meal: Order) => {
              send({ type: 'MODIFY_MEAL', payload: { meal: meal } })
            }}
            addOrder={(meal: Order) => {
              send({ type: 'ADD_MEAL', payload: { meal: meal } })
            }
            }>
          </Orders>
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
          />
        </Match>

      </div>
    </div>
  )
}

export default App;
