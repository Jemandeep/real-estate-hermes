"use client";

import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: (props) => (props.expand ? 'rotate(180deg)' : 'rotate(0deg)')
}));

const LtvAverageGauge = ({ userProperties }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Calculate the average LTV Ratio of all properties
  const averageLtv = userProperties.length > 0
    ? userProperties.reduce((acc, property) => acc + (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) * 100, 0) / userProperties.length
    : 0;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <CardHeader
        title="Average LTV Ratio"
        subheader="Loan-to-Value Ratio of Your Properties"
      />
<CardContent>
  <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
    <GaugeContainer
      width={200}
      height={200}
      startAngle={-110}
      endAngle={110}
      value={averageLtv}
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
    </GaugeContainer>
    {/* Simplified labels positioned around the gauge */}
    <div style={{ position: 'absolute', bottom: '35px', left: '0px',  fontSize: '10px' }}>0%</div>
    <div style={{ position: 'absolute', top: '65px', left: '10px', fontSize: '10px' }}>25%</div>
    <div style={{ position: 'absolute', top: '27px', left: '95px',  fontSize: '10px' }}>50%</div>
    <div style={{ position: 'absolute', top: '65px', right: '10px', fontSize: '10px' }}>75%</div>
    <div style={{ position: 'absolute', bottom: '35px', right: '-10px', fontSize: '10px' }}>100%</div>
  </div>
  <Typography variant="h6" sx={{ mt: 2 }}>
    Average LTV: {averageLtv.toFixed(2)}%
  </Typography>
  <Typography variant="body2" sx={{ mt: 2 }}>
    The Loan-to-Value (LTV) ratio is a measure used by lenders to assess the risk of a loan. It compares the mortgage amount to the current property value.
  </Typography>
</CardContent>


      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Ratio Breakdown"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Individual Property LTV Ratios:
          </Typography>
          {userProperties.map((property, index) => {
            const ltvRatio = (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) * 100;
            return (
              <Typography key={index} variant="body2" sx={{ marginBottom: 1 }}>
                {property.address}: {ltvRatio.toFixed(2)}%
              </Typography>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default LtvAverageGauge;
