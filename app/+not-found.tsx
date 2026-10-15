import { Redirect } from 'expo-router';

// La app es de una sola pantalla: cualquier ruta vieja (por ej. /impact) vuelve al inicio.
export default function NotFound() {
  return <Redirect href="/" />;
}
