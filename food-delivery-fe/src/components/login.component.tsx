import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import FacebookLogin from 'react-facebook-login';


interface LoginProps {
  onLogin: (userName: string, password: string) => void
  onFacebookAuth: (username: string,email:string,photoUrl:string)=>void
}
const Login: React.FC<LoginProps> = ({ onLogin,onFacebookAuth }) => {

  return (
      <div className="col-md-4 mx-auto align-items-center">
        <Formik
          initialValues={{
            userName: '',
            password: ''
          }}
          validationSchema={
            Yup.object().shape({
              userName: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })
          }
          onSubmit={(values) => {
            onLogin(values.userName, values.password);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <label>Username</label>
                <Field className="form-control mb-3" name="userName" />
                <ErrorMessage className="alert alert-danger" name="userName" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field className="form-control" name="password" component="input" type="password" />
                <ErrorMessage className="alert alert-danger" name="password" />
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                >
                  <span>Login</span>
                </button>
              </div>
              <div className="form-group">
                <FacebookLogin
                  appId="1788569767990308"
                  autoLoad={true}
                  fields="name,email,picture"
                  callback={(response: any) =>  onFacebookAuth(response.name,response.email,response.picture.data.url)}
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

export default Login
