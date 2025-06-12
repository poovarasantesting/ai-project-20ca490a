import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, addEvent, updateEvent } = useEvents();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "12:00",
    category: "other",
    location: ""
  });
  
  const isEditMode = Boolean(id);
  
  useEffect(() => {
    if (isEditMode) {
      const event = events.find(e => e.id === id);
      if (event) {
        setFormData({
          title: event.title,
          description: event.description || "",
          date: new Date(event.date),
          time: event.time || "12:00",
          category: event.category,
          location: event.location || ""
        });
      }
    }
  }, [id, events, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      date: format(formData.date, "yyyy-MM-dd")
    };
    
    if (isEditMode) {
      updateEvent(id, eventData);
      toast({
        title: "Event updated",
        description: "Your event has been updated successfully."
      });
    } else {
      addEvent(eventData);
      toast({
        title: "Event created",
        description: "Your new event has been created successfully."
      });
    }
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
        </header>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Add location (optional)"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add description (optional)"
                rows={4}
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Event" : "Create Event"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}