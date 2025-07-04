
interface MatchFooterProps {
  oldMmr: number;
  newMmr: number;
}

export const MatchFooter = ({ oldMmr, newMmr }: MatchFooterProps) => {
  const formatMmr = (mmr: number) => {
    return mmr?.toFixed(0) || '0';
  };

  return (
    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/20">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Previous MMR</p>
        <p className="text-lg font-bold text-foreground">{formatMmr(oldMmr)}</p>
      </div>
      <div className="flex items-center">
        <div className="h-px w-12 bg-gradient-to-r from-primary to-secondary"></div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">New MMR</p>
        <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {formatMmr(newMmr)}
        </p>
      </div>
    </div>
  );
};
