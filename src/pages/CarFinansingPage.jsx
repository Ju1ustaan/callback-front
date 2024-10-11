import React, { useState, useRef, useEffect } from 'react';
import DetailForm from '../components/CarloansComponent/DetailForm';
import SubmitForm from '../components/SubmitForm';
import { useTranslation } from 'react-i18next';

const CarFinansingPage = () => {
  const { t } = useTranslation();
  const [showSubmit, setShowSubmit] = useState(false);
  const submitFormRef = useRef(null); 

  useEffect(() => {
    if (showSubmit && submitFormRef.current) {
      submitFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showSubmit]);

  return (
    <div className="container mx-auto">
      <div className="bg-gray py-8 px-10 rounded-3xl shadow-sm">
        <h1 className="text-3xl text-black font-bold mb-14 xl:mb-6">{t("carloans.title")}</h1>
        <DetailForm setShowSubmit={setShowSubmit} />
        {
          showSubmit && (
            <div ref={submitFormRef}>
              <SubmitForm endpoint={'send/auto'}/>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default CarFinansingPage;
