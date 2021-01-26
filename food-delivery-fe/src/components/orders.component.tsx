import React, {useState} from "react";
import {Modal,Button} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Order } from "../models/Order";
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';

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

const ModifyModal: React.FC<{
  modify:{
    id: number
    name: string
    price: number
    description: string
    visible: boolean
  }
  setModify: () => void
  modifyOrder: (values:Order) => void
}>=({modify,setModify,modifyOrder}) => {
  return (
    <Modal
        title={'Modify order '+ modify.name}
        visible={modify.visible}
        footer={[
          <Button key="cancel" onClick={e=> setModify()}>
              Cancel
          </Button>,
          <Button type="primary" form="modifyOrderForm" key="submit" htmlType="submit">
              Submit
          </Button>
          ]}
      >
        <Formik 
          initialValues= {{
            id: modify.id,
            name: modify.name,
            description: modify.description,
            price: modify.price
          }}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().required("Required"),
              description: Yup.string().required("Required"),
              price: Yup.number().required("Required")
            })
          }
          onSubmit={(values)=> console.log(values)}
        >
          { props => (
            <Form id="modifyOrderForm">
              <div className="form-group">
                <label>Name</label>
                <Field className="form-control mb-3" name="name"/>
                <ErrorMessage className="alert alert-danger" name="name"/>
              </div>
              <div className="form-group">
                <label>Description</label>
                <Field className="form-control mb-3" name="description"/>
                <ErrorMessage className="alert alert-danger" name="description"/>
              </div>
              <div className="form-group">
                <label>Price</label>
                <Field component="input" type="number" step="0.01" min="0" placeholder="Price" className="form-control mb-1" name="price"/>
                <ErrorMessage className="alert alert-danger" name="price"/>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
  )
}
const Orders: React.FC<{
  orders?: [Order]
   deleteOrder: (id:number) => void
   modifyOrder: (order:Order) => void
   addOrder: (order:Order) => void
  }> = ({orders,deleteOrder,modifyOrder,addOrder}) => {

  const classes = useStyles();

  const [modify,setModify] = useState({
    visible: false,
    id: 0,
    name: '',
    description: '',
    price: 0
  })

  return (
    <div className={classes.root}>
      <Formik 
        initialValues= {{
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
        onSubmit={(values)=> console.log(values)}
      >
        { props => (
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
                            <Field placeholder="Name" className="form-control mb-1" name="name"/>
                            <ErrorMessage className="alert alert-danger" name="name"/>
                          </div>
                          <div className="form-group">
                            <Field placeholder="Description" className="form-control mb-1" name="description"/>
                            <ErrorMessage className="alert alert-danger" name="description"/>
                          </div>
                          <div className="form-group">
                            <Field component="input" type="number" step="0.01" min="0" placeholder="Price" className="form-control mb-1" name="price"/>
                            <ErrorMessage className="alert alert-danger" name="price"/>
                          </div>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item className="mx-4 my-auto">
                      <Typography variant="subtitle1">
                        <Button
                          form="addOrderForm" key="submit" htmlType="submit"
                          shape="round" type="primary" style={{background: 'green'}}>Add order</Button>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Form>
          )}
      </Formik>
      {orders?.map(order => (
      <Paper key={order.id} className={classes.paper}>
        <Grid container spacing={2} className="pb-4 unselectable">
          <Grid item  className="my-auto unselectable">
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png" />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  <span className="nameText">{order.restaurant}</span>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.totalAmount}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <Button className="mr-4" shape="round" type="primary" style={{color: 'black'}} danger onClick={e => deleteOrder(order.id ?? 0)}>Remove</Button>
                  <Button className="mr-4" shape="round" type="primary" onClick={e => {
                    setModify({
                    visible: true,
                    id:order.id ?? 0,
                    name: 't',
                    description:  't',
                    price:  1
                    })}}>Modify</Button>
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                <span className="descriptionText">
                  {order?.totalAmount?.toFixed(2) + " $"}
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
            id: 0,
            name: '',
            visible:false,
            description: '',
            price: 0
          })}/>}
    </div>
  )
}

export default Orders