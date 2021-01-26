import React, {useState} from "react";
import {Modal,Button} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Meal } from "../models/Meal";
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import authService from "../services/auth.service";

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
    webkitMealSelect: 'none',
    khtmlMealSelect: 'none',
    mozMealSelect: 'none',
    msMealSelect: 'none',
    mealSelect: 'none',
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
  modifyMeal: (values:Meal) => void
}>=({modify,setModify,modifyMeal}) => {
  console.log(modify)
  return (
    <Modal
        title={'Modify meal '+ modify.name}
        visible={modify.visible}
        footer={[
          <Button key="cancel" onClick={e=> setModify()}>
              Cancel
          </Button>,
          <Button type="primary" form="modifyMealForm" key="submit" htmlType="submit">
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
          onSubmit={(values)=> modifyMeal(values)}
        >
          { props => (
            <Form id="modifyMealForm">
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
const Meals: React.FC<{
  meals?: [Meal]
   deleteMeal: (id:number) => void
   modifyMeal: (values:Meal) => void
   addMeal: (values:Meal) => void
  }> = ({meals,deleteMeal,modifyMeal,addMeal}) => {

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
        onSubmit={(values)=> addMeal(values)}
      >
        { props => (
            <Form id="addMealForm" className="unselectable">
              <Paper key="addMeal" className={classes.paper}>
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
                          form="addMealForm" key="submit" htmlType="submit"
                          shape="round" type="primary" style={{background: 'green'}}>Add meal</Button>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Form>
          )}
      </Formik>
      {meals?.map(meal => (
      <Paper key={meal.id} className={classes.paper}>
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
                  <span className="nameText">{meal.name}</span>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {meal.description}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <Button className="mr-4" shape="round" type="primary" style={{color: 'black'}} danger onClick={e => deleteMeal(meal.id ?? 0)}>Remove</Button>
                  <Button className="mr-4" shape="round" type="primary" onClick={e => {
                    console.log(meal)
                    setModify({
                    visible: true,
                    id:meal.id ?? 0,
                    name:meal.name ?? '',
                    description: meal.description ?? '',
                    price: meal.price ?? 0
                    })}}>Modify</Button>
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                <span className="descriptionText">
                  {meal?.price?.toFixed(2) + " $"}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>))}
      {modify.visible && <ModifyModal 
        modify={modify} 
        modifyMeal={modifyMeal}
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

export default Meals