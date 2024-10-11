import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

const Snackbar = () => {
    const [message, setMessage] = useState('')
    const { t } = useTranslation()
    const showSnackbar = useStore((state) => state.showSnackbar)
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentHour = currentDate.getHours();


    useEffect(() => {
        if (currentDay >= 1 && currentDay <= 5 && currentHour >= 8 && currentHour < 17) {
            setMessage(t("form.message1"))
        } else {
            setMessage(t("form.message2"))
        }
    }, [currentDay, currentHour, t])
    return (
        <div className='w-screen h-screen fixed top-0 left-0 bg-gray flex items-center justify-center bg-opacity-50'>
        <div className=' bg-white p-5 w-4/5 lg:w-3/5 lg:p-10 rounded-xl border-link border-solid border-2 text-black text-center'>
            <p className='relative'>
                <span className='absolute bottom-3/4 lg:bottom-full right-0 text-3xl text-link cursor-pointer' onClick={() => showSnackbar(false)}>&times;</span>
                {message}
            </p>
        </div>
        </div>
    )
}

export default Snackbar