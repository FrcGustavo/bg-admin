import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { InputText } from '../../components/atoms';
import { useStateValue } from '../../store/StateProvider';
import { setUser } from '../../store/actions';
import { auth } from '../../firebase';
import './styles.css';

const Login = () => {
  const [, dispatch] = useStateValue();
  const history = useHistory();

  const handleValidate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'El correo es obligatorio';
    }
    if (!values.password) {
      errors.password = 'La contraseña es obligatoria';
    }
    return errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    // dispatch(setUser({ email: values.email }));
    // history.push('/');
  };

  const handleLoginDemo = () => {
    const email = 'blogging.demos@gmail.com';
    const password = 'demos@blogging404';
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(setUser({ isAuthenticated: true, email }));
        history.push('/');
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={handleValidate}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form className="login__form" onSubmit={handleSubmit}>
              <InputText
                type="email"
                name="email"
                label="Correo electronico:"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={errors.email}
                touched={touched.email}
              />
              <InputText
                type="password"
                name="password"
                label="Contraseña:"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={errors.password}
                touched={touched.password}
              />
              <div>
                <button
                  type="submit"
                  className="login__submit"
                  disabled={isSubmitting}
                >
                  Entrar
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="login__demo"
                  onClick={handleLoginDemo}
                >
                  Login Demo
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
