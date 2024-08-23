export interface INavbarData {
  routeLink: string;
  external?: boolean;
  icon?: string;
  label: string;
  expanded?: boolean;
  items?: INavbarData[];
}
