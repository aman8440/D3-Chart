/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { OrgChart } from "d3-org-chart";
import CustomNodeContent from "../components/customNodeContent";
import CustomExpandButton from "../components/customExpandButton";
import EmployeeDetailsCard from "../components/employeeDetailCard";

interface Employee {
  id: string;
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
  const [cardShow, setCardShow] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Employee[]>([]);

  useEffect(() => {
    if (routeData && routeData.length > 0) {
      setChartData(routeData);
    } else {
      console.warn("No data provided to Chart component");
    }
  }, [routeData]);
  const toggleDetailsCard = (nodeId: string) => {
    setCardShow(true);
    setEmployeeId(nodeId);
  };
  
  const handleDeleteNode = (deletedEmployeeId: string) => {
    const updatedData = chartData.filter(emp => emp.id !== deletedEmployeeId);
    setChartData(updatedData);
    
    const existingData = JSON.parse(localStorage.getItem("items") || "[]");
    const updatedStorageData = existingData.filter((item: Employee) => item.id !== deletedEmployeeId);
    localStorage.setItem("items", JSON.stringify(updatedStorageData));
  };

  useEffect(() => {
    if (!d3Container.current || !chartData.length) return;

    const chart = new OrgChart();
    
    try {
      chart
        .container(d3Container.current as unknown as string)
        .data(chartData)
        .nodeWidth(() => 300)
        .nodeHeight(() => 140)
        .compactMarginBetween(() => 80)
        .onNodeClick((d: any) => {
          toggleDetailsCard(d.data.id);
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
              data= {d} 
              onDeleteNode={(id: string) => {
                handleDeleteNode(id);
                chart.render();
              }}  
            />
          );
        });

      setTimeout(() => {
        chart.render();
      }, 100);
    } catch (error) {
      console.error("Error rendering chart:", error);
    }

    return () => {
      if (d3Container.current) {
        d3Container.current.innerHTML = '';
      }
    };
  }, [chartData]);

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
    </div>
  );
};

export default Chart;