import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, deleteEvent } = useEvents();
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Event not found</h1>
          <p className="mb-4 text-slate-500">The event you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/")}>Go back to Calendar</Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteEvent(id);
    toast({
      title: "Event deleted",
      description: "Your event has been deleted successfully."
    });
    navigate("/");
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800";
      case "personal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col items-start justify-between space-y-4 border-b pb-6 sm:flex-row sm:items-center sm:space-y-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{event.title}</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(`/event/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event
                      "{event.title}" from your calendar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-slate-700">
                <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
              </div>
              
              {event.time && (
                <div className="flex items-center text-slate-700">
                  <Clock className="mr-2 h-5 w-5 text-slate-400" />
                  {event.time}
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center text-slate-700">
                  <MapPin className="mr-2 h-5 w-5 text-slate-400" />
                  {event.location}
                </div>
              )}
            </div>
            
            <div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
            </div>
            
            {event.description && (
              <div>
                <h2 className="mb-2 text-lg font-medium text-slate-900">Description</h2>
                <p className="whitespace-pre-wrap text-slate-700">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}