import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Add } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { launchOverlay } from '../hooks/useOverlay';
import { useAppointmentDate } from '../helpers';
import AppointmentServices from '../admin/appointment-services/appointment-services.component';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);
import styles from './metrics-header.scss';

const MetricsHeader: React.FC = () => {
  const { t } = useTranslation();
  const startDate = useAppointmentDate();
  return (
    <div className={styles.metricsContainer}>
      <span className={styles.metricsTitle}>{t('appointmentMetrics', 'Appointment metrics')}</span>
      <div className={styles.metricsContent}>
        {dayjs(new Date()).isBefore(new Date(startDate), 'date') && (
          <Button
            renderIcon={ArrowRight}
            onClick={() => navigate({ to: `\${openmrsSpaBase}/appointments/missed` })}
            kind="ghost">
            {t('seeMissedAppointments', 'See missed appointments')}
          </Button>
        )}
        <Button
          renderIcon={Add}
          onClick={() =>
            launchOverlay(t('createAppointmentService', 'Create appointment services'), <AppointmentServices />)
          }
          kind="ghost">
          {t('createAppointmentService', 'Create appointment services')}
        </Button>
      </div>
    </div>
  );
};

export default MetricsHeader;
