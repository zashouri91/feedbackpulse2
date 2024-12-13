import { useState, useCallback } from 'react';

export function useBatchSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds(prev => 
      prev.size === items.length ? new Set() : new Set(items.map(item => item.id))
    );
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isSelected: (id: string) => selectedIds.has(id),
    selectedCount: selectedIds.size,
    isAllSelected: items.length > 0 && selectedIds.size === items.length,
  };
}