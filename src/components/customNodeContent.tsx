import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
interface NodeContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onDeleteNode: (id: string) => void;
}

const CustomNodeContent = ({ data, onDeleteNode }: NodeContentProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this node?")) {
      onDeleteNode(data.data.id);
    }
  };

  const handleAdd = ()=>{
  }

  return (
    <div className="node-container p-4 bg-gray-100 rounded-lg shadow-md z-10">
      <div className="relative">
          <button
            type={'button'}
            onClick={handleAdd}
            className="absolute right-8 delete-icon z-10"
          >
            <PersonAddIcon />
          </button>
        {data.data.parentId && (
          <button
            onClick={(e)=> handleDelete(e)}
            type={'button'}
            className="absolute right-2 delete-icon delete-button"
          >
              <DeleteIcon />
            </button>
        )}
        
        <div className="node-details">
          {data.data.name ? (
            <div className="node-content">
              <div className="node-info space-y-2">
                <div className="node-name text-xl font-semibold text-gray-800">
                  {data.data.name}
                </div>
                <div className="node-role text-md text-gray-600">
                  {data.data.designation}
                </div>
                <div className="node-age text-sm text-gray-500">
                  Age: {data.data.age}
                </div>
                <div className="node-height text-sm text-gray-500">
                  Height: {data.data.height}cm
                </div>
                <div className="node-gender text-sm text-gray-500">
                  Gender: {data.data.gender}
                </div>
              </div>
            </div>
          ) : (
            <div className="node-team space-y-2">
              <div className="node-team-name text-lg font-semibold text-gray-800">
                {data.data.team}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomNodeContent;