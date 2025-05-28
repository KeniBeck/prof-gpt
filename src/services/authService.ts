import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  isTeacher: boolean;
}

export class AuthService {
  private graphClient: Client;
  
  constructor() {
    // Estos valores se deben obtener de variables de entorno
    const tenantId = process.env.AZURE_TENANT_ID || '';
    const clientId = process.env.AZURE_CLIENT_ID || '';
    const clientSecret = process.env.AZURE_CLIENT_SECRET || '';
    
    // Crear credenciales para la aplicación
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    // Crear proveedor de autenticación para Microsoft Graph
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });
    
    // Inicializar cliente de Microsoft Graph
    this.graphClient = Client.initWithMiddleware({
      authProvider
    });
  }
  
  /**
   * Verifica si un usuario es profesor mediante su pertenencia al grupo "Docentes Ameritec"
   * @param userEmail Email institucional del usuario
   * @returns Datos del usuario con indicador si es profesor
   */
  async validateTeacher(userEmail: string): Promise<AuthUser | null> {
    try {
      // Obtener información del usuario por su email
      const userResponse = await this.graphClient
        .api(`/users`)
        .filter(`mail eq '${userEmail}'`)
        .get();
      
      if (!userResponse.value || userResponse.value.length === 0) {
        return null;
      }
      
      const user = userResponse.value[0];
      
      // ID del grupo "Docentes Ameritec" que vimos en la captura de pantalla
      const docentesGroupId = "fdd3e1b4-260a-423e-b669-3d53562626b0";
      
      // Verificar si el usuario es miembro del grupo Docentes Ameritec
      const membershipResponse = await this.graphClient
        .api(`/groups/${docentesGroupId}/members`)
        .filter(`id eq '${user.id}'`)
        .get();
      
      // Si el usuario está en el grupo, es profesor
      const isTeacher = membershipResponse.value && membershipResponse.value.length > 0;
      
      return {
        id: user.id,
        displayName: user.displayName,
        email: userEmail,
        isTeacher: isTeacher
      };
      
    } catch (error) {
      console.error('Error al validar profesor:', error);
      return null;
    }
  }
  
  /**
   * Método alternativo: Verifica los grupos de un usuario y confirma si es profesor
   * @param userEmail Email institucional del usuario
   * @returns Datos del usuario con indicador si es profesor
   */
  async checkTeacherByMemberships(userEmail: string): Promise<AuthUser | null> {
    try {
      // Obtener información del usuario por su email
      const userResponse = await this.graphClient
        .api(`/users`)
        .filter(`mail eq '${userEmail}'`)
        .get();
      
      if (!userResponse.value || userResponse.value.length === 0) {
        return null;
      }
      
      const user = userResponse.value[0];
      
      // Obtener todos los grupos del usuario
      const groupsResponse = await this.graphClient
        .api(`/users/${user.id}/memberOf`)
        .get();
      
      // Buscar si alguno de los grupos es "Docentes Ameritec"
      const isTeacher = groupsResponse.value.some(
        (group: any) => group.displayName === "Docentes Ameritec"
      );
      
      return {
        id: user.id,
        displayName: user.displayName,
        email: userEmail,
        isTeacher: isTeacher
      };
      
    } catch (error) {
      console.error('Error al verificar grupos del usuario:', error);
      return null;
    }
  }
}