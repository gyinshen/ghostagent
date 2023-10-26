interface ReportNameProps {
  name: string;
  editing?: boolean;
  setName: (name: string) => void;
}

export const ReportName = ({
  setName,
  name,
  editing = false,
}: ReportNameProps): JSX.Element => {
  if (editing) {
    return (
      <input
        onChange={(event) => setName(event.target.value)}
        autoFocus
        value={name}
      />
    );
  }

  return <span className="max-w-[150px] truncate">{name}</span>;
};
