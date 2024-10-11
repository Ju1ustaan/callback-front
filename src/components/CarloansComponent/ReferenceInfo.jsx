import React from 'react'
import { useTranslation } from 'react-i18next';

const ReferenceInfo = () => {
    const { t } = useTranslation()
  const documents = t('carloans.docs.document', { returnObjects: true });
    
  return (
    <div>
        <p className='text-xl text-black font-bold mb-14 xl:mb-6'>{t("carloans.docs.title")}</p>
        <ul className='text-left'>
            {
                documents.map((document, idx) => <li className='lg:mx-10 bg-white bg-opacity-50 text-link mb-2 p-2 rounded-lg' key={idx}>&#10004; {document}</li>)
            }

        </ul>
    </div>
  )
}

export default ReferenceInfo