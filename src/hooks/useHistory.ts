import { useState, useCallback, useRef, useEffect } from 'react';

export function useHistory<T>(initialState: T, limit = 50) {
  const [state, _setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const isUndoRedoAction = useRef(false);

  const setState = useCallback((newS: T | ((prev: T) => T), skipHistory = false) => {
    _setState(prev => {
      const next = typeof newS === 'function' ? (newS as any)(prev) : newS;
      
      if (isUndoRedoAction.current || skipHistory) {
        isUndoRedoAction.current = false;
        return next;
      }

      setPast(p => {
        const newPast = [...p, prev];
        if (newPast.length > limit) return newPast.slice(1);
        return newPast;
      });
      setFuture([]);
      return next;
    });
  }, [limit]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    isUndoRedoAction.current = true;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setFuture(f => [state, ...f]);
    _setState(previous);
  }, [past, state]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    isUndoRedoAction.current = true;
    const next = future[0];
    const newFuture = future.slice(1);

    setFuture(newFuture);
    setPast(p => [...p, state]);
    _setState(next);
  }, [future, state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { state, setState, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
