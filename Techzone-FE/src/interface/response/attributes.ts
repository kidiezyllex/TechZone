
interface IAttributeBase {
  id: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}


export interface IBrand extends IAttributeBase {
  name: string;
}

export interface IBrandResponse {
  success: boolean;
  message: string;
  data: IBrand;
}

export interface IBrandsResponse {
  success: boolean;
  message: string;
  data: IBrand[];
}


export interface ICategory extends IAttributeBase {
  name: string;
}

export interface ICategoryResponse {
  success: boolean;
  message: string;
  data: ICategory;
}

export interface ICategoriesResponse {
  success: boolean;
  message: string;
  data: ICategory[];
}