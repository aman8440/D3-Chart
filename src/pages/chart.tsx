/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { OrgChart } from "d3-org-chart";
import * as d3 from "d3";
import CustomNodeContent from "../components/customNodeContent";
import CustomExpandButton from "../components/customExpandButton";
import EmployeeDetailsCard from "../components/employeeDetailCard";
import AddEmployeeForm from "../components/AddEmployeeFormProps";
import ChartControls from "../components/chartControls";

interface Employee {
  id: any;
  name: string;
  gender: string;
  age: number;
  height: string;
  designation: string;
  parentId?: string;
  team?: string;
  description?: string;
  _directSubordinates?: number;
}

interface ChartProps {
  data: Employee[];
}

const Chart = ({ data: routeData }: ChartProps) => {
  const d3Container = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<OrgChart<any> | null>(null);
  
  const [cardShow, setCardShow] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [chartData, setChartData] = useState<Employee[]>(routeData || []);

  const initializeChart = () => {
    if (!d3Container.current || !chartData.length) return null;

    const chart = new OrgChart();
    
    chart
      .container(d3Container.current as unknown as any)
      .data(chartData)
      .nodeWidth(() => 300)
      .nodeHeight(() => 140)
      .compactMarginBetween(() => 80)
      .onNodeClick((node:any) => {
        toggleDetailsCard(node.data.id);
      })
      .buttonContent((d: any) => {
        return ReactDOMServer.renderToStaticMarkup(
          <CustomExpandButton 
            node={d.node} 
            expanded={d.state.expanded} 
          />
        );
      })
      .nodeContent((d: any) => {
        return ReactDOMServer.renderToStaticMarkup(
          <CustomNodeContent 
            data={d} 
            deleteButtonId={`delete-${d.data.id}`}
            addButtonId={`add-${d.data.id}`}
          />
        );
      });

    return chart;
  };

  useEffect(() => {
    if (!chartData.length || !d3Container.current) return;

    const chart = initializeChart();
    if (!chart) return;

    chartInstance.current = chart;

    chart.render();
    const attachButtonListeners = () => {
      const container = d3.select(d3Container.current);
      container.selectAll('.delete-button').on('click', function (event: MouseEvent) {
        event.stopPropagation();
        const button = this as HTMLButtonElement;
        const nodeId = button.id.replace('delete-', '');
        if (confirm('Are you sure you want to delete this node?')) {
          handleDeleteNode(nodeId);
        }
      });
      container.selectAll('.add-button').on('click', function (event: MouseEvent) {
        event.stopPropagation();
        const button = this as HTMLButtonElement;
        const nodeId = button.id.replace('add-', '');
        setSelectedParentId(nodeId);
        setShowAddForm(true);
      });
    };
    attachButtonListeners();

    chart.onNodeClick(() => {
      attachButtonListeners();
    });
    return () => {
      if (d3Container.current) {
        d3Container.current.innerHTML = '';
      }
      chartInstance.current = null;
    };
  }, [chartData]);

  const updateChart = () => {
    if (!chartInstance.current) {
      const chart = initializeChart();
      if (chart) {
        chartInstance.current = chart;
        chart.render();
      }
    } else {
      chartInstance.current.render();
    }
  };
  const handleDeleteNode = (deletedEmployeeId: string) => {
    const updatedData = chartData.filter(emp => emp['id'] != deletedEmployeeId);
    setChartData(updatedData);
    
    const existingData = JSON.parse(localStorage.getItem("items") || "[]");
    const updatedStorageData = existingData.filter((item: Employee) => item['id'] != deletedEmployeeId);
    localStorage.setItem("items", JSON.stringify(updatedStorageData));
    
    if (chartInstance.current) {
      chartInstance.current.removeNode(deletedEmployeeId).render();
    }
  };

  const handleAddEmployee = (employeeData: Employee) => {
    const updatedData = [...chartData, employeeData];
    setChartData(updatedData);
    
    const existingData = JSON.parse(localStorage.getItem("items") || "[]");
    localStorage.setItem("items", JSON.stringify([...existingData, employeeData]));
    if (chartInstance.current) {
      chartInstance.current.addNode(employeeData).render();
    }
  };

  const toggleDetailsCard = (nodeId: string) => {
    setCardShow(true);
    setEmployeeId(nodeId);
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No data available</h2>
          <p>Please add employees from the listing page first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ChartControls 
        chartInstance={chartInstance.current} 
        onChartUpdate={updateChart} 
      />
      <div 
        className="org-chart flex justify-between" 
        ref={d3Container}
      >
        {cardShow && employeeId && (
          <EmployeeDetailsCard
            employees={chartData}
            employee={chartData.find((employee) => employee.id === employeeId)}
            handleClose={() => setCardShow(false)}
          />
        )}
        {showAddForm && (
          <AddEmployeeForm
            open={showAddForm}
            onClose={() => setShowAddForm(false)}
            onAdd={handleAddEmployee}
            parentId={selectedParentId}
          />
        )}
      </div>
    </div>
  );
};

export default Chart;