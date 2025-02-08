
interface MatchFooterProps {
  oldMmr: number;
  newMmr: number;
}

export const MatchFooter = ({ oldMmr, newMmr }: MatchFooterProps) => {
  const formatMmr = (mmr: number) => {
    return mmr?.toFixed(0) || '0';
  };

  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Previous MMR: {formatMmr(oldMmr)}</span>
      <span>New MMR: {formatMmr(newMmr)}</span>
    </div>
  );
};
