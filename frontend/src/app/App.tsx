import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../services/authContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
