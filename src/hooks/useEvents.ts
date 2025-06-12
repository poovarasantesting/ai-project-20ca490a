import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  category: "work" | "personal" | "other";
  location?: string;
};

// Load events from localStorage
const loadEvents = (): Event[] => {
  const savedEvents = localStorage.getItem("calendar-events");
  if (savedEvents) {
    return JSON.parse(savedEvents);
  }
  return [];
};

// Save events to localStorage
const saveEvents = (events: Event[]) => {
  localStorage.setItem("calendar-events", JSON.stringify(events));
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(loadEvents);

  // Save to localStorage when events change
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const addEvent = (eventData: Omit<Event, "id">) => {
    const newEvent = {
      ...eventData,
      id: uuidv4(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, eventData: Partial<Omit<Event, "id">>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  };
};