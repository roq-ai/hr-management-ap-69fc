import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { hrAssistantValidationSchema } from 'validationSchema/hr-assistants';
import { UserInterface } from 'interfaces/user';
import { HrAssistantInterface } from 'interfaces/hr-assistant';

function HrAssistantCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: HrAssistantInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.hr_assistant.create({ data: values as RoqTypes.hr_assistant });
      resetForm();
      router.push('/hr-assistants');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HrAssistantInterface>({
    initialValues: {
      assigned_employees: 0,
      work_hours: 0,
      tasks_completed: 0,
      tasks_pending: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: hrAssistantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Hr Assistants',
              link: '/hr-assistants',
            },
            {
              label: 'Create Hr Assistant',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Hr Assistant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Assigned Employees"
            formControlProps={{
              id: 'assigned_employees',
              isInvalid: !!formik.errors?.assigned_employees,
            }}
            name="assigned_employees"
            error={formik.errors?.assigned_employees}
            value={formik.values?.assigned_employees}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('assigned_employees', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Work Hours"
            formControlProps={{
              id: 'work_hours',
              isInvalid: !!formik.errors?.work_hours,
            }}
            name="work_hours"
            error={formik.errors?.work_hours}
            value={formik.values?.work_hours}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('work_hours', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Tasks Completed"
            formControlProps={{
              id: 'tasks_completed',
              isInvalid: !!formik.errors?.tasks_completed,
            }}
            name="tasks_completed"
            error={formik.errors?.tasks_completed}
            value={formik.values?.tasks_completed}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('tasks_completed', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Tasks Pending"
            formControlProps={{
              id: 'tasks_pending',
              isInvalid: !!formik.errors?.tasks_pending,
            }}
            name="tasks_pending"
            error={formik.errors?.tasks_pending}
            value={formik.values?.tasks_pending}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('tasks_pending', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={() => roqClient.user.findManyWithCount({})}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/hr-assistants')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'hr_assistant',
    operation: AccessOperationEnum.CREATE,
  }),
)(HrAssistantCreatePage);
