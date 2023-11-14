import * as yup from 'yup';

export const hrAssistantValidationSchema = yup.object().shape({
  assigned_employees: yup.number().integer().required(),
  work_hours: yup.number().integer().required(),
  tasks_completed: yup.number().integer().required(),
  tasks_pending: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
});
