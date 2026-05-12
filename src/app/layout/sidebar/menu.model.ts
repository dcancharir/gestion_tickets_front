export interface MenuItem {
  action: string;
  name:   string;
  path:   string;
}

export interface MenuModule {
  name:        string;
  icon:        string;
  items:       MenuItem[];
  // Opcionales: cuando están presentes el módulo es un link directo (sin submenu)
  directPath?: string;
  action?:     string;
}

export interface MenuSection {
  name:    string;
  modules: MenuModule[];
}
