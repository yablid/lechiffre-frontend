/* src/components/BasicFormContainer.tsx */
import React, { useState, ReactNode } from 'react';

interface BasicFormContainerProps {
  formComponent: ReactNode;
  toggleButton: ReactNode;
}

const BasicFormContainer: React.FC<BasicFormContainerProps> = ({ formComponent, toggleButton }) => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      {!showForm ? (
        <div onClick={handleButtonClick}>
          {toggleButton}
        </div>
      ) : (
        <>
          {formComponent}
          <div onClick={handleButtonClick}>
            {toggleButton}
          </div>
        </>
      )}
    </div>
  );
};

export default BasicFormContainer;
