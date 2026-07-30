import type { ResultModel,LoginEmp } from '@/api/model/model'
import request from '@/utils/request'

//登录
export const loginApi = (loginEmp:LoginEmp) => request.post<any, ResultModel>(`/login`, loginEmp)
