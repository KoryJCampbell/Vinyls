type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const vinylEvents = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  notify: () => {
    listeners.forEach(listener => listener());
  }
};
