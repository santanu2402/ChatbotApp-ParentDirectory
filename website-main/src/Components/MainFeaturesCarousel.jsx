import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, EffectFade, Scrollbar, A11y } from 'swiper/modules';
// Import Swiper styles
import 'swiper/swiper-bundle.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import feature1 from '../Assets/Images/feature1chatbot.png'
import feature2 from '../Assets/Images/feature2-moviedetails.png'
import feature3 from '../Assets/Images/feature3-recommendation.png'
import feature4 from '../Assets/Images/feature4list.png'
import feature5 from '../Assets/Images/feature5-sharevideocast.png'
import feature6 from '../Assets/Images/feature6-notification search.png'
export default function MainFeaturesCarousel() {
    return (
        <Swiper
            modules={[Autoplay, Parallax, EffectFade, Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
            loop={true}
            parallax={true}
            effect={"fade"}
        >
            <SwiperSlide><img width={960} height={540} src={feature1} /></SwiperSlide>
            <SwiperSlide><img width={960} height={540} src={feature2} /></SwiperSlide>
            <SwiperSlide><img width={960} height={540} src={feature3} /></SwiperSlide>
            <SwiperSlide><img width={960} height={540} src={feature4} /></SwiperSlide>
            <SwiperSlide><img width={960} height={540} src={feature5} /></SwiperSlide>
            <SwiperSlide><img width={960} height={540} src={feature6} /></SwiperSlide>
        </Swiper>
    )
}
