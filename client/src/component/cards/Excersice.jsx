import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ExerciseCard = ({ exercise }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const musclesRef = useRef(null);
  const tipRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const muscles = musclesRef.current;
    const tip = tipRef.current;

    // Initial animation
    const tl = gsap.timeline();

    tl.fromTo(card,
      { scale: 0.95, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(title,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo(image,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo([muscles, tip],
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", stagger: 0.1 },
      "-=0.2"
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(image, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(image, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          ref={imageRef}
          src={exercise.video.includes("http") ? exercise.video : "/placeholder.gif"}
          alt={exercise.name}
          className="w-full h-56 object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2
            ref={titleRef}
            className="text-2xl font-bold text-white mb-2"
          >
            {exercise.name}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div
          ref={musclesRef}
          className="flex items-start space-x-3"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Target Muscles</h3>
            <p className="text-sm text-gray-600">
              {exercise.muscles.join(", ")}
            </p>
          </div>
        </div>

        <div
          ref={tipRef}
          className="flex items-start space-x-3"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Pro Tip</h3>
            <p className="text-sm text-gray-600">
              {exercise.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
