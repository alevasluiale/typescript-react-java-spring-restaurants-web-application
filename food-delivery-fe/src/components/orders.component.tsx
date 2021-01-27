import React, { useState } from "react";
import { Modal, Button, Popconfirm } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { Order } from "../models/Order";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Meal } from "../models/Meal";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent } from 'ag-grid-community';
import Meals from "./meals.component";
import AuthService from "./../services/auth.service";

function getLatestOrderStatus(orderStatuses: Array<{
  status: {
    name: string
  }
  date: Date
}>) {
  let idx = 0;
  for (let i = 1; i < orderStatuses.length; i++) {
    const d1 = new Date(orderStatuses[i].date)
    const d2 = new Date(orderStatuses[idx].date)
    if (d1.getTime() > d2.getTime()) {
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
const OperationCellRenderer: React.FC<any> = (props) => {
  const modifyOrder = props.colDef.cellRendererParams.modifyOrder
  if (getLatestOrderStatus(props.data.orderStatuses).status.name === "PLACED") {
    if (AuthService.getCurrentUser().roles[0] === "ROLE_USER") {
      return (<Popconfirm title="Are you sure you want to cancel this order?"
        onConfirm={() => modifyOrder(props.data.id,"CANCELED")}
      >
        <Button
          className="-mt-10 mx-auto"
          style={{ cursor: 'pointer', width: '100%', height: "20%" }}
          title="Cancel order"
        >Cancel</Button>
      </Popconfirm>)
    }
    else return (<Popconfirm title="Are you sure you start processing this order?"
      onConfirm={() => modifyOrder(props.data.id,"PROCESSING")}
    >
      <Button
        className="-mt-10 mx-auto"
        style={{ cursor: 'pointer', width: '100%', height: "20%" }}
        title="Process order"
      >Process</Button>
    </Popconfirm>)
  }
  else if (getLatestOrderStatus(props.data.orderStatuses).status.name === "PROCESSING" &&
  AuthService.getCurrentUser().roles[0] !== "ROLE_USER")  {
    return (<Popconfirm title="Are you sure you finished this order?"
      onConfirm={() => modifyOrder(props.data.id,"IN_ROUTE")}
    >
      <Button
        className="-mt-10 mx-auto"
        style={{ cursor: 'pointer', width: '100%', height: "20%" }}
        title="Send In route"
      >Send</Button>
    </Popconfirm>)
  }
  else if (getLatestOrderStatus(props.data.orderStatuses).status.name === "IN_ROUTE" &&
  AuthService.getCurrentUser().roles[0] !== "ROLE_USER") {
    return (<Popconfirm title="Are you sure you have delivered this order?"
      onConfirm={() => modifyOrder(props.data.id,"DELIVERED")}
    >
      <Button
        className="-mt-10 mx-auto"
        style={{ cursor: 'pointer', width: '100%', height: "20%" }}
        title="Deliver order"
      >Deliver</Button>
    </Popconfirm>)
  }
  else if (getLatestOrderStatus(props.data.orderStatuses).status.name === "DELIVERED" &&
  AuthService.getCurrentUser().roles[0] === "ROLE_USER") {
    return (<Popconfirm title="Are you sure you have received this order?"
      onConfirm={() => modifyOrder(props.data.id,"RECEIVED")}
    >
      <Button
        className="-mt-10 mx-auto"
        style={{ cursor: 'pointer', width: '100%', height: "20%" }}
        title="Mark as received"
      >Mark Received</Button>
    </Popconfirm>)
  }
  return null
}
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
      >Show</Button>
    </div>
  )
}

const Orders: React.FC<{
  orders?: [Order]
  modifyOrder: (id: number,status: string) => void
}> = ({ orders, modifyOrder }) => {

  const classes = useStyles();
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
      valueGetter: function (params: any) {
        return params.data.totalAmount.toFixed(2)
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
      headerName: "Restaurant",
      valueGetter: function (params: any) {
        return params.data.restaurants ? params.data.restaurants[0].name : null
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
    },
    {
      headerName: "Operation",
      maxWidth: 100,
      cellRenderer: 'operationCellRenderer',
      cellRendererParams: {
        modifyOrder: modifyOrder
      },
      sortable: true,
      filter: true,
      resizable: true
    }
  ]

  return (
    <div className={classes.root}>
      <h3 style={{ color: 'blue' }}>Orders</h3>
      <div style={{ height: "500px" }} className="ag-theme-balham h-screen">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={orders}
          pagination={true}
          paginationPageSize={24}
          onGridReady={(event: GridReadyEvent) => event.api.sizeColumnsToFit()}
          rowSelection="single"
          frameworkComponents={{ mealsCellRenderer: MealsCellRenderer, operationCellRenderer: OperationCellRenderer }}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default Orders