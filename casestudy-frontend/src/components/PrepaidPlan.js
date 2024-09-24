import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import './styles/PrepaidPlan.css'; // Import the CSS file specific to Prepaid Plans
import prepaidImage from '../assets/images/prepaid.png'; // Adjust path if necessary

const PrepaidPlans = () => {
  const [prepaidPlans, setPrepaidPlans] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrepaidPlans = async () => {
      try {
        const response = await axios.get('http://localhost:9099/prepaidPlans'); // Adjust URL if needed
        setPrepaidPlans(response.data.prepaidPlans);
      } catch (error) {
        setError('Error fetching prepaid plans');
      }
    };

    fetchPrepaidPlans();
  }, []);

  const handleBuyPlan = (planId) => {
    console.log(planId)
    // Navigate to Payment page with the selected plan ID and planType
    navigate('/payment-gateway', { state: { planId, planType: 'PREPAID' } });
  };

  return (
    <div className="prepaid-container">
      <main>
        {/* Image Section */}
        <div className="prepaid-image-container">
          <img src={prepaidImage} alt="Prepaid Plans" className="prepaid-image" />
          <div className="prepaid-image-text">
            {/* Additional text or styling if needed */}
          </div>
        </div>
      </main>
<br/>
      <div className="prepaid-main-content" >
        <div className=''>
        <h1>Prepaid Plans</h1>
          <p>Select a plan that suits you best</p>

        <div className="prepaid-plans-container">
        
          {error && <p className="error-message">{error}</p>}
          {prepaidPlans.length > 0 ? (
            prepaidPlans.map((plan) => (
              <div className="prepaid-plan" key={plan.id}>
                <h3 className="prepaid-plan-name">{plan.planName}</h3>
                <p>{plan.planDescription}</p>
                <p>Price: Rs. {plan.prepaidBalance}</p>
                <p>Billing period: {plan.billingCycle} days</p>
                <div className="prepaid-button-place">
                 
                  <button
                    onClick={() => handleBuyPlan(plan.planId)}
                    className="prepaid-buy-button"
                  >
                    Buy Plan
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No prepaid plans available.</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PrepaidPlans;
