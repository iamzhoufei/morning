import Taro from '@tarojs/taro'

const { cloud } = Taro;

// 添加通知记录
export const addSchedule = (params) => cloud.callFunction({
  name: 'schedule',
  data: {
    ...params,
    action: 'addSchedule'
  }
})

// 查询通知记录
export const getSchedule = () => cloud.callFunction({
  name: 'schedule',
  data: {
    action: 'getSchedule'
  }
})


// 发送通知记录
export const sendSchedule = (params) => cloud.callFunction({
  name: 'schedule',
  data: {
    ...params,
    action: 'sendSchedule'
  }
})
