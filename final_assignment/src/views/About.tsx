import React from 'react';

const About: React.FC = () => (
  <div className="bg-gray-50 min-h-screen p-10">
    <h1 className="text-4xl font-bold mb-8">About Page</h1>

    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Author</h2>
      <p className="mb-6">Anton Kucherenko</p>

      <h2 className="text-2xl font-semibold mb-4">Using the Application</h2>
      <p className="mb-6">The UI is pretty simple and allows the user easily understand the functionality</p>

      <h2 className="text-2xl font-semibold mb-4">Content License</h2>
      <p className="mb-6">All images and content used in this application are original creations by the author. No external resources were used.</p>

      <h2 className="text-2xl font-semibold mb-4">Working Hours</h2>
      <p className="mb-6">Approximately 30 hours</p>

      <h2 className="text-2xl font-semibold mb-4">Most Difficult Feature to Implement</h2>
      <p className="mb-6">Module G and H </p>
    </div>
  </div>
);

export default About;
