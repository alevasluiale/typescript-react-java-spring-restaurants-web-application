import React  from "react";
import {Formik,Field,Form, ErrorMessage} from "formik";
import FacebookLogin from 'react-facebook-login';
import * as Yup from 'yup';
import AuthService from "./../services/auth.service"
interface RegisterProps {
  onRegister: (username: string,email:string, password: string) => void
  onFacebookAuth: (username: string,email:string,photoUrl:string)=>void
}

const Register: React.FC<RegisterProps> = ({onRegister,onFacebookAuth}) => {

    return (
      <div className="col-md-4 mx-auto align-items-center">
      <Formik 
        initialValues= {{
          username: '',
          email: '',
          password: ''
        }}
        validationSchema= {
          Yup.object().shape({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
            email: Yup.string().email('Has to be a valid email.').required('Required')
          })
        }
        onSubmit= {(values) => {
          onRegister(values.username,values.email,values.password)
        }}
      >
        {({errors,touched}) => (
          <Form>
            <div className="form-group">
              <label>Username</label>
              <Field className="form-control mb-3" name="username"/>
              <ErrorMessage className="alert alert-danger" name="username"/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <Field className="form-control mb-3" name="email"/>
              <ErrorMessage className="alert alert-danger" name="email"/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <Field className="form-control" name="password" component="input" type="password"/>
              <ErrorMessage className="alert alert-danger" name="password"/>
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                type="submit"
              >
                <span>Register</span>
              </button>
            </div>
            <div className="form-group">
                <FacebookLogin
                  appId="1788569767990308"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={(response: any) => onFacebookAuth(response.name,response.email,response.picture.data.url)}
                  typeButton="primary"
                  buttonStyle={{ width: '100%' }}
                  icon="fa-facebook"
                />
              </div>
          </Form>
        )}
      </Formik>
    </div>
    );
}

export default Register