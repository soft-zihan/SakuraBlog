import type { EmpModel, ResultModel, PageResultModel } from '@/api/model/model'
import request from '@/utils/request'

//分页条件查询
export const queryPageApi = (begin: string, end: string, gender: string, name: string, page: number, pageSize: number) => 
  request.get<any, PageResultModel>(`/emps?begin=${begin}&end=${end}&gender=${gender}&name=${name}&page=${page}&pageSize=${pageSize}`)

//新增员工
export const addApi = (emp: EmpModel) => request.post<any, ResultModel>('/emps', emp)

//根据ID查询员工
export const queryInfoApi = (id: number) => request.get<any, ResultModel>(`/emps/${id}`)

//更新员工
export const updateApi = (emp: EmpModel) => request.put<any, ResultModel>(`/emps`, emp)

//删除员工
export const deleteApi = (ids: string) => request.delete<any, ResultModel>(`/emps?ids=${ids}`)

//查询全部员工信息
export const queryAllApi = () => request.get<any, ResultModel>('/emps/list') 
