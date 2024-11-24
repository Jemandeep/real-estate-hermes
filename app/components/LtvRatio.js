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

  // Calculate the target point at the end of the pointer
  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  // Calculate two additional points to create a triangular pointer
  const baseWidth = 10; // Width at the bottom of the pointer
  const baseLeft = {
    x: cx + (baseWidth / 2) * Math.cos(valueAngle),
    y: cy + (baseWidth / 2) * Math.sin(valueAngle),
  };
  const baseRight = {
    x: cx - (baseWidth / 2) * Math.cos(valueAngle),
    y: cy - (baseWidth / 2) * Math.sin(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <polygon
        points={`${baseLeft.x},${baseLeft.y} ${baseRight.x},${baseRight.y} ${target.x},${target.y}`}
        fill="red"
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
      <CardHeader title="Average LTV Ratio" subheader="Loan-to-Value Ratio of Your Properties" />
      {averageLtv && (
        <Card sx={{ width: 150, margin: '10px 10px 10px auto', textAlign: 'center', backgroundColor: '#ffffff', padding: '10px'}}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: averageLtv <= 50 ? 'green' : averageLtv <= 75 ? 'yellow' : 'red',
              marginRight: 10
            }}></div>
            <Typography variant="body2">
              {averageLtv <= 50 ? 'Good Standing' : averageLtv <= 75 ? 'Moderate Risk' : 'High Risk'}
            </Typography>
          </div>
        </Card>
      )}
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
    <div style={{ position: 'absolute', bottom: '40px', left: '35px',  fontSize: '10px' }}>0%</div>
    <div style={{ position: 'absolute', top: '85px', left: '42px', fontSize: '10px' }}>25%</div>
    <div style={{ position: 'absolute', top: '58px', left: '95px',  fontSize: '10px' }}>50%</div>
    <div style={{ position: 'absolute', top: '85px', right: '37px', fontSize: '10px' }}>75%</div>
    <div style={{ position: 'absolute', bottom: '40px', right: '33px',  fontSize: '10px' }}>100%</div>
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
