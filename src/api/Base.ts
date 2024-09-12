import Http from '@/utils/Http'
import { language } from '@/store/Layout'
import { DictResponse } from '@/store/interface'
/** 示例1----------
 * 根据文件url下载文件，公用
 *- url：文件路径，必须
 *- feFileName: 文件名称，必须，特定参数放在headers内
 */
 export const downloadFileByUrl = (url: string, feFileName: string) => Http.ask('GET', url, {}, {
    responseType: 'blob',
	headers: { feFileName }
})
/**  token信息 */
interface TokenInfo {
	accessKeyId: string
	accessKeySecret: string
	securityToken: string
}
/** 获取 阿里 oss token */
export const apiGetOssToken = () => Http.ask<TokenInfo>('POST', '/question-domain/oss/getToken')
/** 示例2 ---------
 * 此接口配置了feSilent，所以不会弹出默认样式的错误消息通知，而是直接返回所有的response，前端有更大的开发空间 */
export const messageIsSilent = () => Http.ask('GET', `/ntApi/xxxx`, {}, { headers: { feSilent: true } })
export type MenuType = {
	children: MenuType[]
	hideInmenu: boolean
	name: string
	icon: string
	child: MenuType[]
	path: string
	label: string
}
export type BaseType = {
	permission: string[]
	menus: MenuType[]
}
/** 获取用户信息 */
export const getUserInfo = (params?: any) => {
	return [{
		id: 67098,
		name: '测试号',
		position: 'admin',
		permission: [12, 13, 14, 15, 16, 17],
		status: 1,
		phoneNumber: '18721178888',
		email: '762366705@qq.com',
		avatar: 'https://questionbank.kezhitech.com/favicon.ico',
		menus: [
			{
				name: language.value === 'en' ? 'Dashboard' : '看板',
				icon: 'iconfont icon-dashboard',
				path: '/',
				file: '/dashboard/index.vue',
				alive: true
			},
			{
				name: language.value === 'en' ? 'Editor' : '工作台',
				icon: 'iconfont icon-shujuyuanpeizhi',
				path: '/datasource',
				file: '/data-source/index.vue',
				alive: true
			},
			{
				name: language.value === 'en' ? 'Reports' : '报表管理',
				icon: 'iconfont icon-ico-',
				path: '/report',
				file: '/report/index.vue',
				alive: true
			},
			{
				name: language.value === 'en' ? 'Files' : '测试文件上传',
				icon: 'iconfont icon-shangchuan',
				path: '/qiniu',
				file: '/qiniu/index.vue',
				alive: true
			}
		]
	}]
	Http.ask<BaseType>(`GET`, `/getUserInfo`, params)
}
/** 获取所有枚举接口 */
export const getAllEnum = (params?: any) => {
	return [{
		USER_STATUS: [{ name: '启用', enName: 'Enable', twName: '啟用', value: 1 }, { name: '禁用', enName: 'Disable', twName: '禁用', value: 0 }],
		USER_POSITION: [{ name: '管理员', enName: 'Administrator', twName: '管理員', value: 'admin' }, { name: '普通用户', enName: 'Enable', twName: 'Consumer', value: 'normal' }],
		"MYSQL_WRITE_MODE": [{ "type": "MYSQL_WRITE_MODE", "name": "写入前清理已有的数据(Insert Overwrite)", "value": "overwrite", "description": "datax insert模式，首先插入临时表，然后rename临时表到原表" }, { "type": "MYSQL_WRITE_MODE", "name": "不清理数据写入时将数据追加在已有数据后面(Insert into)", "value": "append", "description": "datax insert模式，直接向原表追加数据" }],
		"HIVE_DB": [{ "type": "HIVE_DB", "name": "ods", "value": "ods", "description": "hive数据库-ods" }, { "type": "HIVE_DB", "name": "bi", "value": "bi", "description": "hive数据库-bi" }, { "type": "HIVE_DB", "name": "dw", "value": "dw", "description": "hive数据库-dw" }, { "type": "HIVE_DB", "name": "dim", "value": "dim", "description": "hive数据库-dim" }, { "type": "HIVE_DB", "name": "dm", "value": "dm", "description": "hive数据库-dm" }, { "type": "HIVE_DB", "name": "adm", "value": "adm", "description": "hive数据库-adm" }, { "type": "HIVE_DB", "name": "xlai", "value": "xlai", "description": "hive数据库-xlai" }],
		"SCHEDULE_STATUS": [{ "type": "SCHEDULE_STATUS", "name": "初始化", "value": "0", "description": "调度状态-初始化" }, { "type": "SCHEDULE_STATUS", "name": "成功", "value": "1", "description": "调度状态-成功" }, { "type": "SCHEDULE_STATUS", "name": "运行中", "value": "2", "description": "调度状态-运行中" }, { "type": "SCHEDULE_STATUS", "name": "失败", "value": "3", "description": "调度状态-失败" }],
		"ES_COLUMN_TYPE": [{ "type": "ES_COLUMN_TYPE", "name": "keyword", "value": "keyword", "description": "es列类型-keyword" }, { "type": "ES_COLUMN_TYPE", "name": "integer", "value": "integer", "description": "es列类型-integer" }, { "type": "ES_COLUMN_TYPE", "name": "text", "value": "text", "description": "es列类型-text" }, { "type": "ES_COLUMN_TYPE", "name": "long", "value": "long", "description": "es列类型-long" }, { "type": "ES_COLUMN_TYPE", "name": "double", "value": "double", "description": "es列类型-double" }, { "type": "ES_COLUMN_TYPE", "name": "date", "value": "date", "description": "es列类型-date" }, { "type": "ES_COLUMN_TYPE", "name": "object", "value": "object", "description": "es列类型-object" }, { "type": "ES_COLUMN_TYPE", "name": "nested", "value": "nested", "description": "es列类型-nested" }, { "type": "ES_COLUMN_TYPE", "name": "boolean", "value": "boolean", "description": "es列类型-boolean" }],
		"COMMON_CRON": [{ "type": "COMMON_CRON", "name": "0 30 0 * * ? (每天零点30分执行)", "value": "0 30 0 * * ?", "description": "常用cron表达式，每天零点30分执行" }, { "type": "COMMON_CRON", "name": "0 0 1 * * ? (每天凌晨01点执行)", "value": "0 0 1 * * ?", "description": "常用cron表达式，天极任务，每天凌晨01:00:00执行" }, { "type": "COMMON_CRON", "name": "0 0 5 * * ? (每天凌晨05点执行）", "value": "0 0 5 * * ?", "description": "常用cron表达式，天极任务，每天凌晨05:00:00执行" }, { "type": "COMMON_CRON", "name": "0 0 7/2 * * ? (每天7点开始，两小时执行一次)", "value": "0 0 7/2 * * ?", "description": "常用cron表达式，小时任务，每天7点开始，两小时执行一次" }, { "type": "COMMON_CRON", "name": "0 0 * * * ? （每天每小时执行一次）", "value": "0 0 * * * ?", "description": "常用cron表达式，小时任务，每天每小时执行一次" }, { "type": "COMMON_CRON", "name": "0 0 7-23 * * ? (每天7点开始，每小时执行一次)", "value": "0 0 7-23 * * ?", "description": "0 0 7-23 * * ? (每天7点开始，每小时执行一次)" }, { "type": "COMMON_CRON", "name": "0 0 3 * * ?（每天3点执行）", "value": "0 0 3 * * ?", "description": "每天3点执行" }],
		"DATASOURCE_TYPE": [{ "type": "DATASOURCE_TYPE", "name": "mysql", "value": "mysql", "description": "mysql类型" }, { "type": "DATASOURCE_TYPE", "name": "postgresql", "value": "postgresql", "description": "DATASOURCE_TYPE postgresql" }, { "type": "DATASOURCE_TYPE", "name": "mongo", "value": "mongo", "description": "DATASOURCE_TYPE mongo" }, { "type": "DATASOURCE_TYPE", "name": "oracle", "value": "oracle", "description": "DATASOURCE_TYPE oracle" }, { "type": "DATASOURCE_TYPE", "name": "elasticsearch", "value": "elasticsearch", "description": "DATASOURCE_TYPE elasticsearch" }, { "type": "DATASOURCE_TYPE", "name": "clickhouse", "value": "clickhouse", "description": "DATASOURCE_TYPE clickhouse" }],
		"JOB_TYPE": [{ "type": "JOB_TYPE", "name": "mysql2hive", "value": "mysql2hive", "description": "抽数类型 从mysql到hive" }, { "type": "JOB_TYPE", "name": "mongo2hive", "value": "mongo2hive", "description": "抽数类型 从mongo到hive" }, { "type": "JOB_TYPE", "name": "hive2mysql", "value": "hive2mysql", "description": "推数类型 从hive到mysql" }, { "type": "JOB_TYPE", "name": "hive2es", "value": "hive2es", "description": "推数类型 从hive到elasticsearch" }, { "type": "JOB_TYPE", "name": "hive2tidb", "value": "hive2tidb", "description": "推数类型 从hive到tidb" }, { "type": "JOB_TYPE", "name": "hive2clickhouse", "value": "hive2clickhouse", "description": "推数类型 从hive到clickhouse" }],
		"JOB_BU": [{ "type": "JOB_BU", "name": "1对1", "value": "1对1", "description": "任务所属业务方：掌门一对一" }, { "type": "JOB_BU", "name": "少儿", "value": "少儿", "description": "任务所属业务方：掌门少儿" }, { "type": "JOB_BU", "name": "优课", "value": "优课", "description": "任务所属业务方：掌门优课" }, { "type": "JOB_BU", "name": "陪练", "value": "陪练", "description": "任务所属业务方：掌门陪练" }, { "type": "JOB_BU", "name": "产研", "value": "产研", "description": "任务所属业务方：掌门全脑产研" }, { "type": "JOB_BU", "name": "小狸", "value": "小狸", "description": "任务所属业务方：掌门小狸AI" }],
		"PULL_INCRE_TYPE": [{ "type": "PULL_INCRE_TYPE", "name": "天全量", "value": "day_all", "description": "按天全量抽数，该模式占用资源较多，请根据场景谨慎选择" }, { "type": "PULL_INCRE_TYPE", "name": "天增量", "value": "day_increment", "description": "按天增量抽数" }, { "type": "PULL_INCRE_TYPE", "name": "小时全量", "value": "hour_all", "description": "按小时全量，该模式占用资源较多，请根据场景谨慎选择" }, { "type": "PULL_INCRE_TYPE", "name": "小时增量", "value": "hour_increment", "description": "按小时增量" }],
		"META_DATA_STORAGE": [{ "type": "META_DATA_STORAGE", "name": "TEXTFILE", "value": "0", "description": "元数据存储格式-TEXTFILE" }, { "type": "META_DATA_STORAGE", "name": "ORC", "value": "2", "description": "元数据存储格式-ORC" }, { "type": "META_DATA_STORAGE", "name": "PARQUET", "value": "3", "description": "元数据存储格式-PARQUET" }],
		"META_DATA_LIFECYCLE": [{ "type": "META_DATA_LIFECYCLE", "name": "一个周", "value": "1", "description": "元数据生命周期-一周" }, { "type": "META_DATA_LIFECYCLE", "name": "一个月", "value": "2", "description": "元数据生命周期-一月" }, { "type": "META_DATA_LIFECYCLE", "name": "三个月", "value": "3", "description": "元数据生命周期-三月" }, { "type": "META_DATA_LIFECYCLE", "name": "一年", "value": "4", "description": "元数据生命周期-一年" }, { "type": "META_DATA_LIFECYCLE", "name": "三年", "value": "5", "description": "元数据生命周期-三年" }, { "type": "META_DATA_LIFECYCLE", "name": "永久", "value": "6", "description": "元数据生命周期-永久" }, { "type": "META_DATA_LIFECYCLE", "name": "半年", "value": "7", "description": "元数据生命周期-半年" }]
	}]
	Http.ask<DictResponse[]>(`GET`, `/getAllEnum`, params)
}
/** 获取七牛token */
export const getBucket = () => Http.ask('GET', '/getBucket')