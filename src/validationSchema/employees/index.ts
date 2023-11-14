import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  position: yup.string().required(),
  department: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().nullable(),
  status: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
