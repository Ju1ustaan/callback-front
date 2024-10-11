import React from 'react';
import { useForm } from 'react-hook-form';
import { useMask } from '@react-input/mask';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postFeedback } from '../api';
import { useStore } from '../store';
import Snackbar from '../components/Snackbar';

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
      className="p-5 w-full text-sm md:text-xl rounded-md"
      onChange={onChange}
      onBlur={onBlur}
    />
  );
});

const FeedbackForm = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const showSnackbar = useStore((state) => state.showSnackbar);
  const show = useStore(state => state.snackbar)
  const regions = t('form.region', { returnObjects: true });
  const topics = t('form.topic.list', { returnObjects: true });

  const mutation = useMutation({
    mutationFn: postFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      showSnackbar(true);  
      reset();  
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-2">
      <div className="bg-gray py-8 px-7 md:px-20 rounded-3xl shadow-sm">
        <h1 className="text-3xl text-black font-bold mb-14 xl:mb-6">{t("title")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className='flex my-5 items-center flex-col lg:flex-row lg:gap-x-32'>
            <div className='relative w-full lg:w-1/2 flex justify-between items-center mb-5 lg:mb-0'>
              <label className="text-sm md:text-lg font-medium absolute bottom-full text-green" htmlFor="name">{t("form.name.title")}</label>
              <input
                type="text"
                placeholder={t("form.name.placeholder")}
                name="name"
                id="name"
                className="p-5 rounded-md w-full mb-5 md:mb-0 mr-0 text-sm md:text-xl lg:mr-5"
                {...register("name", { required: true, maxLength: 250 })}
              />
              {errors.name && <span className="text-red absolute text-sm md:text-lg left-0 bottom-full">Поле имя обязательна к заполнению и оно не должно превышать 250 символов</span>}
            </div>

            <div className='relative w-full lg:w-1/2 flex justify-between items-center'>
              <label className="text-sm md:text-lg font-medium absolute bottom-full text-green" htmlFor="phone">{t("form.phone.title")}</label>
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
              {errors.phone && <span className="text-red absolute text-sm md:text-lg left-0 bottom-full right-0">Введите корректный номер телефона</span>}
            </div>
          </div>
          <div className='flex items-center flex-col lg:flex-row lg:gap-x-32'>
            <div className='relative w-full lg:w-1/2 flex justify-between mb-5 lg:mb-0'>
              <label className="text-sm md:text-lg font-medium absolute bottom-full text-green" htmlFor="region">Регион</label>
              <select
                name="region"
                id="region"
                className="p-5  rounded-md w-full bg-white text-black mb-5 md:mb-0 text-sm md:text-xl lg:mr-5 mr-0"
                {...register("region", { required: true })}
              >
                {regions.map((region, idx) => (
                  <option key={idx} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className="text-red absolute left-0 bottom-full text-sm md:text-lg">Выберите регион!</span>}
            </div>

            <div className='relative w-full lg:w-1/2 flex justify-between'>
              <label className="text-sm md:text-lg font-medium absolute bottom-full text-green" htmlFor="topic">{t("form.topic.title")}</label>
              <select
                name="topic"
                id="topic"
                className="p-5 text-sm md:text-xl rounded-md w-full bg-white text-black"
                {...register("topic", { required: true })}
              >
                {topics.map((topic, idx) => (
                  <option key={idx} value={topic}>{topic}</option>
                ))}
              </select>
              {errors.topic && <span className="text-red absolute left-0 bottom-full text-sm md:text-lg">Выберите тему!</span>}
            </div>
          </div>
          <button type="submit" className="p-2 capitalize rounded-md hover:opacity-65 transition-opacity bg-yellow text-black font-medium w-full md:w-1/3 mx-auto mt-5">
            {mutation.isPending? 'Загрузка...': t('submit')}
          </button>
          {mutation.isError && <span className="text-red text-center">Ошибка отправки формы!</span>}
          {show && <Snackbar />} 
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
