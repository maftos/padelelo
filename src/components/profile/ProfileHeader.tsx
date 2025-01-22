import { FC } from "react";

interface ProfileHeaderProps {
  title: string;
  description: string;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};