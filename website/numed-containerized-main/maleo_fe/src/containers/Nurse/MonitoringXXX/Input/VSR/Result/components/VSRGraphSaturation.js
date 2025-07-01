import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import Panel from '../../../../../../../shared/components/Panel';
// import getTooltipStyles from '../../../shared/helpers';

const data = [
  {
    name: 'Mon', cycling: 6.8, pv: 800,
  },
  {
    name: 'Tue', cycling: 8.1, pv: 967,
  },
  {
    name: 'Wed', cycling: 3, pv: 1098,
  },
  {
    name: 'Thu', cycling: 5.5, pv: 1200,
  },
  {
    name: 'Fri', cycling: 4, pv: 1108,
  },
  {
    name: 'Sat', cycling: 7, pv: 1108,
  },
  {
    name: 'Sun', cycling: 8.2, pv: 680,
  },
];

const VSRGraphSaturation = ({ dir }) => {
  const { t } = useTranslation('common');

  return (
    <Panel xs={4} lg={4} title={t('02 Saturation')}>
      <div dir="ltr">
        <ResponsiveContainer height={250} className="dashboard__area">
          <AreaChart data={data} margin={{ top: 20, left: -15, bottom: 20 }}>
            <XAxis dataKey="name" tickLine={false} reversed={dir === 'rtl'} />
            <YAxis
              tickFormatter={(value) => `${value}km`}
              tickLine={false}
              orientation={dir === 'rtl' ? 'right' : 'left'}
            />
            {/* <Tooltip {...getTooltipStyles(themeName, 'defaultItems')} /> */}
            <Legend />
            <CartesianGrid />
            <Area name="" type="monotone" dataKey="cycling" fill="#70bbfd" stroke="#70bbfd" fillOpacity={0.2} />
            <Area name="" type="monotone" dataKey="walking" fill="#4ce1b6" stroke="#4ce1b6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
};

VSRGraphSaturation.propTypes = {
  dir: PropTypes.string.isRequired,
};

export default connect((state) => ({ themeName: state.theme.className }))(VSRGraphSaturation);
