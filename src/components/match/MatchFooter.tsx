interface MatchFooterProps {
  oldMmr: number;
  newMmr: number;
}

export const MatchFooter = ({ oldMmr, newMmr }: MatchFooterProps) => {
  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Previous MMR: {oldMmr}</span>
      <span>New MMR: {newMmr}</span>
    </div>
  );
};