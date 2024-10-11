import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yearsArray } from '../../helper';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ReferenceInfo from './ReferenceInfo';
import { useStore } from '../../store';
import { getPercent, getStartPaymentPercent } from '../../api';
import { useQuery } from '@tanstack/react-query';

const DetailForm = ({ setShowSubmit }) => {
    const { t } = useTranslation()
    const [checkDocs, setCheckDocs] = useState(false)
    const updateForm = useStore(state => state.pushDetailForm)

    const currentYear = moment().year();

    const [initialPayment, setInitialPayment] = useState(0) // Первоначальный взнос который высчитывается от цены автомобиля 30%, юзер может задать выше
    const [payload, setPayload] = useState('/start-payment-chinese')

    const [r, setR] = useState(0)
    const [initialPaymentPercent, setInitialPaymentPercent] = useState(0)
    const { register, handleSubmit, setValue, getValues, formState: { errors }, watch, setError, clearErrors } = useForm();
    
    const { data: percent, isError: percentError, isLoading: percentLoading } = useQuery({ queryKey: ['percent'], queryFn: getPercent });

    const watchRegion = watch("country");

    const [years, setYears] = useState([]);
    const countries = [
        "Китай (КНР)",
        "Страны СНГ",
        "Другая страна"
    ];

    // Используем запрос getStartPaymentPercent для получения процента в зависимости от страны
    const { data: startPercent, isError: startPercentError, isLoading: startPercentLoading, refetch: startPercentRefetch } = useQuery({
        
        queryKey: ['initialPaymentPercent', payload],
        queryFn: getStartPaymentPercent,
        enabled: false,
    });

    useEffect(() => {
        startPercentRefetch()
        setR(percent);
        setInitialPaymentPercent(startPercent); // обновляем первоначальный взнос процент
    }, [percent, startPercent]);

    useEffect(() => {
        if (watchRegion === 'Другая страна') {
            setYears(yearsArray(currentYear, 20));
            setPayload('/start-payment');
        } else {
            setYears(yearsArray(currentYear, 5));
            setPayload('/start-payment-chinese');
        }
        setValue('releaseDate', years[0]);
    }, [watchRegion, currentYear]);


    
    const calculateValues = (num) => {

    
        if (getValues('price')) {
            const n = getValues('period');
            const pow = Math.pow((1 + r), n).toFixed(9);
            const S = getValues('price') - (getValues('firstPrice') ? getValues('firstPrice') : getValues('price') * num / 100);
            const P = ((S * r * pow) / (pow - 1)).toFixed(2);
            const totalSum = P * n;
            setValue('monthly', `${P} сом`);
            setValue('down', `${(totalSum - S).toFixed(2)} сом`);
        } else {
            setValue('monthly', `${0} сом`);
            setValue('down', `${0} сом`);
        }
        setInitialPaymentPercent(num);
    };

    const changeValues = (name, val) => {
        if (name === 'period' && val !== getValues('period')) setValue('period', val);
        const n = getValues('period');
        const pow = Math.pow((1 + r), n).toFixed(9);
        const S = getValues('price') - (getValues('firstPrice') ? getValues('firstPrice') : getValues('price') * initialPaymentPercent / 100);
        const P = ((S * r * pow) / (pow - 1)).toFixed(2);
        const totalSum = P * n;

        switch (name) {
            case 'country':
                startPercentRefetch().then(() => {
                    calculateValues(startPercent)
                })
                break;
            case 'price':
                if (val < 250000 || val > 5000000) {
                    setError('price', {
                        type: 'manual',
                        message: `Стоимость автомобиля должна быть от 250000 до 5000000 сом`,
                    });
                } else {
                    clearErrors('price');
                    setValue('firstPrice', val * initialPaymentPercent / 100);
                    setValue('monthly', `${P} сом`);
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`);
                    setInitialPayment(val * initialPaymentPercent / 100);
                }
                break;
            case 'firstPrice':
                if (val < initialPayment) {
                    setError('firstPrice', {
                        type: 'manual',
                        message: `Первоночальный взнос не должен быть меньше ${initialPayment}сом`,
                    });
                } else {
                    clearErrors('firstPrice');
                    setValue('monthly', `${P} сом`);
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`);
                    setValue('firstPrice', val);
                }
                break;
            case 'period':
                if (val < 3 || val > 60) {
                    setError('period', {
                        type: 'manual',
                        message: `Срок финансирования должна быть от 3-х до 60-ти месяцев`,
                    });
                } else {
                    clearErrors('period');
                    setValue('period', val);
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`);
                    setValue('monthly', `${P} сом`);
                }
                break;
            default:
                setValue('monthly', 0);
        }
    };

    const onSubmit = (data) => {
        updateForm(data);
        setShowSubmit(true);
    }



    return (
        <div className="bg-gray rounded-3xl flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-5'>
                <div className='relative flex justify-between items-center gap-5 flex-col lg:flex-row mb-5'>
                    <div className='relative w-full lg:w-1/4 flex justify-between items-center mb-5 lg:mb-0'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="country">{t("carloans.countries")} </label>
                        <select
                            name="country"
                            id="country"
                            className="p-5 rounded-md w-full bg-white text-black text-xl"
                            {...register("country", { required: true })}
                        >
                            {countries.map((country, idx) => <option value={country} key={idx}>{country}</option>)}

                        </select>
                        {errors.country && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите регион!</span>}
                    </div>
                    <div className='relative w-full lg:w-1/4 flex justify-between items-center mb-5 lg:mb-0'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="name">{t("carloans.car_brand")}</label>
                        <input
                            type="text"
                            placeholder={t("carloans.car_brand")}
                            name="model"
                            id="model"
                            className="p-5 text-xl w-full rounded-md"
                            {...register("model", { required: true, maxLength: 30 })}
                        />
                        {errors.model && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Укажите марку автомобиля</span>}
                    </div>
                    <div className='relative w-full lg:w-1/4 flex justify-between items-center mb-5 lg:mb-0'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="releaseDate">{t("carloans.year_of_issue")}</label>
                        <select
                            name="releaseDate"
                            id="releaseDate"
                            className="p-5 w-full text-xl rounded-md bg-white text-black"
                            {...register("releaseDate", { required: true })}
                        >
                            {years.map((year, idx) => <option value={year} key={idx}>{year}</option>)}
                        </select>
                        {errors.releaseDate && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите год выпуска!</span>}
                    </div>
                    <div className='relative w-full lg:w-1/4 flex justify-between items-center'>
                        <label className="text-lg font-medium w-1/2 text-green absolute bottom-full" htmlFor="currency">{t("carloans.currency")}</label>
                        <select
                            name="currency"
                            id="currency"
                            className="p-5 w-full rounded-md bg-white text-black"
                            {...register("currency", { required: true })}
                        >
                            <option value={"KGS"} defaultValue={"KGS"}>{"KGS"}</option>

                        </select>
                        {errors.year && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите валюту!</span>}
                    </div>
                </div>
                <div className='relative flex justify-between items-center gap-5 flex-col lg:flex-row mb-5'>
                    <div className='relative w-full lg:w-1/2 flex justify-between items-center mb-5 lg:mb-0'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="price">{t("carloans.cost")}</label>
                        <input
                            type="number"
                            placeholder={t("carloans.cost")}
                            name="price"
                            id="price"
                            className="p-5 rounded-md w-full text-xl"
                            {...register("price", { required: true, min: 250000, max: 5000000 })}
                            onKeyDown={(e) => e.code === 'Enter' && changeValues(e.target.name, e.target.value)}
                            onBlur={(e) => changeValues(e.target.name, e.target.value)}
                        />
                        {errors.price && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">{errors.price.message || 'Стоимость автомобиля должна быть от 250000 до 5000000 сом'}</span>}
                    </div>
                    <div className='relative w-full lg:w-1/2 flex justify-between items-center'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="firstPrice">{t("carloans.payment")}</label>
                        <input
                            type="number"
                            placeholder={t("carloans.payment")}
                            name="firstPrice"
                            id="firstPrice"
                            className="p-5 rounded-md w-full text-xl"
                            {...register("firstPrice", { required: true, min: initialPayment })}
                            onKeyDown={(e) => e.code === 'Enter' && changeValues(e.target.name, e.target.value)}
                            onBlur={(e) => changeValues(e.target.name, e.target.value)}
                        />
                        {errors.firstPrice && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">{errors.firstPrice.message || `Первоночальный взнос не должен быть меньше ${initialPayment}сом`}</span>}
                    </div>
                </div>
                <div className='relative w-full flex justify-between items-center flex-col lg:flex-row gap-5'>
                    <div className='relative w-full lg:w-1/2 flex justify-between items-center mb-5 lg:mb-0'>
                        <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="period">{t("carloans.period")}</label>
                        <div className='flex flex-col w-full'>
                            <input
                                type="number"
                                placeholder={t("carloans.period")}
                                name="period"
                                defaultValue={24}
                                id="period"
                                className="p-5 w-full text-xl rounded-md"
                                {...register("period", { required: true, min: 3, max: 60 })}
                                onBlur={(e) => changeValues(e.target.name, e.target.value)}
                            />
                            <div className='flex items-center text-link mt-5 justify-center'>
                                <p>3</p>
                                <input
                                    type='range'
                                    name='period'
                                    defaultValue={24}
                                    min={3}
                                    max={60}
                                    {...register("period")}
                                    onChange={(e) => changeValues(e.target.name, e.target.value)}
                                    className="relative w-4/5 mx-auto h-1 bg-link cursor-pointer range-input accent-link "
                                />
                                <p>60</p>

                            </div>
                        </div>
                        {errors.period && <span className="text-red absolute left-0 bottom-full">{errors.period.message || 'Срок финансирования должна быть от 3-х до 60-ти месяцев'}</span>}
                    </div>
                    <div className='relative w-full lg:w-1/2 flex md:flex-row justify-between items-center text-center mb-5 lg:mb-0'>
                        <label className="text-sm w-1/2 md:text-lg text-center md:w-1/2 font-medium text-green" htmlFor="downPayment">{t("carloans.sumPrice")} </label>
                        <input
                            type='text'
                            readOnly
                            disabled
                            defaultValue={0}
                            id='down'
                            name='down'
                            {...register("down")}
                            className="text-lg md:text-2xl text-center w-1/2 text-link font-semibold bg-gray" />
                    </div>
                </div>
                <div className='relative w-full flex flex-col lg:flex-row justify-between items-center mb-5'>
                    <div className='relative w-full flex flex-col md:flex-row items-center mr-0 lg:mr-0 mb-5 lg:mb-0 border-b-2 border-yellow'>
                        <label className="text-2xl font-medium w-full md:w-1/2 text-green text-center" htmlFor="monthly">{t("carloans.monthly")} </label>
                        <input
                            type='text'
                            readOnly
                            disabled
                            defaultValue={0}
                            id='monthly'
                            name='monthly'
                            {...register("monthly")}
                            className="p-10 w-full md:w-1/2 text-4xl  text-link text-center font-semibold lg:mr-5 bg-gray rounded-lg" />
                    </div>
                    <p className='absolute top-9 md:top-0 text-center text-sm text-link opacity-70 w-full'>* {t("carloans.examination")}</p>
                </div>

                <ReferenceInfo />
                <div className='text-center flex items-center justify-center'>
                    <div className='relative'>
                        <input
                            value={checkDocs}
                            onClick={() => setCheckDocs(!checkDocs)}
                            type='checkbox'
                            id="docs"
                            name='docs'
                            className="custom-checkbox form-checkbox h-5 w-5 z-50 focus:ring-offset-0 border-solid border-2 border-green cursor-pointer appearance-none text-yellow rounded focus:ring-yellow focus:ring-2" />
                        <div className='w-4 bg-yellow custom-checkbox-mark absolute left-1/2 -translate-x-1/2 bottom-full translate-y-full fill-green'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                        </div>
                    </div>
                    <label htmlFor='docs' className='ml-2 text-lg font-medium text-green'>
                        {t("carloans.checkbox")}
                    </label>
                </div>
                <button type='submit' disabled={!checkDocs} className='mb-5 disabled:opacity-35 p-2 rounded-md hover:opacity-65 transition-opacity bg-yellow text-black font-medium w-full md:w-1/3 mx-auto mt-5'>{t("carloans.application")}</button>

            </form>
        </div>
    )
}

export default DetailForm;