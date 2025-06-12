import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "@/pages/Calendar";
import EventForm from "@/pages/EventForm";
import EventDetails from "@/pages/EventDetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/event/new" element={<EventForm />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event/:id/edit" element={<EventForm />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;