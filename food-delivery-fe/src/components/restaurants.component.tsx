import React, { useState } from "react";
import { Modal, Button, TreeSelect } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Restaurant } from "../models/Restaurant";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TreeNode } from "antd/lib/tree-select";
import { Meal } from "../models/Meal";


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
    webkitRestaurantSelect: 'none',
    khtmlRestaurantSelect: 'none',
    mozRestaurantSelect: 'none',
    msRestaurantSelect: 'none',
    restaurantSelect: 'none',
  },
}));
const Restaurants: React.FC<{
  restaurants?: [Restaurant]
  meals?: [Meal]
  isRegularUser?: boolean
  deleteRestaurant: (id: number) => void
  modifyRestaurant: (restaurant: Restaurant, mealsIds: Array<Number>) => void
  addRestaurant: (restaurant: Restaurant, mealsIds: Array<Number>) => void
}> = ({ restaurants, meals,isRegularUser, deleteRestaurant, modifyRestaurant, addRestaurant }) => {

  const classes = useStyles();
  const [modify, setModify] = useState({
    visible: false,
    id: 0,
    description: '',
    name: '',
    mealsIds: []
  })

  function removeUndefinedFromArray(value: any) {
    if (value === undefined) return []
    else return value
  }
  return (
    <div className={classes.root}>
      {isRegularUser === false ? <Formik
        initialValues={{
          id: 0,
          description: '',
          name: '',
          mealsIds: []
        }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            mealsIds: Yup.array().required("Required")
          })
        }
        onSubmit={(values) => addRestaurant(values, values.mealsIds)}
      >
        {props => (
          <Form id="addRestaurantForm" className="unselectable">
            <Paper key="addRestaurant" className={classes.paper}>
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
                          <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={meals?.map((meal: Meal) => {
                              return {
                                title: meal.name,
                                value: meal.id,
                                key: meal.id
                              }
                            })}
                            placeholder="Select meals"
                            allowClear
                            treeCheckable={true}
                            showCheckedStrategy="SHOW_PARENT"
                            treeDefaultExpandAll
                            value={props.values.mealsIds}
                            onChange={value => props.setFieldValue("mealsIds", value)}
                          />
                          <ErrorMessage className="alert alert-danger" name="mealsIds" />
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item className="mx-4 my-auto">
                    <Typography variant="subtitle1">
                      <Button
                        form="addRestaurantForm" key="submit" htmlType="submit"
                        shape="round" type="primary" style={{ background: 'green' }}>Add restaurant</Button>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Form>
        )}
      </Formik> : null }
      {restaurants?.map(restaurant => (
        <Paper key={restaurant.id} className={classes.paper}>
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
                    <span className="nameText">{restaurant.name}</span>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {restaurant.description}
                  </Typography>
                </Grid>
                {isRegularUser === false ? <Grid item>
                  <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    <Button className="mr-4" shape="round" type="primary" style={{ color: 'black' }} danger onClick={e => deleteRestaurant(restaurant.id ?? 0)}>Remove</Button>
                    <Button className="mr-4" shape="round" type="primary" onClick={e => setModify({
                      visible: true,
                      id: restaurant.id ?? 0,
                      name: restaurant.name ?? '',
                      description: restaurant.description ?? '',
                      mealsIds: removeUndefinedFromArray(restaurant.meals?.map(meal => meal.id))
                    })}>Modify</Button>
                  </Typography>
                </Grid> : null }
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  <Button shape="round" type="primary" style={{ background: 'green' }}>
                    Visit
              </Button>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>))}
      {modify.visible && <Modal
        title={'Modify restaurant ' + modify.name}
        visible={modify.visible}
        footer={[
          <Button key="cancel" onClick={e => setModify({
            id: 0,
            name: '',
            visible: false,
            description: '',
            mealsIds: []
          })}>
            Cancel
          </Button>,
          <Button type="primary" form="modifyRestaurantForm" key="submit" htmlType="submit">
            Submit
          </Button>
        ]}
      >
        <Formik
          initialValues={{
            id: modify.id,
            name: modify.name,
            description: modify.description,
            mealsIds: modify.mealsIds
          }}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().required("Required"),
              description: Yup.string().required("Required"),
              mealsIds: Yup.array().required("Required")
            })
          }
          onSubmit={(values) => modifyRestaurant(values, values.mealsIds)}
        >
          {props => (
            <Form id="modifyRestaurantForm">
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
                <label>Meals</label>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={meals?.map((meal: Meal) => {
                    return {
                      title: meal.name,
                      value: meal.id,
                      key: meal.id
                    }
                  })}
                  placeholder="Select meals"
                  allowClear
                  treeCheckable={true}
                  showCheckedStrategy="SHOW_PARENT"
                  treeDefaultExpandAll
                  value={props.values.mealsIds}
                  onChange={value => props.setFieldValue("mealsIds", value)}
                />
                <ErrorMessage className="alert alert-danger" name="mealsIds" />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>}
    </div>
  )
}

export default Restaurants