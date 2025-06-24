import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
  const videoRef = useRef(null);

  const images = [
    "/images/Image_fx (36).jpg",
    "/images/Image_fx (37).jpg",
    "/images/Image_fx (38).jpg",
    "/images/Image_fx (39).jpg"
  ];

  useEffect(() => {
    // Show unmute prompt for 5 seconds on load
    setShowUnmutePrompt(true);
    const timer = setTimeout(() => setShowUnmutePrompt(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle hash navigation to careers section
    if (window.location.hash === '#careers') {
      setTimeout(() => {
        const careersSection = document.getElementById('careers');
        if (careersSection) {
          careersSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    // Handle scroll highlighting for careers link
    const handleScroll = () => {
      const careersSection = document.getElementById('careers');
      if (careersSection) {
        const rect = careersSection.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        
        // Update careers links in navbar
        const careersLinks = document.querySelectorAll('button[onclick*="handleCareersClick"]');
        careersLinks.forEach(link => {
          if (isInView) {
            link.style.color = '#010101';
            link.style.fontWeight = '700';
          } else {
            link.style.color = '#4E4E4E';
            link.style.fontWeight = '400';
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.load();
      
      const handleCanPlay = () => {
        video.play().catch(() => console.log('Autoplay failed'));
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        if (video) {
          video.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (!videoRef.current.muted) {
        setShowUnmutePrompt(false);
      }
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {/* Video Section */}
      <section>
        <h1 className="text-[#010101] text-[48px] my-[32px] text-center font-[400] custom-font max-sm:text-[40px] max-sm:my-[28px] pt-[128px] max-md:pt-[96px]">
          About
        </h1>
        <div className="relative w-full mx-auto overflow-hidden">
          <video 
            ref={videoRef}
            src="/videos/NorthCafe.mp4" 
            autoPlay 
            muted 
            playsInline 
            loop 
            className="w-full h-auto cursor-pointer"
            onClick={toggleMute}
          >
            Your browser does not support the video tag.
          </video>
          {showUnmutePrompt && (
            <div 
              className="absolute bottom-[80px] left-[32px] text-white bg-black bg-opacity-60 px-4 py-2 rounded-md text-sm max-md:left-[16px] max-md:bottom-[64px] cursor-pointer"
              onClick={() => {
                toggleMute();
                setShowUnmutePrompt(false);
              }}
            >
              Tap to unmute
            </div>
          )}
          <button 
            onClick={toggleMute}
            className="absolute left-[32px] bottom-[32px] bg-none p-2 rounded-full max-lg:left-[16px] max-lg:bottom-[16px] max-md:w-[36px]"
          >
            <i 
              className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-red-600 text-[24px]`}
              style={{ color: '#dc2626' }}
            />
          </button>
        </div>
      </section>

      {/* Image Slideshow Section */}
      <section className="mx-[64px] pt-[32px] max-md:mx-[16px]">
        <h2 className="mt-[88px] mb-[64px] font-[400] text-[48px] leading-[56px] text-center satisfy text-[#010101] max-sm:leading-[44px] max-lg:mt-[44px] max-lg:mb-[52px] max-md:mt-[20px] max-md:mb-[32px] max-sm:text-[32px]">
          The Story Behind Every Meal.
        </h2>

        {/* Desktop Slideshow */}
        <div className="hidden lg:flex items-center justify-center gap-[24px] slider-gap-fix max-sm:gap-[16px] max-xl:mx-[48px] max-lg:mx-[24px] mx-[96px]">
          <button 
            onClick={goToPrev}
            className="w-[64px] h-[64px] max-xl:w-[48px] max-xl:h-[48px] max-lg:w-[36px] max-lg:h-[36px] max-md:w-[24px] max-md:h-[24px] flex items-center justify-center"
          >
            <i 
              className="fas fa-chevron-left text-[48px] max-md:text-[36px] max-sm:text-[28px]"
              style={{ color: currentIndex === 0 ? '#C4C4C4' : '#010101' }}
            />
          </button>
          <img 
            src={images[currentIndex]} 
            alt="Food" 
            className="mx-auto max-w-[900px] w-full h-auto object-cover rounded-md transition-all duration-300 max-xl:w-[720px]" 
          />
          <button 
            onClick={goToNext}
            className="w-[64px] h-[64px] max-xl:w-[48px] max-xl:h-[48px] max-lg:w-[36px] max-lg:h-[36px] max-md:w-[24px] max-md:h-[24px] flex items-center justify-center"
          >
            <i 
              className="fas fa-chevron-right text-[48px] max-md:text-[36px] max-sm:text-[28px]"
              style={{ color: currentIndex === images.length - 1 ? '#C4C4C4' : '#010101' }}
            />
          </button>
        </div>

        {/* Mobile Slideshow */}
        <div className="flex flex-col items-center justify-center gap-[64px] lg:hidden max-[425px]:gap-[12px]">
          <img 
            src={images[currentIndex]} 
            alt="Food" 
            className="mx-auto w-full h-auto object-cover rounded-md transition-all duration-300 max-xl:w-[720px]" 
          />
          
          {/* Arrows with 32px gap */}
          <div className="flex gap-[32px]">
            <button onClick={goToPrev}>
              <i 
                className="fas fa-chevron-left text-[48px] max-md:text-[36px] max-sm:text-[36px]"
                style={{ color: currentIndex === 0 ? '#C4C4C4' : '#010101' }}
              />
            </button>
            <button onClick={goToNext}>
              <i 
                className="fas fa-chevron-right text-[48px] max-md:text-[36px] max-sm:text-[36px]"
                style={{ color: currentIndex === images.length - 1 ? '#C4C4C4' : '#010101' }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="mt-[88px] max-md:mt-[32px] max-sm:mt-[28px] mb-[200px]" id="careers">
        <h3 className="text-[#010101] text-[40px] text-center font-[400] custom-font max-md:text-[32px]">
          Think Big. Start at North Café.
        </h3>
        <p className="custom-font text-[#4E4E4E] text-[18px] leading-[28px] text-center mt-[8px] max-xl:text-[16px] max-md:text-[14px]">
          Join the team at your go-to campus cafés. Apply now!
        </p>
        <a 
          href="mailto:north.cafe@ng.com" 
          className="block mx-auto px-[24px] py-[12px] text-[20px] w-fit text-white bg-[#B20201] font-[700] mt-[32px] max-xl:mt-[28px]"
        >
          Send Resumé
        </a>
        <p className="custom-font text-[#4E4E4E] text-[18px] leading-[28px] text-center mt-[32px] max-xl:mt-[28px] max-xl:text-[16px] max-md:text-[14px]">
          Or send resumé to <strong>north.cafe@ng.com</strong>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#F3F3F3]">
        <div className="flex justify-between p-[64px] max-md:p-[32px] max-md:flex-col">
          <nav>
            <h2 className="custom-font font-[400] text-[#010101] text-[36px] leading-[44px] mb-[24px] max-md:text-[32px]">
              Think Big. Start at North Café.
            </h2>
            <a href="mailto:north.cafe@ng.com" className="px-[24px] py-[12px] text-[16px] text-white bg-[#B20201] font-[700] w-fit">
              Send Resumé
            </a>
          </nav>
          <nav className="flex flex-col gap-[8px] max-md:mt-[28px]">
            <h3 className="font-[600] text-[14px] leading-[22px] text-[#010101] custom-font uppercase">
              COMPANY
            </h3>
            <a href="/" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font">
              Menu
            </a>
            <a href="/about" className="font-[700] text-[14px] leading-[22px] text-[#010101] custom-font">
              About
            </a>
            <a href="#careers" className="font-[700] text-[14px] leading-[22px] text-[#010101] custom-font">
              Careers
            </a>
          </nav>
          <nav className="flex flex-col gap-[8px] max-md:mt-[28px]">
            <h3 className="font-[600] text-[14px] leading-[22px] text-[#010101] custom-font uppercase">
              SOCIALS
            </h3>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font">
              LinkedIn
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font">
              Youtube
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font">
              Instagram
            </a>
          </nav>
        </div>
        <div>
          <p className="font-[400] text-[14px] leading-[22px] text-[#010101] custom-font p-[32px] text-center">
            © 2025 North Café. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default About; 