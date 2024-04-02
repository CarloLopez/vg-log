import { useEffect, useState } from "react";

type BacklogStatusFilterProps = {
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const BacklogStatusFilter = ({setFilters}: BacklogStatusFilterProps) => {

  const [inProgress, setInProgress] = useState(true);
  const [notStarted, setNotStarted] = useState(true);
  const [completed, setCompleted] = useState(true);
  const [dropped, setDropped] = useState(true);

  useEffect(() => {
    const filters = [];
    
    if (inProgress) filters.push('inProgress');
    if (notStarted) filters.push('notStarted');
    if (completed) filters.push('completed');
    if (dropped) filters.push('dropped');

    setFilters(filters);
  }, [setFilters, inProgress, notStarted, completed, dropped])

  return (
    <ul>
      <li>
        <input type="checkbox" name="inProgress" checked={inProgress} onChange={(e => setInProgress(e.target.checked))}/>
        <label htmlFor="inProgress">In Progress</label>
      </li>
      <li>
        <input type="checkbox" name="notStarted" checked={notStarted} onChange={(e => setNotStarted(e.target.checked))}/>
        <label htmlFor="notStarted">Not Started</label>
      </li>
      <li>
        <input type="checkbox" name="completed" checked={completed} onChange={(e => setCompleted(e.target.checked))}/>
        <label htmlFor="completed">Completed</label>
      </li>
      <li>
        <input type="checkbox" name="dropped" checked={dropped} onChange={(e => setDropped(e.target.checked))}/>
        <label htmlFor="dropped">Dropped</label>
      </li>
    </ul>
  )
}

export default BacklogStatusFilter;