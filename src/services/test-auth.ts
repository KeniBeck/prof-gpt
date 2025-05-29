import { AuthService } from "./authService"; 

 export async function testAuth() {
  const authService = new AuthService();
  try {
    // Reemplaza con el email de un profesor real
    const result = await authService.validateTeacher('adriana.pineda@ameritec.edu.gt');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();