import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMask } from '@react-input/mask';
import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store';

import PassportUploadForm from './PassportUploadForm';
import Snackbar from './Snackbar';

import { postAutoFinance } from '../api';

const PhoneInput = React.forwardRef(({ onChange, onBlur, name, placeholder }, ref) => {
    const inputRef = useMask({ mask: '+996(___) __-__-__', replacement: { _: /\d/ } });
    return (
        <input
            type="text"
            ref={(e) => {
                ref(e);
                inputRef.current = e;
            }}
            name={name}
            placeholder={placeholder}
            className="p-5 rounded-md w-full"
            onChange={onChange}
            onBlur={onBlur}
        />
    );
});

const SubmitForm = ({ endpoint }) => {
    const detailform = useStore(state => state.detailform)
    const showSnackbar = useStore((state) => state.showSnackbar);
    const { t } = useTranslation();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const show = useStore(state => state.snackbar)
    const photo1 = useStore(state => state.photo1)
    const photo2 = useStore(state => state.photo2)
    const photo3 = useStore(state => state.photo3)

    const regions = t('form.region', { returnObjects: true });

    useEffect(() => {
        if (photo1 || photo2 || photo3) {
            const file = new File([photo1], 'passport-front.png', { type: 'image/png' });
            setValue('photo1', file);
            const file2 = new File([photo2], 'passport-back.png', { type: 'image/png' });
            setValue('photo2', file2);
            const file3 = new File([photo3], 'passport.png', { type: 'image/png' });
            setValue('photo3', file3);
        }
    }, [photo1, photo2, photo3, setValue]);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: postAutoFinance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autofinanse'] });
            showSnackbar(true);
            reset();
        },
    });


    const onSubmit = (data) => {

        const payload = {
            details: {
                name: data.name,
                phone: data.phone,
                region: data.region,
                topic: endpoint,
                ...detailform
            },
            photo1: data.photo1,
            photo2: data.photo2,
            photo3: data.photo3,
        }
        mutation.mutate(payload);
        reset()
    };


    return (
        <div className="bg-gray py-10 border-y-2 border-yellow">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col '>
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className='flex flex-col w-full lg:w-1/2'>
                        <div className='relative w-full flex justify-between items-center mb-10'>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="name">{t("form.name.title")}</label>
                            <input
                                type="text"
                                placeholder={t("form.name.placeholder")}
                                name="name"
                                id="name"
                                className="p-5 rounded-md w-full mr-0"
                                {...register("name", { required: true, maxLength: 250 })}
                            />
                            {errors.name && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Поле имя обязательна к заполнению и оно не должно превышать 250 символов</span>}
                        </div>
                        <div className='relative w-full flex justify-between items-center mb-10'>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="phone">{t("form.phone.title")}</label>
                            <PhoneInput
                                name="phone"
                                placeholder={t("form.phone.placeholder")}
                                {...register("phone", {
                                    required: true,
                                    pattern: {
                                        value: /^\+996\(\d{3}\) \d{2}-\d{2}-\d{2}$/,
                                        message: "Введите номер телефона без +996"
                                    }
                                })}
                            />
                            {errors.phone && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Введите корректный номер телефона</span>}
                        </div>
                        <div className='relative w-full flex justify-between items-center mb-5'>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="region">Регион</label>
                            <select
                                name="region"
                                id="region"
                                className="p-5 rounded-md w-full bg-white text-black mr-0"
                                {...register("region", { required: true })}
                            >
                                {regions.map((region, idx) => (
                                    <option key={idx} value={region}>{region}</option>
                                ))}
                            </select>
                            {errors.region && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите регион!</span>}
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 relative'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="name">{t("carloans.photo")}</label>
                        <div className='flex relative'>
                            <PassportUploadForm label={"photo1"} />
                            <input name="photo1" id='photo1' {...register("photo1", { required: true })} className='w-0' />
                            {errors.photo1 && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Сделайте снимок паспорта!</span>}
                        </div>
                        <div className='flex relative'>
                            <PassportUploadForm label={"photo2"} />
                            <input name="photo2" id='photo2' {...register("photo2", { required: true })} className='w-0' />
                            {errors.photo2 && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Сделайте снимок паспорта!</span>}
                        </div>
                        <div className='flex relative'>
                            <PassportUploadForm label={"photo3"} />
                            <input name="photo3" id='photo3' {...register("photo3", { required: true })} className='w-0' />
                            {errors.photo3 && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Сделайте снимок паспорта!</span>}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className='flex items-center justify-center gap-4'>
                        <p className='text-sm text-center'>{t('carloans.publicoffer.title1')}</p>
                        <a href={t("carloans.publicoffer.link1")} target="_blank" rel="noopener noreferrer">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_468_8)" />
                                <path d="M26.5808 12H14.4192C13.0462 12 12 13.0462 12 14.4192V26.5808C12 27.9538 13.0462 29 14.4192 29H26.5808C27.9538 29 29 27.9538 29 26.5808V14.4192C29 13.0462 27.9538 12 26.5808 12ZM20.5 25.6C23.3115 25.6 25.6 23.3769 25.6 20.6962C25.6 20.2385 25.5346 19.7154 25.4038 19.3231H26.8423V26.2538C26.8423 26.5808 26.5808 26.9077 26.1885 26.9077H14.8115C14.4846 26.9077 14.1577 26.6462 14.1577 26.2538V19.2577H15.6615C15.5308 19.7154 15.4654 20.1731 15.4654 20.6308C15.4 23.3769 17.6885 25.6 20.5 25.6ZM20.5 23.6385C18.6692 23.6385 17.2308 22.2 17.2308 20.4346C17.2308 18.6692 18.6692 17.2308 20.5 17.2308C22.3308 17.2308 23.7692 18.6692 23.7692 20.4346C23.7692 22.2654 22.3308 23.6385 20.5 23.6385ZM26.7769 16.6423C26.7769 17.0346 26.45 17.3615 26.0577 17.3615H24.2269C23.8346 17.3615 23.5077 17.0346 23.5077 16.6423V14.8769C23.5077 14.4846 23.8346 14.1577 24.2269 14.1577H26.0577C26.45 14.1577 26.7769 14.4846 26.7769 14.8769V16.6423Z" fill="white" />
                                <defs>
                                    <linearGradient id="paint0_linear_468_8" x1="8.5" y1="35.5" x2="35" y2="8" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#EEA054" />
                                        <stop offset="0.502762" stop-color="#D64763" />
                                        <stop offset="1" stop-color="#B62A99" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </a>
                        <a href={t("carloans.publicoffer.link2")} target="_blank" rel="noopener noreferrer">

                            <div className='w-10 h-10 p-2  bg-link rounded-full'>
                                <img src='https://mbank.kg/media/logo/MBANK.svg' className='w-full h-full' alt='Mbank Logo' />
                            </div>
                        </a>
                    </div>
                </div>
                <button type="submit" className="disabled:opacity-35 p-2 capitalize rounded-md hover:opacity-65 transition-opacity bg-yellow text-black font-medium w-full md:w-1/3 mx-auto mt-5">{mutation.isPending ? 'Загрузка...' : t('submit')}</button>
                {mutation.isError && <span className="text-red text-center">Ошибка отправки формы!</span>}
                {show && <Snackbar />}
            </form>
        </div>
    );
}

export default SubmitForm;
