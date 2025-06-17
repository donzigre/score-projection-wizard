
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content, className = "" }) => {
  return (
    <Card className={`shadow-lg border-0 bg-gradient-to-br from-green-50 to-white ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-green-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
