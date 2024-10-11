import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReferenceInfo from './ReferenceInfo';
import { useStore } from '../../store';
import { getNoDeposit, getPandaBandaInvest } from '../../api';
import { useQuery } from '@tanstack/react-query';

const DetailForm = ({ setShowSubmit }) => {
    const { t } = useTranslation()

    // массивы для селектов
    const contribution = t('banda_panda.contribution.choice', { returnObjects: true });
    const periodChoice = t('banda_panda.period_choice.choice', { returnObjects: true });

    const [checkDocs, setCheckDocs] = useState(false)

    // состояния disabled для инпутов
    const [contributionChoice, setContributionChoice] = useState(false)

    // максимальный и минимальный срок финансирования
    const [minPeriod, setMinPeriod] = useState(1)
    const [maxPeriod, setMaxPeriod] = useState(36)
    const [firstPrice, setFirstPrice] = useState(5000)
    const [document, setDocument] = useState(0)
    const [payload, setPayload] = useState('getNoDeposit')

    const updateForm = useStore(state => state.pushDetailForm)



    const [r, setR] = useState(0)
    const { register, handleSubmit, setValue, getValues, formState: { errors }, watch, setError, clearErrors } = useForm();
    // наблюдатели за изменениями селектов
    const watchPeriodChoice = watch("period_choice")

    // стоимость вложения
    // const [investment] = useState(550000)
    // Запрос на взнос по сути сумма кредитования
    const { data: investment, isError: investmentError, isLoading: investmentLoading } = useQuery({ queryKey: ['investment'], queryFn: getPandaBandaInvest })

    const { data: percent, isError: percentError, isLoading: percentLoading, refetch } = useQuery({
        queryKey: ['percent', payload],
        queryFn: getNoDeposit,
        enabled: false,  // Отключаем автоматический запрос
    });

    useEffect(() => {

        if (watchPeriodChoice === 'Под залог недвижимости' || watchPeriodChoice === 'Кыймылсыз мүлк менен камсыздоо') {
            setPayload('getRealEstate')
            setMinPeriod(2)
            setMaxPeriod(60)
            setDocument(3)
        } else if (watchPeriodChoice === 'Под поручительство или под залог авто' || watchPeriodChoice === 'Кепилдик аркылуу же автоунаа менен камсыздоо') {
            setPayload('getAutoGuarantor')
            setMinPeriod(1)
            setMaxPeriod(36)
            setDocument(2)
        } else if (watchPeriodChoice === 'Без залога' || watchPeriodChoice === 'Күрөөсүз') {
            setPayload('getNoDeposit')
            setMinPeriod(1)
            setMaxPeriod(36)
            setDocument(1)
        }
        refetch();
    }, [watchPeriodChoice, payload]);


    useEffect(() => {
        if (percent) {
            const r = percent; // Подставляем процент из запроса
            calculateValues(r); // Пересчитываем значения при изменении `percent`
        }
    }, [percent]);

    const calculateValues = (r) => {
        const n = getValues('period');
        const pow = Math.pow((1 + r), n).toFixed(9);
        const S = getValues('contribution') === 'Есть первоначальный платеж' || getValues('contribution') === 'Алгачкы төлөм бар' ? investment - getValues('firstPrice') : investment;
        const P = ((S * r * pow) / (pow - 1)).toFixed(2);
        const totalSum = P * n;
        setR(r)
        setValue('monthlyPayment', `${P} сом`)
        setValue('down', `${(totalSum - S).toFixed(2)} сом`);
    };

    const changeValues = (name, val) => {

        if (name === 'period' && val !== getValues('period')) setValue('period', val)
        if (name === 'contribution' && val !== getValues('contribution')) setValue('contribution', val)
            console.log(name,'name', val, 'val');
            

        const n = getValues('period')
        const pow = Math.pow((1 + r), n).toFixed(9)
        const S = getValues('contribution') === 'Есть первоначальный платеж' || getValues('contribution') === 'Алгачкы төлөм бар' ? investment - (getValues('firstPrice')? getValues('firstPrice'): firstPrice) : investment
        const P = ((S * r * pow) / (pow - 1)).toFixed(2)
        const totalSum = P * n

        

        switch (name) {
            case 'contribution':
                if (val === 'Есть первоначальный платеж' || val === 'Алгачкы төлөм бар') {
                    setContributionChoice(true);
                    setValue('firstPrice', firstPrice)
                    setValue('monthlyPayment', `${P} сом`)
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`)
                } else {
                    setContributionChoice(false);
                    setValue('firstPrice', null)
                }
                break;
            case 'firstPrice':
                if (val < 5000 || val > investment) {
                    setError('firstPrice', {
                        type: 'manual',
                        message: `Первоночальный взнос должен быть не менее 5000сом и не более ${investment} сом`,
                    });
                } else {
                    clearErrors('firstPrice');
                    setValue('monthlyPayment', `${P} сом`)
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`)
                    setValue('firstPrice', val)
                }
                break;
            case 'period':
                if (val < minPeriod || val > maxPeriod) {
                    setError('period', {
                        type: 'manual',
                        message: `Срок финансирования должна быть от ${minPeriod}-х до ${maxPeriod}-ти месяцев`,
                    });
                } else {
                    clearErrors('period');
                    setValue('period', val)
                    setValue('down', `${(totalSum - S).toFixed(2)} сом`)
                    setValue('monthlyPayment', `${P} сом`)
                }
                break;
            default:
                setValue('monthlyPayment', 0)
        }
    };

    const onSubmit = (data) => {
        console.log(data);

        updateForm(data);
        setShowSubmit(true)
    }


    return (
        <div className="bg-gray rounded-3xl flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>

                <div className='w-full relative flex flex-col mb-5 sm:flex-row sm:items-center lg:w-1/2'>
                    <label className="text-xl font-medium text-green mb-5 sm:mb-0 sm:w-1/2" htmlFor="investment">{t("banda_panda.investment")} </label>
                    <div className='w-full sm:w-1/2 flex'>
                    <input
                        type='nunmber'
                        readOnly
                        disabled
                        defaultValue={investment}
                        id='investment'
                        name='investment'
                        {...register("investment")}
                        className="w-2/3 sm:w-10/12 text-2xl font-semibold text-link  bg-gray rounded-lg text-center sm:text-end" />
                        <span className='w-1/3 sm:w-2/12 text-2xl font-semibold text-link text-center'> сом</span>
                    </div>
                </div>


                <div className='relative flex justify-between flex-col lg:flex-row '>
                    <div className='w-full lg:w-1/2 lg:mr-5'>
                        <div className='relative w-full flex justify-between items-center mb-8'>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="contribution">{t("banda_panda.contribution.title")} </label>
                            <select
                                name="contribution"
                                id="contribution"
                                className="p-5 rounded-md w-full bg-white text-black text-xl"
                                {...register("contribution", { required: true })}
                                onChange={(e) => changeValues(e.target.name, e.target.value)}
                            >
                                {contribution.map((choice, idx) => <option value={choice} key={idx}>{choice}</option>)}

                            </select>
                            {errors.contribution && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите один из предложенных вариантов</span>}
                        </div>

                        <div className='relative w-full flex justify-between items-center mb-8 '>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="firstPrice">{t("carloans.payment")}</label>
                            <input
                                disabled={!contributionChoice}
                                type="number"
                                placeholder={t("carloans.payment")}
                                name="firstPrice"
                                id="firstPrice"
                                className="p-5 rounded-md w-full text-xl"
                                {...register("firstPrice", { required: contributionChoice })}
                                onBlur={(e) => changeValues(e.target.name, e.target.value)}
                                onKeyDown={(e) => e.code === 'Enter' && changeValues(e.target.name, e.target.value)}
                            />
                            {contributionChoice || <div className='w-full h-full bg-yellow disabled-bg opacity-40 absolute rounded-md'></div>}
                            {errors.firstPrice && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">{errors.firstPrice.message || `Первоночальный взнос не должен быть меньше 5000 сом`}</span>}
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2'>
                        <div className='relative w-full flex justify-between items-center mb-8'>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="period_choice">{t("banda_panda.period_choice.title")} </label>
                            <select
                                name="period_choice"
                                id="period_choice"
                                className="p-5 rounded-md w-full bg-white text-black text-xl"
                                {...register("period_choice", { required: true })}
                            >
                                {periodChoice.map((choice, idx) => <option value={choice} key={idx}>{choice}</option>)}

                            </select>
                            {errors.period_choice && <span className="text-red text-xs bottom-full absolute right-1 bg-opacity-80 translate-y-1/2 border-2 border-red bg-white p-1 rounded-md">Выберите один из предложенных вариантов</span>}
                        </div>
                        <div className='relative w-full flex justify-between items-center mb-8 '>
                            <label className="text-lg font-medium text-green absolute bottom-full" htmlFor="period">{t("carloans.period")}</label>
                            <div className='flex flex-col w-full'>
                                <div className='w-full relative'>
                                    <input
                                        type="number"
                                        placeholder={t("carloans.period")}
                                        name="period"
                                        defaultValue={24}
                                        id="period"
                                        className="p-5 w-full text-xl rounded-md disabled:opacity-40"
                                        {...register("period", { required: true, min: minPeriod, max: maxPeriod })}
                                        onBlur={(e) => changeValues(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className='flex items-center text-link mt-5 justify-center'>
                                    <p className=''>{minPeriod}</p>
                                    <input
                                        type='range'
                                        name='period'
                                        defaultValue={24}
                                        min={minPeriod}
                                        max={maxPeriod}
                                        {...register("period")}
                                        onChange={(e) => changeValues(e.target.name, e.target.value)}
                                        className="relative w-4/5 mx-auto h-1 disabled:opacity-40 bg-link cursor-pointer range-input accent-link "
                                    />
                                    <p className=''>{maxPeriod}</p>
                                </div>

                            </div>

                            {errors.period && <span className="text-red absolute left-0 bottom-full">{errors.period.message || 'Срок финансирования должна быть от 3-х до 60-ти месяцев'}</span>}
                        </div>

                    </div>
                </div>

                <div className='w-full flex flex-col lg:flex-row justify-between items-center pb-5 border-b-2 border-yellow'>
                    

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

                    <div className='relative w-full lg:w-1/2 flex flex-col md:flex-row items-center lg:mr-5 mb-5 lg:mb-0'>
                        <label className="text-2xl font-medium text-green text-center md:w-1/2" htmlFor="monthlyPayment">{t("carloans.monthly")} </label>
                        <input
                            type='text'
                            readOnly
                            disabled
                            defaultValue={0}
                            id='monthlyPayment'
                            name='monthlyPayment'
                            {...register("monthlyPayment")}
                            className="text-2xl sm:text-3xl lg:text-4xl  text-link font-semibold bg-gray rounded-lg md:w-1/2 text-center" />
                        <p className='absolute top-full lg:-top-5 text-center text-sm text-link opacity-70 w-full'>* {t("carloans.examination")}</p>
                    </div>
                </div>

                <ReferenceInfo document={document}/>
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
                        {t("banda_panda.checkbox")}
                    </label>
                </div>
                <button type='submit' disabled={!checkDocs} className='mb-5 disabled:opacity-35 p-2 rounded-md hover:opacity-65 transition-opacity bg-yellow text-black font-medium w-full md:w-1/3 mx-auto mt-5'>{t("banda_panda.confirm")}</button>

            </form>
        </div>
    )
}

export default DetailForm;