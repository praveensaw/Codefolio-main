import React, { useState } from 'react';
import { Users, BarChart2 } from 'lucide-react';
import CandidateSelectionModal from '../components/CompareCandidates/CandidateSelectionModal';
import { useTheme } from '../App';

const CompareCandidate = () => {
  const { isDarkMode } = useTheme();
  const [compareMode, setCompareMode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} max-w-7xl mx-auto p-4`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Compare Coders
        </h1>
        {!compareMode && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setCompareMode('dual');
                setShowModal(true);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Compare Two Coders
            </button>
            <button
              onClick={() => {
                // Uncomment and implement if needed for multiple candidate comparison
                // setCompareMode('multiple');
                // setShowModal(true);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <BarChart2 className="h-5 w-5" />
              Compare Multiple Coders
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CandidateSelectionModal
          onClose={() => {
            setShowModal(false);
            setCompareMode(null);
          }}
        />
      )}
    </div>
  );
};

export default CompareCandidate;
