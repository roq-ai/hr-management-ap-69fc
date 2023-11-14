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

import { hrManagerValidationSchema } from 'validationSchema/hr-managers';
import { UserInterface } from 'interfaces/user';
import { HrManagerInterface } from 'interfaces/hr-manager';

function HrManagerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: HrManagerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.hr_manager.create({ data: values as RoqTypes.hr_manager });
      resetForm();
      router.push('/hr-managers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HrManagerInterface>({
    initialValues: {
      team_size: 0,
      projects_managed: 0,
      performance_rating: 0,
      reports_to: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: hrManagerValidationSchema,
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
              label: 'Hr Managers',
              link: '/hr-managers',
            },
            {
              label: 'Create Hr Manager',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Hr Manager
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Team Size"
            formControlProps={{
              id: 'team_size',
              isInvalid: !!formik.errors?.team_size,
            }}
            name="team_size"
            error={formik.errors?.team_size}
            value={formik.values?.team_size}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('team_size', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Projects Managed"
            formControlProps={{
              id: 'projects_managed',
              isInvalid: !!formik.errors?.projects_managed,
            }}
            name="projects_managed"
            error={formik.errors?.projects_managed}
            value={formik.values?.projects_managed}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('projects_managed', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Performance Rating"
            formControlProps={{
              id: 'performance_rating',
              isInvalid: !!formik.errors?.performance_rating,
            }}
            name="performance_rating"
            error={formik.errors?.performance_rating}
            value={formik.values?.performance_rating}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('performance_rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.reports_to}
            label={'Reports To'}
            props={{
              name: 'reports_to',
              placeholder: 'Reports To',
              value: formik.values?.reports_to,
              onChange: formik.handleChange,
            }}
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
              onClick={() => router.push('/hr-managers')}
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
    entity: 'hr_manager',
    operation: AccessOperationEnum.CREATE,
  }),
)(HrManagerCreatePage);
