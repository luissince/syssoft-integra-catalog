import React from "react";

interface StepIndicator {
  currentStep: "info" | "delivery" | "payment";
  name: string;
}

interface StepIndicatorProps {
  currentStep: StepIndicator["currentStep"];
  steps: StepIndicator[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const currentIndex = steps.findIndex((s) => s.currentStep === currentStep);

  return (
    <div className="mb-4">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => (
          <li key={index} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center  transition-colors duration-300 ${currentIndex > index ? 'bg-green-500 text-white' :
                currentIndex === index ? 'bg-primary text-white ring-4' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {currentIndex > index ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : index + 1}
              </div>
              <span className={`ml-4 text-sm hidden md:block ${currentIndex >= index ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && <div className={`flex-auto h-1 mx-4 rounded ${currentIndex > index ? 'bg-primary' : 'bg-muted'}`}></div>}
          </li>
        ))}
      </ol>
    </div>
  );
};
