/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'reactstrap';
import Panel from '../../../../shared/components/Panel';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';
import { GRAP_HLOGINACTIVITY } from '../../../../utils/EndPoints';

const TotalVisits = ({ dir }) => {
  const { t } = useTranslation('common');
  const [historyLogin, setHistoryLogin] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(GRAP_HLOGINACTIVITY, options)
      .then((res) => {
        setHistoryLogin(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Panel xs={12} lg={8} title={t('system_admin.dashboard.total_visit')}>
      <div dir="ltr">
        {isLoading ? <Spinner /> : (
          <ResponsiveContainer height={250} className="dashboard__area">
            <AreaChart data={historyLogin !== null && historyLogin} margin={{ top: 20, left: -15, bottom: 20 }}>
              <XAxis dataKey="date" tickLine={false} reversed={dir === 'rtl'} />
              <YAxis
                tickFormatter={(value) => `${value} user`}
                tickLine={false}
                orientation={dir === 'rtl' ? 'right' : 'left'}
              />
              {/* <Tooltip {...getTooltipStyles(themeName, 'defaultItems')} /> */}
              <Legend />
              <CartesianGrid />
              <Area name="data" type="monotone" dataKey="data" fill="#70bbfd" stroke="#70bbfd" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Panel>
  );
};

TotalVisits.propTypes = {
  dir: PropTypes.string.isRequired,
};

export default connect((state) => ({ themeName: state.theme.className }))(TotalVisits);
