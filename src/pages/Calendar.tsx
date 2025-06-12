import { useState } from "react";
import { Link } from "react-router-dom";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events } = useEvents();
  
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendar</h1>
            <p className="text-slate-500">Manage your events and schedule</p>
          </div>
          <Link to="/event/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </Link>
        </header>
        
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center justify-between py-2">
            <h2 className="flex items-center text-xl font-semibold text-slate-900">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-slate-500">
                {day}
              </div>
            ))}
            
            {days.map((day) => {
              const dayEvents = events.filter(event => 
                isSameDay(parseISO(event.date), day)
              );
              
              return (
                <div 
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] rounded-md border p-1 transition-colors",
                    isSameMonth(day, currentDate) 
                      ? "bg-white hover:bg-slate-50" 
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  <div className="text-right text-sm font-medium">
                    {format(day, "d")}
                  </div>
                  <div className="mt-1">
                    {dayEvents.map(event => (
                      <Link 
                        key={event.id} 
                        to={`/event/${event.id}`}
                        className={cn(
                          "mb-1 block truncate rounded px-1 py-0.5 text-xs",
                          event.category === "work" ? "bg-blue-100 text-blue-800" :
                          event.category === "personal" ? "bg-green-100 text-green-800" :
                          "bg-purple-100 text-purple-800"
                        )}
                      >
                        {event.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}