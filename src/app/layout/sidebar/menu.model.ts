// menu.model.ts
export interface MenuItem {
  action: string;
  name: string;
  path: string;
}

export interface MenuModule {
  name: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuSection {
  name: string;
  modules: MenuModule[];
}