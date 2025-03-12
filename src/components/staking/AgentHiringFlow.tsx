// AgentHiringFlow.tsx
import React, { useEffect } from 'react';
import { AgentHiringComponentProps } from './AgentHiringTypes';
import { AgentHiringStep1 } from './AgentHiringStep1';
import { AgentHiringStep2 } from './AgentHiringStep2';
import { AgentHiringStep3 } from './AgentHiringStep3';
import { CompleteEngagementComponent } from './CompleteEngagementComponent';

// Main component integrating all steps
export const AgentHiringFlow: React.FC<AgentHiringComponentProps> = (props) => {
  const { hiringData, onAction } = props;

  // Monitor currentStep changes
  useEffect(() => {
    // Clear stored transaction data when current step is 0
    if (hiringData.currentStep === 0) {
      window.localStorage.removeItem('latestEngagementTxHash');
      window.localStorage.removeItem('latestEngagementId');
    }
  }, [hiringData.currentStep]);

  // Extend onAction handling to ensure 'complete' action is processed correctly
  const handleAction = (action: string, data?: unknown) => {
    // Handle 'complete' action to ensure the process ends correctly
    if (action === 'complete') {
      // Clear stored data
      window.localStorage.removeItem('latestEngagementTxHash');
      window.localStorage.removeItem('latestEngagementId');

      // Call parent component's onAction with clear indication to reset state
      onAction('reset', { message: 'Hiring process completed' });
      return; // Add return to ensure no further execution
    } else {
      // Pass through other actions normally
      onAction(action, data);
    }
  };

  // Render appropriate component based on current step
  switch (hiringData.currentStep) {
    case 1:
      return <AgentHiringStep1 {...props} onAction={handleAction} />;
    case 2:
      return <AgentHiringStep2 {...props} onAction={handleAction} />;
    case 3:
      return <AgentHiringStep3 {...props} onAction={handleAction} />;
    case 4:
      return <CompleteEngagementComponent {...props} onAction={handleAction} />;
    default:
      return (
        <div className="p-5 text-center">
          <p>🎉 Hiring process has been completed or not initialized.</p>
          <button
            onClick={() => handleAction('start-hiring')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Start New Hiring Process
          </button>
        </div>
      );
  }
};

// Export all components for individual use
export {
  AgentHiringStep1,
  AgentHiringStep2,
  AgentHiringStep3,
  CompleteEngagementComponent,
};
