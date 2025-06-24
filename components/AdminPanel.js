import React, { useState, useEffect } from 'react';
import { dynamicDataAPI } from '../services/api';

const AdminPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sampleMeals, setSampleMeals] = useState('');
  const [deliveryLocations, setDeliveryLocations] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(300);
  const [serviceCharge, setServiceCharge] = useState(300);

  useEffect(() => {
    // Load current data
    const currentMeals = dynamicDataAPI.getSampleMeals();
    const currentLocations = dynamicDataAPI.getDeliveryLocations();
    const currentFees = dynamicDataAPI.getFees();

    if (currentMeals) {
      setSampleMeals(JSON.stringify(currentMeals, null, 2));
    }
    if (currentLocations) {
      setDeliveryLocations(JSON.stringify(currentLocations, null, 2));
    }
    if (currentFees) {
      setDeliveryFee(currentFees.deliveryFee || 300);
      setServiceCharge(currentFees.serviceCharge || 300);
    }
  }, []);

  const handleUpdateMeals = () => {
    try {
      const meals = JSON.parse(sampleMeals);
      dynamicDataAPI.updateSampleMeals(meals);
      alert('Sample meals updated successfully!');
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      alert('Invalid JSON format for meals');
    }
  };

  const handleUpdateLocations = () => {
    try {
      const locations = JSON.parse(deliveryLocations);
      dynamicDataAPI.updateDeliveryLocations(locations);
      alert('Delivery locations updated successfully!');
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      alert('Invalid JSON format for locations');
    }
  };

  const handleUpdateFees = () => {
    try {
      const fees = {
        deliveryFee: Number(deliveryFee),
        serviceCharge: Number(serviceCharge)
      };
      dynamicDataAPI.updateFees(fees);
      alert('Fees updated successfully!');
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      alert('Invalid fee values');
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-[#B20201] text-white p-3 rounded-full shadow-lg z-50"
        title="Admin Panel"
      >
        <i className="fas fa-cog text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold custom-font">Admin Panel</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6">
          {/* Sample Meals */}
          <div>
            <h3 className="text-lg font-semibold mb-2 custom-font">Sample Meals (JSON)</h3>
            <textarea
              value={sampleMeals}
              onChange={(e) => setSampleMeals(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded resize-none font-mono text-sm"
              placeholder="Enter JSON array of meals..."
            />
            <button
              onClick={handleUpdateMeals}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Meals
            </button>
          </div>

          {/* Delivery Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-2 custom-font">Delivery Locations (JSON)</h3>
            <textarea
              value={deliveryLocations}
              onChange={(e) => setDeliveryLocations(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded resize-none font-mono text-sm"
              placeholder="Enter JSON array of locations..."
            />
            <button
              onClick={handleUpdateLocations}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update Locations
            </button>
          </div>

          {/* Fees */}
          <div>
            <h3 className="text-lg font-semibold mb-2 custom-font">Fees</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Fee</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Charge</label>
                <input
                  type="number"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateFees}
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Update Fees
            </button>
          </div>

          {/* Example Data */}
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold mb-2 custom-font">Example JSON Formats:</h4>
            <div className="text-sm space-y-2">
              <div>
                <strong>Meals:</strong>
                <pre className="text-xs mt-1">
{`[
  { "id": 1, "name": "Espresso", "price": 500, "image_url": "/images/menu/coffee1.png" },
  { "id": 2, "name": "Cappuccino", "price": 1000, "image_url": "/images/menu/coffee2.png" }
]`}
                </pre>
              </div>
              <div>
                <strong>Locations:</strong>
                <pre className="text-xs mt-1">
{`[
  { "value": "edc", "label": "EDC Hostel" },
  { "value": "amethyst", "label": "Amethyst" }
]`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 