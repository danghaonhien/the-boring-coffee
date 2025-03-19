'use client';

import Image from 'next/image';

const phinSteps = [
  {
    title: "Prepare Your Phin Filter",
    instruction: "Place the metal filter chamber on top of a cup or glass. Make sure it's stable and secure.",
    image: "/images/how-to/phin-step1.jpg"
  },
  {
    title: "Add Coffee Grounds",
    instruction: "Add 2-3 tablespoons (15-20g) of medium-coarse ground coffee to the filter chamber. Gently shake to level the grounds.",
    image: "/images/how-to/phin-step2.jpg"
  },
  {
    title: "Insert Press Filter",
    instruction: "Place the press filter on top of the grounds and press down gently to create a light, even tamp.",
    image: "/images/how-to/phin-step3.jpg"
  },
  {
    title: "Blooming Phase",
    instruction: "Pour a small amount of hot water (195-205°F) just to cover the press filter. Let it bloom for 30 seconds.",
    image: "/images/how-to/phin-step4.jpg"
  },
  {
    title: "Complete the Pour",
    instruction: "Fill the chamber with hot water to the top and put the lid on to retain heat.",
    image: "/images/how-to/phin-step5.jpg"
  },
  {
    title: "Wait Patiently",
    instruction: "Allow the coffee to drip slowly through the filter, which takes about 4-5 minutes. This slow extraction creates the rich flavor.",
    image: "/images/how-to/phin-step6.jpg"
  },
  {
    title: "Enjoy Your Coffee",
    instruction: "Once dripping stops, remove the phin. For traditional Vietnamese coffee, add sweetened condensed milk to taste and stir.",
    image: "/images/how-to/phin-step7.jpg"
  }
];

export default function VietnamesePhinGuide() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[#242423] mb-8 text-center">Vietnamese Phin Brewing Guide</h2>
      <p className="text-[#333533] text-center max-w-2xl mx-auto mb-12">
        The phin filter produces a strong, rich coffee that&apos;s perfect for our bold roasts. 
        It&apos;s a simple brewing method that brings out the full flavor profile of our coffee.
      </p>
      
      <div className="space-y-16">
        {phinSteps.map((step, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
              <div className="bg-[#CFDBD5]/30 rounded-lg p-6">
                <div className="inline-flex bg-[#F5CB5C] text-[#242423] rounded-full h-10 w-10 items-center justify-center mb-4 shadow-md">
                  <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#242423] mb-2">{step.title}</h3>
                <p className="text-[#333533] leading-relaxed">{step.instruction}</p>
              </div>
            </div>
            
            <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} rounded-lg overflow-hidden`}>
              <Image
                src={step.image}
                alt={`Step ${index + 1}: ${step.title}`}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-[#242423] text-[#E8EDDF] p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="inline-block mr-2">•</span>
            <span>For iced coffee, brew with slightly more coffee grounds and pour directly over ice.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2">•</span>
            <span>The drip rate should be about 1 drop per second for optimal extraction.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2">•</span>
            <span>Don&apos;t rush the process - the slow drip is what creates the distinctive rich flavor.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2">•</span>
            <span>Clean your phin thoroughly after each use to maintain optimal flavor.</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 