import path from 'path';
import _ from 'lodash';

/**
 * 环境变量
 */
const NODE_ENV = process.env.NODE_ENV || 'development';               // 启动模式
const APP_PORT = process.env.APP_PORT || 3001;                        // 应用监听端口
const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';             // MySQL 地址
const MYSQL_USER = process.env.MYSQL_USER || 'root';                  // MySQL 用户名
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'emsoft';        // MySQL 密码
const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';             // MongoDB 地址

/**
 * 环境配置
 */
const env = {
  // 应用基本配置
  app: {
    env: NODE_ENV,
    port: APP_PORT,
    name: 'Maintenance Fund Management System - Dev',
    keys: ['maintenance_fund_management_system_hurr_durr'],
  },
  // webpack 开发服务器配置
  devServer: {
    host: 'http://localhost',
    port: 2992,
  },
  // mysql 数据库配置
  mysql: {
    host     : MYSQL_HOST,
    user     : MYSQL_USER,
    password : MYSQL_PASSWORD,
    database : 'maintenance',
  },
  // mongo 数据库配置
  mongo: {
    url: `mongodb://${MONGO_HOST}:27017/maintenance`,
  },
  // 财务系统连接配置
  rabbitmq: {
    url: 'amqp://localhost',
    rpcQueue: 'rpc_queue',
  },
  // 中间业务连接配置
  bank: {
    debug: false,
    httpPort: 7007,
    tcpPort: 8008,
    tcpServer: true,   // 是否开启 tcp 协议
    httpServer: false, // 是否开启 http 协议
  },
  // FTP 服务器连接配置
  ftp: {
    host: 'http://localhost',
    port: 8080,
    user: 'emsoft',
    password: 'emsoft',
  },
};

/**
 * 默认运行参数配置
 */
const SysConfig = {
  Password: '123456',          // 全局用户默认密码
  PayNoSeqLength: 4,           // 支出系统流水号的序号部分长度(YYYYMMDD + seqNo)
  CommonBizSeqLength: 4,       // 通用业务流水号的序号部分长度(YYYYMMDD + seqNo)
};

/**
 * 应用目录路径配置
 */
const Paths = {
  app: {
    root: process.cwd(),

    clientPath: path.resolve(process.cwd(), 'src', 'client'),         // 前端代码目录
    serverPath: path.resolve(process.cwd(), 'src', 'server'),         // 后端代码目录
    appPath: path.resolve(process.cwd(), 'src', 'server', 'app'),     // 后端应用代码目录
    modelsPath: path.resolve(process.cwd(), 'src', 'models'),         // models 目录

    publicPath: '/assets/',                                           // 浏览器访问路径
    outputPath: path.resolve(process.cwd(), 'build'),                  // 项目发布路径
    clientOutputPath: path.resolve(process.cwd(), 'build', 'client'), // 前端文件发布路径
    serverOutputPath: path.resolve(process.cwd(), 'build', 'server'), // 后端文件发布路径

    nodeModulesPath: path.resolve(process.cwd(), 'node_modules'),     // npm 安装依赖包文件夹路径
    tempFilePath: path.resolve(process.cwd(), 'tempFile'),            //临时文件夹路径
  },
  tablePaths: [
    path.resolve(process.cwd(), 'src', 'server', 'trading', 'db', 'initTables'),    // 交易系统表设计
    path.resolve(process.cwd(), 'src', 'server', 'finance', 'db', 'initTables'),    // 财务系统表设计
    path.resolve(process.cwd(), 'src', 'server', 'bank', 'db', 'initTables'),       // 中间业务表设计
  ],
  dataPaths: {
    base: path.resolve(process.cwd(), 'files', 'baseData.config'),                        // 通用基础数据
    finance: path.resolve(process.cwd(), 'files', 'financeData.config'),                     // 财务系统基础数据
    trading: path.resolve(process.cwd(), 'files', 'tradingData.config'),                     // 交易系统基础数据
  },
  zonePath: path.resolve(process.cwd(), 'files', 'ZoneConfig'),                     // 地区配置文件
  testPaths: [
    path.resolve(process.cwd(), 'test', '*.test.js'),                               // web 系统测试脚本
    path.resolve(process.cwd(), 'src', 'server', 'finance', 'test', '*.test.js'),   // 财务系统测试脚本
  ],
};

/**
 * 返回配置对象
 */

const config = _.merge(env, Paths);

export default config;
