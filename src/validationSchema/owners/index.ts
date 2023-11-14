import * as yup from 'yup';

export const ownerValidationSchema = yup.object().shape({
  business_started: yup.date().required(),
  total_employees: yup.number().integer().required(),
  total_departments: yup.number().integer().required(),
  total_revenue: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
});
