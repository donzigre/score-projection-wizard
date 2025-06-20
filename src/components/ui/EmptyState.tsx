
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon 
}: EmptyStateProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-gray-400">
          {icon || <AlertCircle className="h-12 w-12" />}
        </div>
        <CardTitle className="mb-2 text-xl text-gray-700">{title}</CardTitle>
        <p className="mb-6 text-gray-500 max-w-md">{description}</p>
        {actionText && onAction && (
          <Button onClick={onAction} variant="outline" className="flex items-center space-x-2">
            <span>{actionText}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
