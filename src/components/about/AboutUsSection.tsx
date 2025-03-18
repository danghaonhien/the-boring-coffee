'use client';

import AboutUsCard from './AboutUsCard';

export default function AboutUsSection() {
  // Content for the about us cards
  const aboutUsContent = [
    {
      title: 'Our Team',
      subtitle: 'Personal, private, powerful.',
      image: '/images/about/team.jpg',
      content: (
        <>
          <p>
            Our team at The Boring Coffee consists of passionate coffee enthusiasts who are dedicated to delivering exceptional coffee experiences. We come from diverse backgrounds but share a common love for quality coffee.
          </p>
          <p>
            Each member brings unique skills and perspectives to our operation, from our expert roasters with years of experience to our creative marketing team and attentive customer service representatives.
          </p>
          <p>
            Together, we work tirelessly to ensure that every bean we source, roast, and package meets our high standards. We believe that coffee is more than just a beverage—it&apos;s a moment of joy, a boost of energy, and a catalyst for connection.
          </p>
        </>
      ),
      backgroundColor: '#242423',
      textColor: '#E8EDDF'
    },
    {
      title: 'Productivity',
      subtitle: 'Your workplace can be any place.',
      image: '/images/about/productivity.jpg',
      content: (
        <>
          <p>
            Coffee and productivity go hand in hand, which is why we&apos;ve crafted our beans to help you stay focused and energized throughout your workday, no matter where you choose to work.
          </p>
          <p>
            Whether you&apos;re coding at home, brainstorming at a coffee shop, or working from a remote location, our coffee is designed to enhance your productivity and keep you sharp.
          </p>
          <p>
            Our carefully selected beans and precise roasting methods ensure a balanced caffeine release that promotes sustained focus without the crash, making The Boring Coffee the perfect companion for your most productive days.
          </p>
        </>
      ),
      backgroundColor: '#5A5A46',
      textColor: '#E8EDDF'
    },
    {
      title: 'Creativity',
      subtitle: 'Take your inner artist out and about.',
      image: '/images/about/creativity.jpg',
      content: (
        <>
          <p>
            Coffee has long been associated with creative thinking and artistic expression. At The Boring Coffee, we celebrate this connection by crafting blends that inspire creativity and innovation.
          </p>
          <p>
            Our unique flavor profiles are designed to stimulate the senses and awaken the creative mind, providing the perfect backdrop for your next big idea or artistic endeavor.
          </p>
          <p>
            Whether you&apos;re designing, writing, composing, or simply dreaming up new possibilities, let our coffee be the catalyst that helps you transform your creative vision into reality.
          </p>
        </>
      ),
      backgroundColor: '#4D724D',
      textColor: '#E8EDDF'
    },
    {
      title: 'Learning',
      subtitle: 'Your classroom can be anywhere.',
      image: '/images/about/learning.jpg',
      content: (
        <>
          <p>
            Learning is a lifelong journey, and coffee has been the trusted companion of students and scholars for centuries. The Boring Coffee continues this tradition with blends that enhance focus and information retention.
          </p>
          <p>
            Whether you&apos;re studying for an exam, mastering a new skill, or simply expanding your knowledge, our coffee provides the perfect balance of stimulation and clarity to support your educational pursuits.
          </p>
          <p>
            We also believe in educating our customers about coffee itself, which is why we share detailed information about our sourcing, roasting, and brewing methods, empowering you to become a more informed coffee enthusiast.
          </p>
        </>
      ),
      backgroundColor: '#7D5A31',
      textColor: '#E8EDDF'
    }
  ];

  return (
    <section className="py-12 bg-[#CFDBD5]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#242423] mb-12 text-center">About Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutUsContent.map((card, index) => (
            <div key={index} className="h-full">
              <AboutUsCard
                title={card.title}
                subtitle={card.subtitle}
                image={card.image}
                content={card.content}
                backgroundColor={card.backgroundColor}
                textColor={card.textColor}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 