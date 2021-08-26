import { Children, FC, ReactElement, ReactNode, useState } from "react";

interface ITableProps {
  children:
    | ReactElement<ITableRowProps>
    | undefined
    | ReactElement<ITableRowProps>[];
}

export const Table: FC<ITableProps> = ({ children }) => {
  if (!children) {
    return null;
  }

  const colCount =
    Math.max(
      0,
      ...Children.map(children, (child: ReactElement<ITableRowProps>) => {
        return Children.count(child.props.children);
      })
    ) + 1;

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${colCount}, auto)` }}
    >
      {children}
    </div>
  );
};

interface ITableRowProps {
  children:
    | ReactElement<ITableCellProps, typeof TableCell>
    | ReactElement<ITableCellProps, typeof TableCell>[];
  details: ReactNode;
}

export const TableRow: FC<ITableRowProps> = ({ children, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {children}
      <div onClick={() => setExpanded((state) => !state)}>expand</div>
      {expanded && <div style={{ gridColumn: "1 / -1" }}>{details}</div>}
    </>
  );
};

interface ITableCellProps {}

export const TableCell: FC<ITableCellProps> = ({ children }) => {
  return <div className="bg-gray-300">{children}</div>;
};
