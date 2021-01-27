import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
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
      ><PlusCircleOutlined className="my-auto mx-auto" /></Button>
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
      <Formik
        initialValues={{
          id: 0,
          name: '',
          description: '',
          price: ('' as unknown) as number
        }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            price: Yup.number().required("Required")
          })
        }
        onSubmit={(values) => console.log(values)}
      >
        {props => (
          <Form id="addOrderForm" className="unselectable">
            <Paper key="addOrder" className={classes.paper}>
              <Grid container spacing={2} className="pb-4 unselectable">
                <Grid item className="my-auto">
                  <ButtonBase className={classes.image}>
                    <img className={classes.img} alt="complex" src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png" />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        <div className="form-group">
                          <Field placeholder="Name" className="form-control mb-1" name="name" />
                          <ErrorMessage className="alert alert-danger" name="name" />
                        </div>
                        <div className="form-group">
                          <Field placeholder="Description" className="form-control mb-1" name="description" />
                          <ErrorMessage className="alert alert-danger" name="description" />
                        </div>
                        <div className="form-group">
                          <Field component="input" type="number" step="0.01" min="0" placeholder="Price" className="form-control mb-1" name="price" />
                          <ErrorMessage className="alert alert-danger" name="price" />
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item className="mx-4 my-auto">
                    <Typography variant="subtitle1">
                      <Button
                        form="addOrderForm" key="submit" htmlType="submit"
                        shape="round" type="primary" style={{ background: 'green' }}>Add order</Button>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Form>
        )}
      </Formik>
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
      {orders?.map(order => (
        <Paper key={order.id} className={classes.paper}>
          <Grid container spacing={2} className="pb-4 unselectable">
            <Grid item className="my-auto unselectable">
              <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex" src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png" />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    <span className="nameText">{order.restaurants ? order.restaurants[0].name : null}</span>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(order.date).toLocaleString('en-GB')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    <Button className="mr-4" shape="round" type="primary" style={{ color: 'black' }} danger onClick={e => deleteOrder(order.id ?? 0)}>Remove</Button>
                    <Button className="mr-4" shape="round" type="primary" onClick={e => {
                      setModify({
                        visible: true,
                        id: order.id ?? 0,
                        restaurantName: order.restaurants[0].name ?? '',
                        status: 'test',
                        date: 'test',
                        meals: order.orderMeals
                      })
                    }}>Modify</Button>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  <span className="descriptionText">
                    {order?.totalAmount?.toFixed(2) + " $"}
                  </span>
                </Typography>
                <Typography variant="subtitle1">
                  <span className="descriptionText">
                    {getLatestOrderStatus(order?.orderStatuses).status.name}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>))}
      {modify.visible && <ModifyModal
        modify={modify}
        modifyOrder={modifyOrder}
        setModify={() => setModify({
          visible: false,
          id: 0,
          restaurantName: '',
          status: '',
          date: '',
          meals: []
        })} />}
    </div>
  )
}

export default Orders