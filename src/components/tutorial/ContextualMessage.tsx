
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp,
  Users,
  MapPin
} from "lucide-react";

interface ContextualMessageProps {
  type: 'info' | 'success' | 'warning' | 'tip';
  title: string;
  message: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export const ContextualMessage: React.FC<ContextualMessageProps> = ({
  type,
  title,
  message,
  icon,
  badge,
  className = ""
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'tip':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${getTypeStyles()} ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            {icon || getDefaultIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm">{title}</p>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
