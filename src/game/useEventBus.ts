import { useEffect } from 'react';
import { EventBus, type GameEvent } from './EventBus';

export function useEventBus<T = unknown>(event: GameEvent, handler: (payload: T) => void) {
  useEffect(() => {
    EventBus.on(event, handler);
    return () => {
      EventBus.off(event, handler);
    };
  }, [event, handler]);
}
