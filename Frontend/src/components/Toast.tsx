import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
      <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 text-red-400 hover:text-red-500">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </button>
      </div>
    );
  };

export default Toast;