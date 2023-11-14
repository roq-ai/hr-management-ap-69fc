import * as yup from 'yup';

export const hrManagerValidationSchema = yup.object().shape({
  team_size: yup.number().integer().required(),
  projects_managed: yup.number().integer().required(),
  performance_rating: yup.number().integer().required(),
  reports_to: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
