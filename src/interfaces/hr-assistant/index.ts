import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface HrAssistantInterface {
  id?: string;
  user_id: string;
  assigned_employees: number;
  work_hours: number;
  tasks_completed: number;
  tasks_pending: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface HrAssistantGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
