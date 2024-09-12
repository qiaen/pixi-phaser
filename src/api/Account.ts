import Http from '@/utils/Http'

/** 登录 */
export const login = (params: any) => Http.ask<any>(`POST`, `/user/login`, params)