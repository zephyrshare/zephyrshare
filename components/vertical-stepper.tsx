'use client';

// components/VerticalStepper.tsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Replace these hooks with your actual data fetching logic
const useCustomers = () => {
  /* Fetch customers logic here */
};
const useAgreements = () => {
  /* Fetch agreements logic here */
};
const useDataFiles = () => {
  /* Fetch data files logic here */
};

const steps = ['Choose data...', 'Choose agreement...', 'Choose customer...'];

export default function VerticalStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customer: '',
    agreement: '',
    dataFile: '',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSelectChange = (value: string, field: 'customer' | 'agreement' | 'dataFile') => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Select>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Select data files" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Analytics Reports</SelectLabel>
                <SelectItem value="sales_report">Sales Report</SelectItem>
                <SelectItem value="customer_engagement">Customer Engagement</SelectItem>
                <SelectItem value="inventory_levels">Inventory Levels</SelectItem>
                <SelectItem value="financial_overview">Financial Overview</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Market Research</SelectLabel>
                <SelectItem value="industry_trends">Industry Trends</SelectItem>
                <SelectItem value="competitor_analysis">Competitor Analysis</SelectItem>
                <SelectItem value="consumer_behavior">Consumer Behavior</SelectItem>
                <SelectItem value="product_feedback">Product Feedback</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case 1:
        return (
          <Select>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Select an agreement" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Service Agreements</SelectLabel>
                <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
                <SelectItem value="sla">Service Level Agreement (SLA)</SelectItem>
                <SelectItem value="purchase_order">Purchase Order Agreement</SelectItem>
                <SelectItem value="software_license">Software License Agreement</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Contract Types</SelectLabel>
                <SelectItem value="consulting_contract">Consulting Contract</SelectItem>
                <SelectItem value="sales_contract">Sales Contract</SelectItem>
                <SelectItem value="distribution_agreement">Distribution Agreement</SelectItem>
                <SelectItem value="employment_contract">Employment Contract</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case 2:
        return (
          <Select>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Select customer for the contract" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Business Type</SelectLabel>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="it_services">IT Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} sx={{ mb: 3, color: 'grey' }}>
            <StepLabel>{label}</StepLabel>
            <div className="ml-10">{getStepContent(index)}</div>
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </React.Fragment>
        ) : (
          <Box>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}
