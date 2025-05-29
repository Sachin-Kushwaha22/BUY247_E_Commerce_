// CheckoutProgressBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ProgressBar.css';

const ProgressBar = ({handleCheckoutStep, currentStep }) => {
  // Define the steps in the checkout process
  const steps = ['address', 'overview', 'payment'];

  const icons = [<i class="fa-solid fa-location-dot"></i>, <i class="fa-solid fa-eye"></i>, <i class="fa-solid fa-indian-rupee-sign"></i>]
  
  // Find the index of the current step
  const currentIndex = steps.indexOf(currentStep);
  
  // Calculate progress percentage based on current step
  const getProgressPercentage = () => {
    if (currentIndex === 0) return 0;
    if (currentIndex === 1) return 50;
    if (currentIndex === 2) return 100;
    return 0;
  };

  // State for the animated progress
  const [progress, setProgress] = useState(0);
  const previousStepRef = useRef(currentStep);
  
  // Animate the progress when currentStep changes
  useEffect(() => {
    const targetProgress = getProgressPercentage();
    const startProgress = previousStepRef.current === currentStep ? progress : 
      steps.indexOf(previousStepRef.current) === 0 ? 0 : 
      steps.indexOf(previousStepRef.current) === 1 ? 50 : 
      steps.indexOf(previousStepRef.current) === 2 ? 100 : 0;
    
    previousStepRef.current = currentStep;
    
    // Reset animation timers
    let animationFrameId = null;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    
    const animateProgress = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const timeProgress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = timeProgress < 0.5 
        ? 4 * timeProgress * timeProgress * timeProgress 
        : 1 - Math.pow(-2 * timeProgress + 2, 3) / 2; // Ease in-out cubic for smoother effect
      
      const newProgress = startProgress + (targetProgress - startProgress) * easedProgress;
      setProgress(newProgress);
      
      if (timeProgress < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateProgress);
    
    // Cleanup function to cancel animation if component unmounts or step changes
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentStep]);

  return (
    <div className="progress-container">
      {/* Progress bar background */}
      <div className="progress-background">
        {/* Inner texture for depth */}
        <div className="background-texture"></div>
      </div>
      
      {/* Animated water-filling progress bar */}
      <div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
      >
        {/* Water shine effect */}
        <div className="water-shine"></div>
        
        {/* Water ripples */}
        <div className="water-ripple ripple-1"></div>
        <div className="water-ripple ripple-2"></div>
      </div>
      
      {/* Step indicators */}
      {steps.map((step, index) => {
        const isActive = currentIndex >= index;
        const isComplete = currentIndex > index;
        const stepPosition = index === 0 ? 0 : index === steps.length - 1 ? 100 : 50;
        
        return (
          <div 
            key={step}
            className="step-container"
            style={{ left: `${stepPosition}%` }}
            onClick={() => handleCheckoutStep(steps[index])}
          >
            {/* Indicator */}
            <div className={`step-indicator ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
              {isComplete ? (
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <span className="step-number">{icons[index]}</span>
              )}

              
              
              {/* Pulsing animation for current step */}
              {currentIndex === index && <div className="pulse-ring"></div>}
            </div>
            
            {/* Step label */}
            <span className={`step-label ${isActive ? 'active' : ''}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;