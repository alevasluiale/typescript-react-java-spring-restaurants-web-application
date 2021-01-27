import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { Order } from "../models/Order";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Meal } from "../models/Meal";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import {GridReadyEvent} from 'ag-grid-community';
import Meals from "./meals.component";
function getLatestOrderStatus(orderStatuses: Array<{
  status: {
    name: string
  }
  date: Date
}>) {
  let idx = 0;
  for (let i = 1; i < orderStatuses.length; i++) {
    if (orderStatuses[i].date.getTime() < orderStatuses[idx].date.getTime()) {
      idx = i;
    }
  }
  return orderStatuses[idx]
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "10px auto",
    maxWidth: 800,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    webkitTouchcallout: 'none',
    webkitOrderSelect: 'none',
    khtmlOrderSelect: 'none',
    mozOrderSelect: 'none',
    msOrderSelect: 'none',
    orderSelect: 'none',
  },
}));

const MealsCellRenderer: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ textAlign: 'left' }} className="-mt-10">
      <Modal
        className=" mx-auto"
        visible={visible}
        title={"Meals for order with id " + props.data.id}
        okText="Ok"
        closable
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Meals
          canAdd={false}
          isInOrder={true}
          deleteMeal={(id: number) => { }}
          modifyMeal={(meal: Meal) => { }}
          addMeal={(meal: Meal) => { }}
          meals={props.data.orderMeals.map((meal: any) => {
            return {
              id: meal.meal.id,
              name: meal.meal.name,
              description: meal.meal.description,
              price: meal.meal.price,
              quantity: meal.quantity
            }
          })} />
      </Modal>
      <Button
        className="-mt-10 mx-auto"
        style={{ cursor: 'pointer', width: '100%', height: "20%" }}
        title="Open meals"
        onClick={() => setVisible(true)}
      ><PlusCircleOutlined style={{height:"150px"}}className="-mt-10 mx-auto" /></Button>
    </div>
  )
}
const columnDefs = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    filter: 'agNumberColumnFilter',
    resizable: true,
    width: 70,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Date placed",
    valueGetter: function (params: any) {
      return new Date(params.data.date).toLocaleString('en-GB')
    },
    sortable: true,
    filter: true,
    resizable: true,
    width: 250,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Price",
    field: "totalAmount",
    sortable: true,
    filter: true,
    resizable: true,
    width: 150,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Restaurant",
    valueGetter: function (params: any) {
      return params.data.restaurants[0].name
    },
    sortable: true,
    filter: true,
    resizable: true,
    width: 150,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Status",
    valueGetter: function (params: any) {
      return getLatestOrderStatus(params.data.orderStatuses).status.name
    },
    sortable: true,
    filter: true,
    resizable: true,
    width: 150,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Last modified",
    valueGetter: function (params: any) {
      return new Date(getLatestOrderStatus(params.data.orderStatuses).date).toLocaleString('en-GB')
    },
    sortable: true,
    filter: true,
    resizable: true,
    width: 150,
    filterParams: {
      applyButton: true,
      resetButton: true,
      closeOnApply: true
    }
  },
  {
    headerName: "Meals",
    maxWidth: 100,
    cellRenderer: 'mealsCellRenderer',
    sortable: true,
    filter: true,
    resizable: true
  }
]
const ModifyModal: React.FC<{
  modify: {
    visible: boolean
    id: number
    restaurantName: string
    status: string
    date: string
    meals: Array<{ meal: Meal, quantity: number }>
  }
  setModify: () => void
  modifyOrder: (values: Order) => void
}> = ({ modify, setModify, modifyOrder }) => {
  return (
    <Modal
      title={'Modify order ' + modify.restaurantName}
      visible={modify.visible}
      footer={[
        <Button key="cancel" onClick={e => setModify()}>
          Cancel
          </Button>,
        <Button type="primary" form="modifyOrderForm" key="submit" htmlType="submit">
          Submit
          </Button>
      ]}
    >
      <Formik
        initialValues={{
          id: modify.id,
          name: modify.restaurantName
        }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required("Required")
          })
        }
        onSubmit={(values) => console.log(values)}
      >
        {props => (
          <Form id="modifyOrderForm">
            <div className="form-group">
              <label>Name</label>
              <Field className="form-control mb-3" name="name" />
              <ErrorMessage className="alert alert-danger" name="name" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <Field className="form-control mb-3" name="description" />
              <ErrorMessage className="alert alert-danger" name="description" />
            </div>
            <div className="form-group">
              <label>Price</label>
              <Field component="input" type="number" step="0.01" min="0" placeholder="Price" className="form-control mb-1" name="price" />
              <ErrorMessage className="alert alert-danger" name="price" />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
const Orders: React.FC<{
  orders?: [Order]
  deleteOrder: (id: number) => void
  modifyOrder: (order: Order) => void
  addOrder: (order: Order) => void
}> = ({ orders, deleteOrder, modifyOrder, addOrder }) => {

  const classes = useStyles();

  const [modify, setModify] = useState({
    visible: false,
    id: 0,
    restaurantName: '',
    status: '',
    date: '',
    meals: [{ meal: {}, quantity: 0 }]
  })

  return (
    <div className={classes.root}>
      <h3 style={{color:'blue'}}>Orders</h3>
      <div style={{ height: "500px" }} className="ag-theme-balham h-screen">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={orders}
          pagination={true}
          paginationPageSize={24}
          onGridReady={(event:GridReadyEvent) => event.api.sizeColumnsToFit()}
          rowSelection="single"
          frameworkComponents={{ mealsCellRenderer: MealsCellRenderer }}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default Orders