import request from '@/utils/request'
import type { ResultModel, DeptModel} from '@/api/model/model';

//部门列表查询
export const queryAllApi = () =>  request.get<any, ResultModel>('/depts');

//新增部门
export const addApi = (dept: DeptModel) => request.post<any, ResultModel>('/depts', dept)

//根据ID查询部门
export const queryInfoApi = (id: number) => request.get<any, ResultModel>(`/depts/${id}`)

//更新部门
export const updateApi = (dept: DeptModel) => request.put<any, ResultModel>(`/depts`, dept)

//删除部门
export const deleteApi = (id:number) => request.delete<any, ResultModel>(`/depts?id=${id}`)