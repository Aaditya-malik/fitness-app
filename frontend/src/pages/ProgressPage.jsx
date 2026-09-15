import React from 'react';
import ProgressCharts from '../components/ProgressCharts.jsx';
import BmiCalculator from '../components/BmiCalculator.jsx';

export default function ProgressPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressCharts />
      <BmiCalculator />
    </div>
  );
}
