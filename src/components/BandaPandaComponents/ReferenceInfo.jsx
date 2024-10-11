import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

const ReferenceInfo = ({ document }) => {
  const { t, i18n } = useTranslation()
  const [documents, setDocuments] = useState([])


  console.log(i18n.language);
  
  useEffect(() => {
    if (document === 1) {
      setDocuments(t('banda_panda.docs.document1', { returnObjects: true, lng: i18n.language }));
    } else if (document === 2) {
      setDocuments(t('banda_panda.docs.document2', { returnObjects: true, lng: i18n.language }));
    } else {
      setDocuments(t('banda_panda.docs.document3', { returnObjects: true, lng: i18n.language }));
    }
  }, [document, i18n.language])

  return (
    <div>
      <p className='text-xl text-black font-bold mb-14 xl:mb-6'>{t("banda_panda.docs.title")}</p>
      <ul className='text-left'>
        {
          documents.map((document, idx) => <li className='lg:mx-10 bg-white bg-opacity-50 text-link mb-2 p-2 rounded-lg' key={idx}>&#10004; {document}</li>)
        }

      </ul>
    </div>
  )
}

export default ReferenceInfo