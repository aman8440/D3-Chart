/* eslint-disable @typescript-eslint/no-explicit-any */
import "../App.css";

const EmployeeDetailsCard = (props: any) => {

  return (
    <div className={`card p-4 bg-white rounded-lg shadow-md node-container node-container-card`}>
      {props.employee.name ? (
        <div>
          <div className="card-header">
            <h2 className="card-name text-2xl font-semibold text-gray-800">
              {props.employee.name ?? ''}
            </h2>
            <p className="card-role text-md text-gray-600">
              {props.employee.designation}
            </p>
          </div>
          <div className="card-body space-y-3 mt-4">
            <div className="card-item flex justify-between">
              <p className="card-item-label text-sm font-semibold text-gray-600">Age:</p>
              <p className="card-item-value text-sm text-gray-800">{props.employee.age} years</p>
            </div>
            <div className="card-item flex justify-between">
              <p className="card-item-label text-sm font-semibold text-gray-600">Height:</p>
              <p className="card-item-value text-sm text-gray-800">{props.employee.height} cm</p>
            </div>
            <div className="card-item flex justify-between">
              <p className="card-item-label text-sm font-semibold text-gray-600">Gender:</p>
              <p className="card-item-value text-sm text-gray-800">{props.employee.gender}</p>
            </div>
            {props.employee.team && (
              <div className="card-item flex justify-between">
                <p className="card-item-label text-sm font-semibold text-gray-600">Team:</p>
                <p className="card-item-value text-sm text-gray-800">{props.employee.team}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="card-header">
            <h2 className="card-team-name text-2xl font-semibold text-gray-800">
              {props.employee.team} Team
            </h2>
          </div>
          <h4 className="text-lg text-gray-700 mt-4">Team Members:</h4>
          <div className="card-body space-y-3 mt-4">
            {props.employees
              .filter(
                (employee: any) => employee.parentId === props.employee.id.toString()
              )
              .map((employee: any) => (
                <div className="card-item-team p-3 bg-gray-100 rounded-md shadow-sm" key={employee.id}>
                  <p className="card-item-name text-lg font-semibold text-gray-800">
                    {employee.name}
                  </p>
                  <p className="card-item-role text-sm text-gray-600">
                    {employee.designation}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailsCard;
