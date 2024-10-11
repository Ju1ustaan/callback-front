import React, { useState, useRef, useEffect } from 'react';
import SubmitForm from '../components/SubmitForm';
import DetailForm from '../components/BandaPandaComponents/DetailForm.jsx'
import AboutBandaPanda from '../components/BandaPandaComponents/AboutBandaPanda.jsx'
import { useTranslation } from 'react-i18next';

const BandaPandaPage = () => {
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
      <h1 className="text-2xl sm:text-3xl text-black font-bold">{t("banda_panda.title")}</h1>
      <AboutBandaPanda/>
      <DetailForm setShowSubmit={setShowSubmit} />
        {
          showSubmit && (
            <div ref={submitFormRef}>
              <SubmitForm endpoint={'send/banda-panda/mail'}/>
            </div>
          )
        }
    </div>
  </div>
  )
}

export default BandaPandaPage