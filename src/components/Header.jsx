import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { saveLanguage, getLanguage } from '../helper'
import LogoKg from '../assets/icons/logo_ky.b09c137f.svg'
import LogoRu from '../assets/icons/logo_ru.d9978dc4 (1).svg'

const Header = () => {
  const [show, setShow] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const savedLanguage = getLanguage();
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);


  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    saveLanguage(lang);
  }
  return (
    <div className='container mx-auto flex justify-between items-center px-2 py-5'>
        <div className='hidden md:flex items-center gap-9'>
        <a href={t("link")} target='_blank'>
        <div className='logo'>
            <img src='https://mbank.kg/media/logo/MBANK.svg' className='w-full h-full' alt='Mbank Logo'/>
        </div>
        </a>
        <div className='logo-islam'>
        <img src={t("lang") === "Русский"? LogoRu: LogoKg} className='w-full h-full' alt="" />
        </div>
        <p className='opacity-60'>{t("logo")}</p>
        </div>
        <a href={t("link")} target='_blank'>
        <div className='min-w-24 md:hidden h-8'>
          <img className='w-full h-full' src="https://mbank.kg/media/logo/Logo_4EIfhYF.svg" alt="mobile logo" />
        </div>
        </a>
        <div className='lang flex align-middle gap-2 relative' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <p className='md:hidden uppercase text-link'>{t("abr")}</p>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 22.75C18.3848 22.75 22.75 18.3848 22.75 13C22.75 7.61522 18.3848 3.25 13 3.25C7.61522 3.25 3.25 7.61522 3.25 13C3.25 18.3848 7.61522 22.75 13 22.75Z" stroke="#7893B0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3.80859 9.75H22.1914" stroke="#7893B0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3.80859 16.25H22.1914" stroke="#7893B0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13 22.4865C15.2437 22.4865 17.0625 18.2395 17.0625 13.0006C17.0625 7.76165 15.2437 3.51465 13 3.51465C10.7563 3.51465 8.9375 7.76165 8.9375 13.0006C8.9375 18.2395 10.7563 22.4865 13 22.4865Z" stroke="#7893B0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        <p className='hidden md:block uppercase text-link'>{t("lang")}</p>
        {
          show && <div className='absolute right-0 top-full p-5 rounded-xl border-link border-solid border-2 bg-white'>
          <p className='uppercase mb-3 cursor-pointer text-link' onClick={() => changeLanguage('kg')}>Кыргызча</p>
          <p className='uppercase cursor-pointer text-link' onClick={() => changeLanguage('ru')}>Русский</p>
        </div>
        }
        </div>
        
    </div>
  )
}

export default Header