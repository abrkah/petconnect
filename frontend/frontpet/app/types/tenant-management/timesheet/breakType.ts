import { DateInfo } from "../../commons/dataInfo"; 

export interface BreakType extends DateInfo {
  id?: string;
  tenantId?: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
}
export interface BreakTypeList {
  item: BreakType;
}
