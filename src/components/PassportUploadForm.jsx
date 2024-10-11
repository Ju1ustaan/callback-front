import React, { useState, useRef } from 'react';
import defaultImg from '../assets/default.webp'
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

const PassportUploadForm = React.forwardRef(({ label }, ref) => {
  const photoFile = useStore((state) => state.setPhotoFile1)
  const photoFile2 = useStore((state) => state.setPhotoFile2)
  const photoFile3 = useStore((state) => state.setPhotoFile3)
  // const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState(null); // Добавляем состояние для URL фото
  const videoRef = useRef(null);
  const [currentFacingMode, setCurrentFacingMode] = useState('user');
  const canvasRef = useRef(null);
  const { t } = useTranslation()

  // Запрос разрешения на камеру
  const handleOpenCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
    }
  };

  const handleSwitchCamera = async () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'; // Переключение режима
    setCurrentFacingMode(newFacingMode);
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Останавливаем текущий видеопоток
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Ошибка переключения камеры:', error);
    }
  };

  // Сделать снимок с камеры
  const handleTakePhoto = () => {
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
  
    // Устанавливаем размер canvas в зависимости от размеров видео
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Остановить видео поток
    setShowCamera(false);

    canvasRef.current.toBlob((blob) => {
      if (blob && blob.size <= 2 * 1920 * 1024) {
        const url = URL.createObjectURL(blob);
        const file = new File([blob], 'file.png', { type: 'image/png' });
        setSelfieUrl(url);
        
        if (label === 'photo1') {
          photoFile(file)
        } else if (label === 'photo2') {
          photoFile2(file)
        } else {
          photoFile3(file)
        }

      } else {
        alert('Размер фото превышает 2 МБ. Попробуйте снова.');
      }
    }, 'image/png');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-5">
        <div className='flex items-center '>
          <label htmlFor="selfiePhoto" className='text-lg font-medium text-green mr-5'>{t(`carloans.${label}`)}</label>
          <button type="button" onClick={handleOpenCamera} className='w-8 fill-yellow cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
            </svg>
          </button>
        </div>
        <div
          className='min-h-14 h-28 w-28  foto -scale-x-100'
          style={{
            backgroundImage: `url(${selfieUrl || defaultImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}></div>
      </div>


      {showCamera && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full h-full z-10">
          <div className='relative w-full h-full'>
            <video ref={videoRef} autoPlay playsInline className={`${currentFacingMode === 'user' ? '-scale-x-100' : ''} z-10`} ></video>
            <canvas ref={canvasRef} style={{ display: 'none' }} width="100%" height="100%"></canvas>
            <div className='absolute w-full h-full bg-gray bg-opacity-35 top-0 flex justify-center items-center border-5 border-link border-solid'>
              <div className='w-5/6 h-56 md:h-72 md:w-1/2 lg:h-96 lg:w-1/4 bg-gray opacity-35 rounded-xl'></div>
              <div className='w-5 h-5 fill-yellow absolute top-3 right-3 cursor-pointer' onClick={() => setShowCamera(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                </svg>
              </div>
            <button onClick={handleSwitchCamera} type="button" className='z-20 camera-btn absolute bottom-4 left-10 border-solid border-4 border-yellow rounded-full w-10 p-1 fill-yellow cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"/>
            </svg>
            </button>
            <button type="button" className='z-20 camera-btn absolute bottom-4 left-1/2 -translate-x-1/2  border-solid border-4 border-red rounded-full w-10 p-1 fill-red cursor-pointer' onClick={handleTakePhoto}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
              </svg>
            </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
});

export default PassportUploadForm;
