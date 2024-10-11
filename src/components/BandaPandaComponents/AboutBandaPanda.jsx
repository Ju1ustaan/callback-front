import React, { useEffect, useState } from 'react';
import LigthPoint from '../../assets/bandaPanda/dark-point.jpg';
import EtnoPoint from '../../assets/bandaPanda/etno-point.jpg';
import BandaPandaIcon from '../../assets/bandaPanda/BandaPandaIcon';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AboutBandaPanda = () => {
  const [bgColor, setBgColor] = useState('bg-black');
  const [fill, setFill] = useState('#fff');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bgColor === 'bg-black') {
        setBgColor('bg-gray');
        setFill('#000');
      } else {
        setBgColor('bg-black');
        setFill('#fff');
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [bgColor]);

  const settings = {
    dots: true,          
    infinite: true,      
    speed: 500,          
    slidesToShow: 1,     
    slidesToScroll: 1,   
    autoplay: true,      
    autoplaySpeed: 7000, 
  };

  return (
    <div className="py-10 bg-gray">
         <div className="sm:flex hidden">
                <div className={`relative w-1/3 aspect-square overflow-hidden`}>
                    <img src={EtnoPoint} alt={'etno style coffee point'} className="w-full h-full object-center " />
                </div>
                <div className={`sm:w-1/3 aspect-square ${bgColor} transition-colors duration-1000`}>
                    <BandaPandaIcon fill={fill} className="transition-colors duration-1000" />
                </div>
                <div className={`relative w-1/3 aspect-square overflow-hidden`}>
                    <img src={LigthPoint} alt={'light coffee point'} className="w-full h-full object-center " />
                </div>

            </div>
      <div className='sm:hidden'>
      <Slider {...settings}>
        {/* Первый слайд */}
        <div className="flex justify-center">
          <div className={`relative w-full aspect-square overflow-hidden`}>
            <img
              src={EtnoPoint}
              alt={'etno style coffee point'}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Второй слайд с BandaPandaIcon */}
        <div className={`flex justify-center items-center ${bgColor} transition-colors duration-1000`}>
          <BandaPandaIcon fill={fill} className="transition-colors duration-1000" />
        </div>

        {/* Третий слайд */}
        <div className="flex justify-center">
          <div className={`relative w-full aspect-square overflow-hidden`}>
            <img
              src={LigthPoint}
              alt={'light coffee point'}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Slider>
      </div>
    </div>
  );
};

export default AboutBandaPanda;
