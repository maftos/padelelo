interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="text-center space-y-1.5">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};