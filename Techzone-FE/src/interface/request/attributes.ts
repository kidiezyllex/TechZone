
export interface IBrandFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IBrandCreate {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IBrandUpdate {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}


export interface ICategoryFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ICategoryCreate {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ICategoryUpdate {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}