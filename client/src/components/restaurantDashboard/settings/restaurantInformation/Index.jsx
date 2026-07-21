import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import RestaurantInfo from './RestaurantInfo';
import LegalInfo from './LegalInfo';

const Index = () => {
  const [activeSubTab, setActiveSubTab] = useState('personal');

  return (
    <div className="flex flex-col h-full gap-2">
      <PersonalInfo />
      <RestaurantInfo />
      <LegalInfo />

      {/* <div className="flex gap-2 border-b border-(--color-secondary) pb-2">
        <button
          className={`px-3 py-1 text-sm font-semibold rounded ${activeSubTab === 'personal' ? 'bg-(--color-primary) text-(--color-primary-content)' : 'text-(--color-primary) hover:bg-(--color-primary)/10'}`}
          onClick={() => setActiveSubTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`px-3 py-1 text-sm font-semibold rounded ${activeSubTab === 'restaurant' ? 'bg-(--color-primary) text-(--color-primary-content)' : 'text-(--color-primary) hover:bg-(--color-primary)/10'}`}
          onClick={() => setActiveSubTab('restaurant')}
        >
          Restaurant Info
        </button>
        <button
          className={`px-3 py-1 text-sm font-semibold rounded ${activeSubTab === 'legal' ? 'bg-(--color-primary) text-(--color-primary-content)' : 'text-(--color-primary) hover:bg-(--color-primary)/10'}`}
          onClick={() => setActiveSubTab('legal')}
        >
          Legal Info
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'personal' && <PersonalInfo />}
        {activeSubTab === 'restaurant' && <RestaurantInfo />}
        {activeSubTab === 'legal' && <LegalInfo />}
      </div> */}
    </div>
  );
};

export default Index;