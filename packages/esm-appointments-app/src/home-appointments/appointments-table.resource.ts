import useSWR from 'swr';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { openmrsFetch } from '@openmrs/esm-framework';
import { AppointmentService, Appointment } from '../types';
import { useMemo } from 'react';
import { useAppointmentDate, getTodaysAppointment } from '../helpers';
import { omrsDateFormat } from '../constants';

export function useTodayAppointments() {
  const { t } = useTranslation();
  const startDate = useAppointmentDate();
  const apiUrl = `/ws/rest/v1/appointment/all?forDate=${startDate}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: Array<Appointment> }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const results = useMemo(() => {
    const serverAppointments = data?.data?.map((appointment) => getTodaysAppointment(appointment, t)) ?? [];

    return {
      appointments: serverAppointments,
      isLoading,
      isError: error,
      isValidating,
      mutate,
    };
  }, [data?.data, error, isLoading, isValidating, mutate, t]);

  return results;
}

export function useServices() {
  const apiUrl = `/ws/rest/v1/appointmentService/all/default`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: Array<AppointmentService> }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    services: data ? data.data : [],
    isLoading,
    isError: error,
    isValidating,
  };
}

export const updateAppointmentStatus = async (toStatus: string, appointmentUuid: string, ac: AbortController) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const statusChangeTime = dayjs(new Date()).format(omrsDateFormat);
  const url = `/ws/rest/v1/appointments/${appointmentUuid}/status-change`;
  return await openmrsFetch(url, {
    body: { toStatus, onDate: statusChangeTime, timeZone: timeZone },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const undoAppointmentStatus = async (appointmentUuid: string, ac: AbortController) => {
  const url = `/ws/rest/v1/appointment/undoStatusChange/${appointmentUuid}`;
  return await openmrsFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};
