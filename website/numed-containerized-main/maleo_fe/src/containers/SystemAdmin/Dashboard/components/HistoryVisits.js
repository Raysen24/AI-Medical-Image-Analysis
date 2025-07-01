/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
} from 'recharts';
import { Pie } from 'react-chartjs-2';
import { Spinner } from 'reactstrap';
import Panel from '../../../../shared/components/Panel';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';
import { TOP3LOCATION, USERS_ALL } from '../../../../utils/EndPoints';

const renderLegend = ({ payload }) => (
  <ul className="dashboard__chart-legend">
    {payload.map((entry) => (
      <li key={entry.id}><span style={{ backgroundColor: entry.color }} />{entry.value}</li>
    ))}
  </ul>
);

renderLegend.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

const VisitorsSessions = () => {
  const { t } = useTranslation('common');

  const [userActive, setuserActive] = useState([]);
  const [location, setTopLocation] = useState([]);
  const [isLoadingActivities, setLoadingActivities] = useState(false);
  const [isLoadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    setLoadingActivities(true);
    setLoadingLocation(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(USERS_ALL, options)
      .then((res) => {
        setuserActive(res.data.length);
        setLoadingActivities(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingActivities(false);
      });
    axios.get(TOP3LOCATION, options)
      .then((res) => {
        setTopLocation(res.data);
        setLoadingLocation(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingLocation(false);
      });
  }, []);
  console.log('userActive');
  console.log(location);
  return (
    <Panel
      lg={6}
      xl={4}
      md={12}
      title={t('system_admin.dashboard.total_user')}
    >
      <div className="dashboard__visitors-chart">
        {isLoadingActivities ? <Spinner /> : (
          <p className="dashboard__visitors-chart-number">{userActive}</p>
        )}
        <p className="dashboard__visitors-chart-title bold-text">{t('system_admin.dashboard.location')}</p>
        {isLoadingLocation ? <Spinner /> : (
          <ResponsiveContainer className="dashboard__chart-pie" width="100%" height={220}>
            <Pie
              data={{
                maintainAspectRatio: false,
                responsive: false,
                labels: location && location.map((e) => e.location_name),
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: ['#D61C4E',
                      '#0096FF',
                      '#D36B00',
                      '#FFA500'],
                    hoverBackgroundColor: ['#D61C4E',
                      '#0096FF',
                      '#D36B00',
                      '#FFA500'],
                  },
                ],
              }}
              options={{
                legend: {
                  display: false,
                  position: 'right',
                },
                elements: {
                  arc: {
                    borderWidth: 0,
                  },
                },
              }}
            />
          </ResponsiveContainer>
        )}
      </div>
    </Panel>
  );
};

export default (VisitorsSessions);
