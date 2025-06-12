import { Toaster } from "sonner";
import { ContactForm } from "./components/ContactForm";

function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <ContactForm />
      <Toaster position="top-center" />
    </main>
  );
}

export default App;