import '../App.css';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface ExpandButtonProps {
  node: {
    data: {
      _directSubordinates: number;
    };
  };
  expanded: boolean;
}

const CustomExpandButton = ({ node, expanded }: ExpandButtonProps) => {
  if (!node) return null;

  return (
    <div className="flex items-start justify-start p-2 bg-gray-200 rounded-md hover:bg-gray-300 card-data-show">
      <span className="text-sm font-semibold text-gray-800">
        {node.data._directSubordinates}
      </span>
      <span className="text-gray-600">
        {expanded ? (
          <ExpandLess className="text-xl delete-icon" />
        ) : (
          <ExpandMore className="text-xl delete-icon" />
        )}
      </span>
    </div>
  );
};

export default CustomExpandButton;
