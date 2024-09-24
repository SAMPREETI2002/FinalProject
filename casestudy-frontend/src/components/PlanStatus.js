import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { checkPlanStatus } from './CheckPlanStatus';
import './styles/PlanStatus.css'; // Create a CSS file for styling the box

const PlanStatus = () => {
  const { userEmail } = useContext(UserContext);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRenew, setIsRenew] = useState(false); // State for checkbox
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the plan status when the component mounts
    const fetchPlanStatus = async () => {
      setLoading(true);
      try {
        const data = await checkPlanStatus(userEmail);
        console.log(data); // Log the entire response to check its structure
        setPlanData(data); // Store the entire response
      } catch (err) {
        setError('Failed to load plan status');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanStatus();
  }, [userEmail]);

  const handlePayClick = () => {
    navigate('/payment-gateway', {
      state: {
        planId: planData?.plan.planId,
        planType: "POSTPAID",
        invoiceId: planData?.invoice?.invoiceId,
        changePlan: isRenew, // Set changePlan based on checkbox state
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="plan-status-box">
      {planData ? (
        <>
          <h2>Current Plan Status</h2>
          {planData.plan ? ( // Check if planData.plan exists
            <>
              <p><strong>Plan Name:</strong> {planData.plan.planName}</p>
              <p><strong>Days Left:</strong> {planData.daysLeft} days</p> {/* Display daysLeft */}
            </>
          ) : (
            <p>No plan information available.</p> // Fallback if plan data is missing
          )}

          {planData.invoice && (
            <>
              <div className="invoice-info">
                <h3>Invoice Information</h3>
                <p><strong>Invoice ID:</strong> {planData.invoice.invoiceId}</p>
                <p><strong>Amount:</strong> Rs.{planData.invoice.amount}</p>
                <p><strong>Due Date:</strong> {new Date(planData.invoice.date).toLocaleDateString()}</p>
              </div>
              
              {/* Render Renew Plan checkbox and Pay button only if invoice data is available */}
              <div className="renew-plan">
              
              <input
              type="checkbox"
              checked={isRenew}
              onChange={() => setIsRenew(!isRenew)}
              />
              <p className="change-text"> Change Plan</p>
              
              </div>
              

              <button onClick={handlePayClick} className="pay-button">
                Pay
              </button>
            </>
          )}

          <p>{planData.message}</p>
        </>
      ) : (
        <p>No active plan found.</p>
      )}
    </div>
  );
};

export default PlanStatus;
