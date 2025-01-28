/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { OrgChart } from 'd3-org-chart';

interface ChartFunction {
  name: string;
  description: string;
  fn: () => void;
  hasParams: boolean;
  parameterFn?: (...args: any[]) => void;
}

interface ChartControlsProps {
  chartInstance: OrgChart<any> | null;
  onChartUpdate: () => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ chartInstance, onChartUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showParamInput, setShowParamInput] = useState<string | null>(null);
  const [paramValue, setParamValue] = useState('');

  console.log("==chartinstance==", chartInstance);
  const handleFunctionCall = (func: ChartFunction) => {
    if (!chartInstance) {
      console.warn('Chart instance not available');
      return;
    }
    
    if (func.hasParams) {
      setShowParamInput(func.name);
    } else {
      func.fn();
      onChartUpdate();
    }
  };

  const handleParameterSubmit = (func: ChartFunction) => {
    if (!chartInstance || !func.parameterFn) return;
    
    func.parameterFn(paramValue);
    onChartUpdate();
    setShowParamInput(null);
    setParamValue('');
  };

  const chartFunctions: ChartFunction[] = [
    { 
      name: 'Get Chart State',
      description: 'Returns current chart state',
      fn: () => {
        const state = chartInstance?.getChartState();
        console.log('Chart State:', state);
      },
      hasParams: false
    },
    { 
      name: 'Set Centered',
      description: 'Centered a specific node',
      fn: () => {},
      hasParams: true,
      parameterFn: (nodeId: string) => {
        chartInstance?.setCentered(nodeId);
      }
    },
    { 
      name: 'Set Highlighted',
      description: 'Highlight a specific node',
      fn: () => {},
      hasParams: true,
      parameterFn: (nodeId: string) => {
        chartInstance?.setHighlighted(nodeId);
      }
    },
    { 
      name: 'Clear Highlighting',
      description: 'Remove all highlights',
      fn: () => chartInstance?.clearHighlighting(),
      hasParams: false
    },
    { 
      name: 'Zoom In',
      description: 'Increase zoom level',
      fn: () => chartInstance?.zoomIn(),
      hasParams: false
    },
    { 
      name: 'Zoom Out',
      description: 'Decrease zoom level',
      fn: () => chartInstance?.zoomOut(),
      hasParams: false
    },
    { 
      name: 'Expand All',
      description: 'Expand all nodes',
      fn: () => chartInstance?.expandAll(),
      hasParams: false
    },
    { 
      name: 'Collapse All',
      description: 'Collapse all nodes',
      fn: () => chartInstance?.collapseAll(),
      hasParams: false
    },
    {
      name: 'Export Full',
      description: 'Export the full chart as an image.',
      hasParams: false,
      fn: () => chartInstance?.exportImg({full:true})
    },
    {
      name: 'Export SVG',
      description: 'Export the chart as an SVG.',
      hasParams: false,
      fn: () => chartInstance?.exportSvg()
    },
    {
      name: 'Export Current',
      description: 'Export the current chart as an image.',
      hasParams: false,
      fn: () => chartInstance?.exportImg()
    },
  ];

  const filteredFunctions = chartFunctions.filter(func => 
    func.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-4 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="space-y-2">
        {filteredFunctions.map((func, index) => (
          <div key={index} className="space-y-2">
            <button
              onClick={() => handleFunctionCall(func)}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-sm font-medium">{func.name}</div>
              <div className="text-xs text-gray-500">{func.description}</div>
            </button>
            
            {showParamInput === func.name && (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={paramValue}
                  onChange={(e) => setParamValue(e.target.value)}
                  placeholder="Enter parameter..."
                  className="w-full px-3 py-1 text-sm border rounded mb-2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleParameterSubmit(func)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowParamInput(null)}
                    className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartControls;