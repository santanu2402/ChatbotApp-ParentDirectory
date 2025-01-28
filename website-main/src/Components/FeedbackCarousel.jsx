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
import * as color from '../Assets/Colors/color'
const mockData = [
    {
        name: "John Doe",
        feedback: "This app is amazing! I highly recommend it to everyone.",
        publishedStatus: true,
        checkedByAdmin: "Admin1",
        orderNo: 12345,
        anonymous: false,
        createdAt: new Date(), // Current date
        user: "user123" // Assuming user IDs are alphanumeric
    },
    {
        name: "Jane Smith",
        feedback: "I found the recommendations very helpful, especially for trying new places.",
        publishedStatus: true,
        checkedByAdmin: null,
        orderNo: 54321,
        anonymous: true,
        createdAt: new Date(), // Current date
        user: "user456" // Assuming user IDs are alphanumeric
    },
    {
        name: "Alice Johnson",
        feedback: "The rating system makes it easy to find the best options quickly.",
        publishedStatus: true,
        checkedByAdmin: "Admin2",
        orderNo: 78901,
        anonymous: true,
        createdAt: new Date(), // Current date
        user: "user789" // Assuming user IDs are alphanumeric
    },
    {
        name: "Bob Anderson",
        feedback: "I wish there were more options for vegetarian restaurants.",
        publishedStatus: true,
        checkedByAdmin: "Admin1",
        orderNo: 13579,
        anonymous: false,
        createdAt: new Date(), // Current date
        user: "user101" // Assuming user IDs are alphanumeric
    },
    {
        name: "Emma Thompson",
        feedback: "The app occasionally crashes when searching for recommendations.",
        publishedStatus: true,
        checkedByAdmin: "Admin2",
        orderNo: 24680,
        anonymous: true,
        createdAt: new Date(), // Current date
        user: "user202" // Assuming user IDs are alphanumeric
    },
    {
        name: "Michael Brown",
        feedback: "The review section helps me make informed decisions before trying new places.",
        publishedStatus: true,
        checkedByAdmin: "Admin2",
        orderNo: 112233,
        anonymous: false,
        createdAt: new Date(), // Current date
        user: "user303" // Assuming user IDs are alphanumeric
    }
    // Add more entries as needed
];



export default function FeedbackCarousel() {
    return (
        <Swiper
            modules={[Autoplay, Parallax, EffectFade, Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
            loop={true}
            parallax={true}
            effect="slide"
            style={{width:"900px"}}
        >
            {mockData.map((slide) => (
                <SwiperSlide key={slide.user}>
                    {slide.publishedStatus && slide.anonymous ? (
                        <div style={{borderRadius:"15px",backgroundColor: color.secondaryDarkYellow,height:'150px',display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{  borderWidth: '1px', borderColor: color.lightText2 }}>
                                <img style={{borderRadius: '50%'}} width="100" height="100" src="https://friconix.com/png/fi-cnluxx-anonymous-user-circle.png" alt="" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <div className="roboto-bold darkText1" style={{ textAlign: 'left' }}>Anonymous</div>
                                <div className="roboto-medium darkText2" style={{ textAlign: 'justify' }}>{'"'}{slide.feedback}{'"'}</div>
                            </div>
                        </div>
                    ) : slide.publishedStatus ? (
                        <div style={{ borderRadius:"15px",backgroundColor: color.secondaryDarkYellow, height:'150px',display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50', borderWidth: '1px', borderColor: color.lightText2 }}>
                                <img style={{borderRadius: '50%'}} width="100" height="100" src="https://randomuser.me/api/portraits/men/86.jpg" alt="" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <div className="roboto-bold darkText1" style={{ textAlign: 'left' }}>{slide.name}</div>
                                <div className="roboto-medium darkText2" style={{ textAlign: 'justify' }}>{'"'}{slide.feedback}{'"'}</div>
                            </div>
                        </div>
                    ) : null}
                </SwiperSlide>
            ))}

        </Swiper>
    );
}