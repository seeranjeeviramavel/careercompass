import React, { useEffect } from "react";
import { JobImg } from "../assets";

const About = () => {

  return (
    <div className='container mx-auto flex flex-col gap-8 2xl:gap-14 py-6'>
      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center p-5'>
        <div className='w-full md:w-2/3 2xl:w-2/4'>
          <h1 className='text-3xl text-blue-600 font-bold mb-5'>About Us</h1>
          <p className='text-justify leading-7'>
            Welcome to Career Compass, your go-to platform for discovering career opportunities and connecting with top talent. Our mission is to streamline the job search and recruitment process by providing a user-friendly interface that benefits both job seekers and recruiters. With Career Compass, job seekers can easily browse through job listings, apply for positions that match their skills and interests, and receive tailored job recommendations. On the other hand, recruiters can effortlessly post job openings, manage applications, and find the perfect candidates to fill their roles.
          </p>
          <p className='text-justify leading-7 mt-5'>
            Our platform is designed with the latest technology to ensure that job seekers and recruiters have a smooth and efficient experience. We understand the challenges of the job market and are dedicated to making the process of finding and applying for jobs as straightforward as possible. By leveraging advanced algorithms and a user-centric approach, Career Compass aims to bridge the gap between talent and opportunity.
          </p>
        </div>
        <img src={JobImg} alt='About Career Compass' className='w-auto h-[300px]' />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
          At Career Compass, we are passionate about helping individuals achieve their career goals and assisting businesses in finding the right talent. Our platform features a comprehensive range of tools and resources designed to enhance the job search and recruitment experience. From personalized job alerts to easy application tracking, we provide everything needed to make the journey to a successful career or a new hire as smooth as possible.
        </p>
        <p className='mt-5'>
          We are committed to continuous improvement and innovation. Our team works tirelessly to refine our platform based on user feedback and industry trends. By staying ahead of the curve, we ensure that Career Compass remains the leading choice for job seekers and recruiters alike.
        </p>
        <p className='mt-5'>
          Thank you for choosing Career Compass. We look forward to supporting you in your career journey and helping you achieve your professional goals. For any questions or support, feel free to contact us at support@careercompass.com.
        </p>
      </div>
    </div>
  );
};

export default About;
