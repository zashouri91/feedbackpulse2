import React from 'react';
import { cn } from '../../utils/cn';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onChange: (value: string) => void;
} | null>(null);

export function Tabs({ defaultValue, children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className="space-y-4">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isSelected = context.value === value;

  return (
    <button
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
        isSelected
          ? "bg-white text-gray-900 shadow"
          : "text-gray-600 hover:text-gray-900"
      )}
      onClick={() => context.onChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
}